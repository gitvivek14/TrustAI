# models/train/train_anomaly_model.py
import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib

df = pd.read_csv("models/train/synthetic_financial_data.csv")
# Use continuous features for anomaly
X = df[['credit_score','dti_ratio','late_payments_6m','employment_months','monthly_income']]

if_model = IsolationForest(n_estimators=200, contamination=0.02, random_state=42)
if_model.fit(X)

joblib.dump(if_model, "models/train/anomaly_model.pkl")
print("Saved anomaly model at models/train/anomaly_model.pkl")
