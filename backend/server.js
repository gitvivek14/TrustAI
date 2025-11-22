const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios"); // Request python
const explainRoute = require("./routes/explain.js");
const simulateRoute = require("./routes/simulate.js");
const anomalyRoute = require("./routes/anomaly.js");
const dataControlRoute = require("./routes/dataControl.js");
const chatRoute = require("./routes/chat.js");

const app = express();
const server = http.createServer(app);

// --- 1. IN-MEMORY DATABASE (The "Memory") ---
// This replaces your frontend mockData.ts
global.mockDb = {
  decisions: [
    // Seed with one example
    { id: "1", type: "Credit Card", status: "approved", approvalProbability: 0.88, creditScore: 750, income: 65000, timestamp: new Date().toISOString() }
  ],
  anomalies: [],
  dataSettings: [
    { id: "location", name: "Location Tracking", enabled: true },
    { id: "history", name: "Transaction History", enabled: true },
    { id: "social", name: "Social Media verification", enabled: false }, // Add this
    { id: "biometric", name: "Biometric Data", enabled: true }
  ],
  portfolio: [
    { symbol: "RELIANCE", name: "Reliance Industries", quantity: 45, avgPrice: 2400, currentPrice: 2850, sector: "Energy" },
    { symbol: "TATASTEEL", name: "Tata Steel", quantity: 120, avgPrice: 110, currentPrice: 142, sector: "Materials" },
    { symbol: "HDFCBANK", name: "HDFC Bank", quantity: 30, avgPrice: 1500, currentPrice: 1650, sector: "Finance" },
    { symbol: "ZOMATO", name: "Zomato Ltd", quantity: 500, avgPrice: 65, currentPrice: 180, sector: "Tech" }
  ]
};

const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

app.use(cors());
app.use(express.json());
app.set("socketio", io);

// --- 2. REAL API ROUTES ---

// A. Dashboard Data (Get list of all decisions)
app.get("/api/decisions", (req, res) => {
    // Return sorted by newest first
    const sorted = global.mockDb.decisions.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json(sorted);
});

// B. Get Single Decision (For Details Page)
app.get("/api/decisions/:id", (req, res) => {
    const decision = global.mockDb.decisions.find(d => d.id === req.params.id);
    if (!decision) return res.status(404).json({ error: "Not found" });
    res.json(decision);
});

// C. Get Anomalies (For Anomalies Page)
app.get("/api/anomalies/history", (req, res) => {
    res.json(global.mockDb.anomalies);
});

// D. Settings (For Data Controls Page)
app.get("/api/settings", (req, res) => res.json(global.mockDb.dataSettings));
app.post("/api/settings/toggle", (req, res) => {
    const { id, enabled } = req.body;
    const setting = global.mockDb.dataSettings.find(s => s.id === id);
    if (setting) setting.enabled = enabled;
    res.json({ success: true });
});

// backend/server.js

// 🚨 NEW: User Profile Endpoint (Simulates an MCP Server Fetch)
app.get("/api/user/profile", (req, res) => {
    // In a real app, this comes from a database or Financial MCP
    const profile = {
        identity: {
            name: "Alex Johnson",
            email: "alex.j@example.com",
            id: "USR-8821-X",
            joined: "2023-01-15",
            verificationLevel: "Tier 3 (Biometric)"
        },
        financials: {
            monthlyIncome: 65000, // Matches your simulation defaults
            creditScore: 750,
            dtiRatio: 0.35,
            savingsBalance: 125000,
            totalDebt: 45000,
            currency: "INR"
        },
        // We pull the portfolio from the global mockDb we created earlier
        portfolio: global.mockDb.portfolio || [],
        connectedAccounts: [
            { bank: "HDFC Bank", type: "Savings", last4: "4421", status: "Active" },
            { bank: "ICICI Bank", type: "Credit Card", last4: "8892", status: "Active" }
        ]
    };
    
    res.json(profile);
});

// --- 3. AGENT ROUTES ---
app.use("/api/explain", explainRoute);
app.use("/api/simulate", simulateRoute);
app.use("/api/anomaly", anomalyRoute);
app.use("/api/data-controls", dataControlRoute);
// Add this near your other routes

app.use("/api/chat", chatRoute);

// --- 4. DEMO TRIGGER (The Attack Button) ---
app.post("/api/demo/trigger-attack", async (req, res) => {
    try {
        // Call Python to get fake fraud data
       const pythonRes = await axios.post("http://localhost:8000/simulate-traffic", { 
            type: "fraud" 
        });
        const { transaction, score } = pythonRes.data;

        // Save to History
        const newAnomaly = {
            id: Date.now().toString(),
            type: "Fraud Simulation",
            severity: "CRITICAL",
            description: "Simulated Cyber Attack via Dashboard",
            details: transaction,
            timestamp: new Date().toISOString()
        };
        global.mockDb.anomalies.unshift(newAnomaly);

        // Alert Frontend
        const io = req.app.get("socketio");
        io.emit("ANOMALY_ALERT", { ...newAnomaly, score });

        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Simulation failed" });
    }
});

server.listen(5000, () => console.log("🚀 Backend running on 5000 with Memory DB"));