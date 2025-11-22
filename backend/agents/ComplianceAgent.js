const { callLLM } = require("../llm/llmRouter");

const COMPLIANCE_PROMPT = `
ROLE: You are a Senior Banking Compliance Officer for TrustAI.
TASK: Audit a financial decision for legal risks (Fair Lending, GDPR, ECOA).

INPUT CONTEXT:
{{CONTEXT}}

RULES:
1. "Redlining": Rejecting based on ZipCode or Location is HIGH RISK.
2. "Discrimination": Rejecting based on Age, Gender, or Ethnicity is ILLEGAL.
3. "Transparency": Approvals must have clear reasons.

OUTPUT FORMAT (Strict JSON):
{
  "audit_status": "PASS" | "FAIL" | "WARNING",
  "risk_score": 0-100,
  "flagged_issues": [
     { "issue": "Potential Redlining", "description": "ZipCode -1.2 used as heavy negative factor." }
  ],
  "citation": "Cite specific law (e.g., ECOA Regulation B, GDPR Art 22)."
}
`;

async function complianceAgent(decisionData) {
  try {
    const prompt = COMPLIANCE_PROMPT.replace("{{CONTEXT}}", JSON.stringify(decisionData, null, 2));
    const llmText = await callLLM(prompt);
    
    const cleanText = llmText.replace(/```json|```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Compliance Agent Error:", e);
    return { audit_status: "ERROR", risk_score: 0, flagged_issues: [], citation: "System Error" };
  }
}

module.exports = { complianceAgent };