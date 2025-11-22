const axios = require("axios");
const { callLLM } = require("../llm/llmRouter");
const { config } = require("../config/config");

class ExplainAgent {
  async analyze(userFeatures) {
    console.log("🔍 ExplainAgent: Analyzing...", userFeatures);

    try {
      // 1. Get Math from Python
      // We use localhost to ensure connection works
      const pyUrl = "http://localhost:8000/shap"; 
      const pyRes = await axios.post(pyUrl, { features: userFeatures });
      
      const { shap_values, feature_names, base_probability } = pyRes.data;

      // 2. Translate Math to "Factors" for Frontend
      const factors = feature_names.map((name, index) => {
        const val = shap_values[index];
        return {
          feature: this.formatFeatureName(name),
          // SHAP value > 0 means it pushed probability UP (Positive)
          // SHAP value < 0 means it pushed probability DOWN (Negative)
          impact: val > 0 ? "positive" : (val < 0 ? "negative" : "neutral"),
          weight: Math.abs(val).toFixed(2),
          originalValue: userFeatures[name]
        };
      });

      // Sort by weight (importance)
      factors.sort((a, b) => b.weight - a.weight);

      // 3. Ask Gemini for "Human Advice"
      // We construct a prompt using the calculated factors
      const prompt = `
        ROLE: Financial Advisor AI.
        CONTEXT: A user's loan application has a base probability of ${(base_probability * 100).toFixed(1)}%.
        
        TOP FACTORS DRIVING THE SCORE:
        ${JSON.stringify(factors.slice(0, 3))}

        TASK: Generate 3 specific, actionable bullet points on how this user can improve their odds.
        
        OUTPUT FORMAT (JSON array of strings ONLY):
        ["Tip 1...", "Tip 2...", "Tip 3..."]
      `;

      let advice = ["Reduce your Debt-to-Income ratio.", "Maintain consistent employment."]; // Fallback
      try {
        const llmResponse = await callLLM(prompt);
        // Clean up markdown if Gemini adds it
        const cleanJson = llmResponse.replace(/```json|```/g, '').trim();
        advice = JSON.parse(cleanJson);
      } catch (err) {
        console.warn("⚠️ Gemini advice failed, using fallback.");
      }

      // 4. Return the Final Package to Frontend
      return {
        probability: base_probability,
        factors: factors,
        advice: advice
      };

    } catch (error) {
      console.error("❌ ExplainAgent Error:", error.message);
      throw new Error("Failed to explain decision");
    }
  }

  formatFeatureName(name) {
    // Converts "monthly_income" -> "Monthly Income"
    return name.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

module.exports = new ExplainAgent();