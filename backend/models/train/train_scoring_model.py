# models/train/train_scoring_model.py
import pandas as pd
from sklearn.linear_model import LogisticRegression
import joblib

df = pd.read_csv("models/train/synthetic_financial_data.csv")
X = df[['credit_score','dti_ratio','late_payments_6m','employment_months','monthly_income']]
y = df['approved']

model = LogisticRegression(max_iter=1000)
model.fit(X, y)

joblib.dump(model, "models/train/scoring_model.pkl")
print("Saved scoring model at models/train/scoring_model.pkl")
