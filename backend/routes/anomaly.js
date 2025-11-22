const express = require("express");
const router = express.Router();
const { anomalyAgent } = require("../agents/AnomalyAgent");

router.post("/", async (req, res) => {
  try {
    const { history } = req.body;
    
    // Call the upgraded agent
    const result = await anomalyAgent(history);
    
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Anomaly detection failed" });
  }
});

module.exports = router;