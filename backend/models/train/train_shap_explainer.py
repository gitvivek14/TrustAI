# models/train/train_shap_explainer.py
import joblib
import pandas as pd
import shap
from sklearn.ensemble import RandomForestClassifier

# Load data
df = pd.read_csv("models/train/synthetic_financial_data.csv")
X = df[['credit_score','dti_ratio','late_payments_6m','employment_months','monthly_income']]
y = df['approved']

# Use a tree model for shap explainer (TreeSHAP)
rf = RandomForestClassifier(n_estimators=100)
rf.fit(X, y)

explainer = shap.TreeExplainer(rf)
# Save explainer and a model for local SHAP calculations
joblib.dump(rf, "models/train/shap_model.pkl")
joblib.dump(explainer, "models/train/shap_explainer.pkl")
print("Saved shap model and explainer.")
