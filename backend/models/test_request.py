import requests

url = "http://localhost:8000/score"
data = {
    "features": {
        "credit_score": 750,
        "monthly_income": 5000,
        "dti_ratio": 0.3,
        "late_payments_6m": 0,
        "employment_months": 24
    }
}

print(f"📡 Sending request to {url}...")
try:
    response = requests.post(url, json=data, timeout=5)
    print("✅ Response Status:", response.status_code)
    print("✅ Response Body:", response.json())
except Exception as e:
    print(f"❌ Failed to connect: {e}")