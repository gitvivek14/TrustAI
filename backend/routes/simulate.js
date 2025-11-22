const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
    console.log("🟡 NODE: Received simulation request from Frontend");
    
    try {
        const features = req.body.features;
        console.log("   Forwarding to Python:", features);

        // TRY 127.0.0.1 instead of localhost to avoid Windows IPv6 issues
        // const pyRes = await axios.post("http://127.0.0.1:8000/score", { features });
        console.log("   🟡 NODE: Contacting Python ML Service at http://localhost:8000/score");
        const pyRes = await axios.post("http://localhost:8000/score", { features });
        
        console.log("   ✅ Python Responded:", pyRes.data);
        
        const { probability, score } = pyRes.data;

        // Save to Memory DB
        const newDecision = {
            id: Date.now().toString(),
            type: "Loan Application",
            status: probability > 0.6 ? "approved" : "denied",
            approvalProbability: probability,
            creditScore: features.credit_score,
            income: features.monthly_income,
            timestamp: new Date().toISOString()
        };
        
        if (global.mockDb) {
            global.mockDb.decisions.unshift(newDecision);
        }

        res.json({ ...pyRes.data, decisionId: newDecision.id });

    } catch (e) {
        console.error("❌ NODE ERROR: Could not talk to Python");
        console.error("   Details:", e.message);
        
        // Send error back to frontend so button stops spinning
        res.status(500).json({ error: "ML Service Unavailable" });
    }
});

module.exports = router;