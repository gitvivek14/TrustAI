const express = require("express");
const router = express.Router();
const explainAgent = require("../agents/ExplainAgent");

router.post("/", async (req, res) => {
  try {
    // Expecting { features: { ... } } from frontend
    // OR { credit_score: 700, ... } directly
    const features = req.body.features || req.body; 

    // Call the Agent
    const analysis = await explainAgent.analyze(features);
    
    res.json(analysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Explanation failed" });
  }
});

module.exports = router;