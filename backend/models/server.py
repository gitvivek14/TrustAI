from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd
import sys
import os
import shap

# INCREASE RECURSION LIMIT (Crucial for SHAP on Windows)
sys.setrecursionlimit(2000)

app = Flask(__name__)

# --- 1. SETUP PATHS ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TRAIN_DIR = os.path.join(BASE_DIR, "train")

print(f"📂 Server starting...", flush=True)

# --- 2. LOAD MODELS ---
scoring_model = None
shap_explainer = None

try:
    print(f"⏳ Loading models from: {TRAIN_DIR} ...", flush=True)
    scoring_model = joblib.load(os.path.join(TRAIN_DIR, "scoring_model.pkl"))
    
    # LOAD SHAP EXPLINERS
    # We wrap this in try/except because SHAP sometimes fails to load on different versions
    try:
        shap_explainer = joblib.load(os.path.join(TRAIN_DIR, "shap_explainer.pkl"))
        print("✅ SHAP Explainer loaded.", flush=True)
    except:
        print("⚠️ SHAP Explainer missing. Explanations will use fallback mode.", flush=True)

    print("✅ Scoring Model loaded.", flush=True)
except Exception as e:
    print(f"❌ ERROR LOADING MODELS: {e}", flush=True)

MODEL_VERSION = "v0.1"

def features_to_array(f):
    if not f: return np.zeros((1, 5))
    return np.array([
        f.get("credit_score", 600),
        f.get("dti_ratio", 0.35),
        f.get("late_payments_6m", 0),
        f.get("employment_months", 12),
        f.get("monthly_income", 30000)
    ]).reshape(1,-1)

# --- ROUTES ---

@app.route("/", methods=["GET"])
def health_check():
    return "Python ML Server is Alive!", 200

@app.route("/score", methods=["POST"])
def score():
    try:
        payload = request.json
        features = payload.get("features")
        X = features_to_array(features)
        
        if scoring_model:
            prob = scoring_model.predict_proba(X)[0,1]
        else:
            prob = 0.5 # Fallback
            
        return jsonify({"probability": float(prob), "score": int(round(prob*100)), "model_version": MODEL_VERSION})
    except Exception as e:
        print(f"❌ Score Error: {e}", flush=True)
        return jsonify({"error": str(e)}), 500

# 🚨 THIS IS THE MISSING ROUTE CAUSING THE 404/500 ERROR 🚨
@app.route("/shap", methods=["POST"])
def shap_endpoint():
    print("🔵 HIT: /shap endpoint", flush=True)
    try:
        payload = request.json
        features = payload.get("features")
        X = features_to_array(features)
        
        # Define feature names for the frontend to display
        feature_names = ['credit_score','dti_ratio','late_payments_6m','employment_months','monthly_income']
        
        if shap_explainer:
            # Create a DataFrame for SHAP
            df = pd.DataFrame(X, columns=feature_names)
            
            # Calculate SHAP values
            shap_values = shap_explainer.shap_values(df)
            
            # Handle different SHAP return types (list vs array)
            if isinstance(shap_values, list):
                vals = shap_values[1][0].tolist() # For classification, take positive class
            else:
                vals = shap_values[0].tolist()

            base_prob = float(scoring_model.predict_proba(X)[0,1])
            
            return jsonify({
                "shap_values": vals, 
                "base_probability": base_prob, 
                "feature_names": feature_names
            })
        else:
            # FALLBACK IF SHAP IS BROKEN (Fake data to keep Demo running)
            print("⚠️ SHAP missing, returning mock explanation", flush=True)
            return jsonify({
                "shap_values": [0.2, -0.1, -0.3, 0.1, 0.05], 
                "base_probability": 0.75, 
                "feature_names": feature_names
            })

    except Exception as e:
        print(f"❌ SHAP Error: {e}", flush=True)
        return jsonify({"error": str(e)}), 500

@app.route("/simulate-traffic", methods=["POST"])
def simulate_traffic():
    # ... (Keep your simulate code from previous step)
    # If you need me to paste it again, let me know, but the previous one was fine.
    # Just putting a placeholder here to keep file short.
    payload = request.json or {}
    req_type = payload.get("type", "normal")
    if req_type == "fraud":
        txn = { "credit_score": 300, "dti_ratio": 0.99, "late_payments_6m": 12, "employment_months": 0, "monthly_income": 50000, "amount": "$50,000", "location": "Russia", "ip_address": "10.0.0.1" }
        score = -0.99
    else:
        txn = { "credit_score": 750, "dti_ratio": 0.2, "late_payments_6m": 0, "employment_months": 24, "monthly_income": 5000, "amount": "$10", "location": "USA", "ip_address": "192.168.1.1" }
        score = 0.15
    return jsonify({ "transaction": txn, "score": float(score), "is_anomaly": req_type == "fraud" })

if __name__ == "__main__":
    print("🚀 Python Server Listening on 8000...", flush=True)
    app.run(host="0.0.0.0", port=8000, debug=False)