🛡️ TrustAI — The Autonomous Financial Explainability EngineBridging the gap between Black Box AI and Regulatory Trust.TrustAI is a multi-agent system designed to make AI-driven financial decisions transparent, secure, and compliant. It wraps traditional Machine Learning models with an intelligent agentic layer to explain decisions, detect fraud in real-time, and empower users with actionable financial advice.🚀 Key Features1. 🧠 Deep Explainability (The "Why")Instead of a simple "Approved" or "Denied," TrustAI uses SHAP (SHapley Additive exPlanations) values to calculate the mathematical weight of every feature.Visual: Green/Red bar charts showing exactly what helped or hurt the score.Human: Uses Gemini 1.5 Flash to translate these math vectors into plain English advice (e.g., "Your high DTI ratio is the main blocker.").2. 🚨 Real-Time Watchdog (The "Safety")A proactive security system that monitors transaction streams instantly.Technology: Uses an Isolation Forest algorithm running on a dedicated Python microservice.Event-Driven: Bypasses standard logging to emit Critical WebSocket Alerts immediately upon detecting anomalies (e.g., sudden IP shifts or velocity spikes).Actionable: Frontend overlays a "Crisis Mode" allowing admins to freeze accounts instantly.3. 🎛️ "What-If" Simulator (The "Agency")Empowers users to test scenarios before applying.“If I increase my income by ₹10k, will I get approved?”The system re-runs the ML inference in real-time without affecting the user's permanent record.4. 💬 Context-Aware ChatbotNot a generic support bot. The TrustAI Assistant has deep access to the user's Financial Identity.It knows your portfolio positions (e.g., "How is my Reliance stock doing?").It calculates affordability based on your real-time income.🏗️ System ArchitectureTrustAI follows a decoupled Microservices Architecture to ensure scalability and fault tolerance.graph TD
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
Tech StackLayerTechnologyUsageFrontendReact 18, TypeScript, ViteEnterprise-grade UI with Shadcn/UI & Tailwind.BackendNode.js, ExpressAPI Gateway, Agent Orchestration, Memory DB.Real-TimeSocket.ioBi-directional communication for security alerts.ML ServicePython, FlaskHosting Logistic Regression & Isolation Forest models.AI LogicGoogle Gemini 1.5 FlashNatural language generation and financial reasoning.LibrariesScikit-learn, SHAP, PandasData processing and model explainability.🛠️ Installation & SetupYou will need 3 separate terminals to run the full stack.PrerequisitesNode.js (v16+)Python (v3.9+)Google Gemini API Key (Optional, mock mode enabled by default)Step 1: Start the ML Microservice (The Brain)cd backend/models
# Create virtual env (optional but recommended)
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install flask pandas scikit-learn shap joblib requests

# Run the server
python server.py
Success: Should see 🚀 Python Server Listening on 8000...Step 2: Start the Backend (The Orchestrator)cd backend
npm install

# Run the server
node server.js
Success: Should see 🚀 Backend running on 5000 with Memory DBStep 3: Start the Frontend (The Interface)cd frontend
npm install

# Run the development server
npm run dev
Success: Open http://localhost:5173 in your browser.🎬 How to Demo (Walkthrough)The Simulator:Go to /simulator.Adjust the Salary slider to ₹80,000.Click "Run AI Prediction". Watch the probability score update in real-time.Explainability:Go to Dashboard and click on any decision card.See the "What Helped / What Hurt" charts populated by SHAP values.Read the AI-generated advice.Cyber Attack Simulation:On the Dashboard, click the [ SIMULATE ATTACK ] button (Header).Observe the Red Alert Overlay drop down instantly.Review the forensic data (IP, Location) in the alert.Contextual Chat:Open the Chat Widget (Bottom Right).Ask: "Can I afford a monthly EMI of ₹20,000?"The AI will analyze your current income from the database and give a personalized answer.📂 Project Structuretrustai/
├── frontend/                 # React + Vite Application
│   ├── src/
│   │   ├── components/       # UI Components (Alerts, Cards, Chat)
│   │   ├── pages/            # Dashboard, Simulator, Profile
│   │   └── lib/              # API connectors
│
├── backend/                  # Node.js Express Application
│   ├── agents/               # ExplainAgent, ChatAgent
│   ├── routes/               # API Endpoints
│   ├── llm/                  # Gemini Integration
│   └── server.js             # Main Entry Point + Socket.io
│
└── models/                   # Python ML Microservice
    ├── train/                # Saved .pkl Models
    └── server.py             # Flask API for Inference
🔮 Future Roadmap[ ] Vector Database (RAG): Upload PDF bank statements for the AI to read.[ ] Blockchain Audit: Log every decision to a private ledger for immutable compliance.[ ] Voice Agent: Add Text-to-Speech for accessibility.License: MITAuthors: TrustAI Team
