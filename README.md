TrustAI — The Autonomous Financial Explainability Engine

Bridging the gap between Black Box AI and Regulatory Trust.

TrustAI is a multi-agent system designed to make AI-driven financial decisions transparent, secure, and compliant. It wraps traditional Machine Learning models with an intelligent agentic layer to explain decisions, detect fraud in real-time, and empower users with actionable financial advice.

🚀 Key Features

1. Deep Explainability (The "Why")

Instead of a simple "Approved" or "Denied," TrustAI uses SHAP (SHapley Additive exPlanations) values to calculate the mathematical weight of every feature.

Visual: Green/Red bar charts showing exactly what helped or hurt the score.

Human: Uses Gemini 1.5 Flash to translate these math vectors into plain English advice (e.g., "Your high DTI ratio is the main blocker.").

2. Real-Time Watchdog (The "Safety")

A proactive security system that monitors transaction streams instantly.

Technology: Uses an Isolation Forest algorithm running on a dedicated Python microservice.

Event-Driven: Bypasses standard logging to emit Critical WebSocket Alerts immediately upon detecting anomalies (e.g., sudden IP shifts or velocity spikes).

Actionable: Frontend overlays a "Crisis Mode" allowing admins to freeze accounts instantly.

3. "What-If" Simulator (The "Agency")

Empowers users to test scenarios before applying.

“If I increase my income by ₹10k, will I get approved?”

The system re-runs the ML inference in real-time without affecting the user's permanent record.

4. Context-Aware Chatbot

Not a generic support bot. The TrustAI Assistant has deep access to the user's Financial Identity.

It knows your portfolio positions (e.g., "How is my Reliance stock doing?").

It calculates affordability based on your real-time income.
