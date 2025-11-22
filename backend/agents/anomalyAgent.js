const axios = require("axios");
const { callLLM } = require("../llm/llmRouter.js");
const { config } = require("../config/config.js");

// 1. UPGRADED PROMPT: Now asks for 'suggested_actions' (The Self-Healing Buttons)
const EXPLAIN_PROMPT = `
ROLE: You are TrustAI AnomalyAgent, an automated financial security bot.
TASK: Analyze the anomaly detection result from the ML model and suggest remediation steps.

INPUT DATA:
{{RESULT}}

INSTRUCTIONS:
1. Analyze the 'score' and 'features'.
2. Assign a risk level (LOW, MEDIUM, CRITICAL).
3. Generate "Self-Healing" actions based on severity:
   - If CRITICAL (e.g., huge amount, wrong location): Suggest "Freeze Account" or "Block Transaction".
   - If MEDIUM: Suggest "Request 2FA" or "Send SMS Alert".
   - If LOW: Suggest "Mark as Safe" or "Ignore".

OUTPUT FORMAT (Strict JSON only, no markdown):
{
  "summary": "Clear, human-readable explanation of why this is weird.",
  "severity": "LOW" | "MEDIUM" | "CRITICAL",
  "anomalies": [
    { "feature": "Name of feature", "reason": "Why it is an outlier", "value": "Original Value" }
  ],
  "suggested_actions": [
    { 
      "label": "Button Text (e.g., Freeze Account)", 
      "action_id": "freeze_account", 
      "style": "danger", 
      "description": "Immediately stops all funds."
    },
    { 
      "label": "Button Text (e.g., Trust This)", 
      "action_id": "whitelist_txn", 
      "style": "success", 
      "description": "Adds to safe list."
    }
  ]
}
`;

async function anomalyAgent(userHistory) {
  try {
    // 1. Get Mathematical Score from Python
    const url = `${config.MODEL_SERVER_URL}/anomaly`;
    const resp = await axios.post(url, { history: userHistory });
    const anomalyResult = resp.data;

    // 2. Get Reasoning + Actions from Gemini
    const prompt = EXPLAIN_PROMPT.replace("{{RESULT}}", JSON.stringify(anomalyResult, null, 2));
    const llmText = await callLLM(prompt);

    // 3. Parse and Return
    // We try/catch here because LLMs sometimes wrap JSON in ```json ... ```
    const cleanText = llmText.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanText);

  } catch (e) {
    console.error("Anomaly Agent Error:", e.message);
    // Fallback if Python is down or LLM fails
    return { 
      summary: "System alert: Anomaly detected but explanation unavailable.", 
      severity: "MEDIUM",
      anomalies: [], 
      suggested_actions: [] 
    };
  }
}

module.exports = { anomalyAgent };