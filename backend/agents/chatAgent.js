const { callLLM } = require("../llm/llmRouter");

class ChatAgent {
  async chat(userMessage) {
    // 1. GATHER CONTEXT
    const decisions = global.mockDb?.decisions || [];
    const latestDecision = decisions[0] || {};
    const portfolio = global.mockDb?.portfolio || [];

    // Calculate Portfolio Summary for the AI
    const portfolioSummary = portfolio.map(s => {
        const profit = (s.currentPrice - s.avgPrice) * s.quantity;
        const percent = ((s.currentPrice - s.avgPrice) / s.avgPrice) * 100;
        return `- ${s.symbol} (${s.name}): Own ${s.quantity} shares. Bought @ ₹${s.avgPrice}, Now ₹${s.currentPrice}. P/L: ${percent.toFixed(1)}%`;
    }).join("\n");

    const userContext = {
        creditScore: latestDecision.creditScore || 720,
        monthlyIncome: latestDecision.income || 5000,
        dtiRatio: 0.35,
    };

    // 2. CONSTRUCT THE PROMPT
    const systemPrompt = `
      ROLE: You are TrustAI, a hyper-aware Financial Advisor.
      
      USER FINANCIAL PROFILE:
      - Credit Score: ${userContext.creditScore}
      - Monthly Income: ₹${userContext.monthlyIncome}
      - Debt Ratio: ${(userContext.dtiRatio * 100).toFixed(0)}%
      
      USER STOCK PORTFOLIO (Real-time data):
      ${portfolioSummary}

      USER QUESTION: "${userMessage}"

      INSTRUCTIONS:
      1. If asked about stocks, reference the SPECIFIC data above. 
         (e.g. "Your Zomato stock is doing great, up 170%!")
      2. If asked "Should I sell?", give cautious advice based on the profit percentage.
      3. If asked about affordability, compare the cost to their Income (₹${userContext.monthlyIncome}).
      4. Keep answers short (under 3 sentences).

      ANSWER:
    `;

    try {
        const response = await callLLM(systemPrompt);
        return response.replace(/```/g, '').trim(); 
    } catch (e) {
        console.error("Chat Error:", e);
        return "System Context Error: Unable to retrieve portfolio.";
    }
  }
}

module.exports = new ChatAgent();