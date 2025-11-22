# TrustAI — The Autonomous Financial Explainability Engine

**Bridging the gap between Black-Box AI and Regulatory Trust**

TrustAI is a multi-agent autonomous system designed to make AI-driven financial decisions **transparent, secure, compliant, and user-centric**. It wraps traditional ML models with an agentic intelligence layer that explains decisions, detects fraud in real time, and provides actionable financial insights.

---

## 🚀 Key Features

### 1. 🧠 Deep Explainability — *The “Why”*
- Uses **SHAP (SHapley Additive exPlanations)** to compute the mathematical impact of every feature.
- Visual output: Green/Red bar charts showing helpful vs harmful factors.
- Humanized insights powered by **Gemini 1.5 Flash**, e.g.  
  _“Your high DTI ratio is the main blocker.”_

---

### 2. 🚨 Real-Time Watchdog — *The “Safety”*
- Continuous monitoring of financial activity streams.
- Powered by **Isolation Forest anomaly detection** via Python microservice.
- Event-driven WebSocket alerts for:
  - Sudden geo-location shifts
  - Velocity spikes
  - Suspicious transaction patterns
- Crisis Mode UI allowing administrators to instantly freeze accounts.

---

### 3. 🎛️ “What-If” Simulator — *The “Agency”*
Test financial scenarios before taking action:

> _“If I increase my income by ₹10,000, will I get approved?”_

Models re-run inference **without modifying the user's permanent record**.

---

### 4. 💬 Context-Aware Financial Chat Assistant
Not a generic chatbot—an intelligent companion.

- Accesses user's financial identity
- Understands portfolio positions  
  _“How is my Reliance stock doing?”_
- Calculates affordability, EMI capacity, spending stress, etc.

---

## 🏗️ System Architecture

```mermaid
graph TD
    subgraph Client
        UI[React + Vite Dashboard]
        Alert[Global Watchdog Overlay]
    end

    subgraph Orchestrator
        Node[Node.js + Express]
        Socket[Socket.io Server]
        Agents[AI Agents (Explain/Chat)]
    end

    subgraph Intelligence
        Python[Python Flask API]
        ML[Scikit-Learn Models]
        SHAP[SHAP Explainer]
    end

    UI -- "HTTP REST" --> Node
    Node -- "Internal API" --> Python
    Python -- "Inference" --> ML
    
    Node -- "Prompt Context" --> Agents
    Agents -- "Gemini API" --> GoogleCloud[Gemini 1.5 Flash]
    
    Python -- "Anomaly Detected (-1)" --> Node
    Node -- "Socket Event" --> UI
    UI -- "Critical Alert" --> Alert
