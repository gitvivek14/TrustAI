# models/train/generate_synthetic.py
import pandas as pd
import numpy as np

N = 20000
rng = np.random.default_rng(42)

credit_score = rng.integers(300, 800, N)
monthly_income = rng.integers(8000, 200000, N)
dti_ratio = rng.random(N) * 0.8
late_payments_6m = rng.integers(0, 4, N)
employment_months = rng.integers(1, 240, N)

# base approval probability (synthetic)
z = -2 + 0.004 * credit_score - 1.5 * dti_ratio - 0.2 * late_payments_6m + 0.01 * employment_months + 0.00002 * monthly_income
prob = 1 / (1 + np.exp(-z))
approved = rng.random(N) < prob

df = pd.DataFrame({
    "credit_score": credit_score,
    "monthly_income": monthly_income,
    "dti_ratio": dti_ratio,
    "late_payments_6m": late_payments_6m,
    "employment_months": employment_months,
    "approved": approved.astype(int)
})

df.to_csv("models/train/synthetic_financial_data.csv", index=False)
print("Synthetic dataset saved to models/train/synthetic_financial_data.csv")
