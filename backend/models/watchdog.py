import time
import requests
import joblib
import pandas as pd
import random
import os
import json

# --- 1. SMART PATH SETUP (The Fix) ---
# This gets the absolute path of the folder this script is in
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# It looks for the model in the 'train' subfolder
MODEL_PATH = os.path.join(BASE_DIR, "train", "anomaly_model.pkl")

# Endpoint to notify when fraud is found
BACKEND_WEBHOOK_URL = "http://localhost:5000/api/webhook/anomaly"

# --- 2. LOAD THE TRAINED MODEL ---
print(f"⚙️  Loading Anomaly Model from: {MODEL_PATH}")

if not os.path.exists(MODEL_PATH):
    print(f"❌ CRITICAL ERROR: Model file not found at {MODEL_PATH}")
    print("   Please check that 'anomaly_model.pkl' is inside the 'models/train' folder.")
    exit(1)

try:
    anomaly_model = joblib.load(MODEL_PATH)
    print("✅ Model Loaded Successfully.")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    exit(1)

# --- 3. GENERATOR FUNCTIONS ---
def generate_normal_transaction():
    return {
        "credit_score": random.randint(650, 850),
        "dti_ratio": round(random.uniform(0.1, 0.4), 2),
        "late_payments_6m": 0,
        "employment_months": random.randint(24, 120),
        "monthly_income": random.randint(4000, 12000)
    }

def generate_fraud_transaction():
    return {
        "credit_score": random.randint(300, 550),
        "dti_ratio": round(random.uniform(0.6, 0.9), 2),
        "late_payments_6m": random.randint(2, 5),
        "employment_months": random.randint(0, 6),
        "monthly_income": random.randint(10000, 50000)
    }

# --- 4. MAIN LOOP ---
print("👀 Watchdog Active: Monitoring Live Transactions...")
print("-------------------------------------------------")

columns = ['credit_score','dti_ratio','late_payments_6m','employment_months','monthly_income']

while True:
    try:
        # 20% chance of fraud simulation
        if random.random() < 0.2:
            txn = generate_fraud_transaction()
            txn_type = "🔴 FRAUD SIMULATION"
        else:
            txn = generate_normal_transaction()
            txn_type = "🟢 NORMAL"

        # Predict
        df = pd.DataFrame([txn], columns=columns)
        prediction = anomaly_model.predict(df)[0]
        score = anomaly_model.decision_function(df)[0]

        if prediction == -1:
            print(f"🚨 ANOMALY DETECTED! Score: {score:.4f}")
            
            # Send alert to Node.js Backend
            try:
                requests.post(BACKEND_WEBHOOK_URL, json={
                    "transaction": txn,
                    "score": float(score),
                    "details": "Watchdog Auto-Detection"
                }, timeout=1)
                print("   -> Alert sent to Backend.")
            except:
                print("   -> ⚠️ Backend offline.")
        else:
            print(f"{txn_type} | Score: {score:.4f}")

        time.sleep(3) 

    except KeyboardInterrupt:
        break
    except Exception as e:
        print(f"⚠️ Loop Error: {e}")
        time.sleep(1)