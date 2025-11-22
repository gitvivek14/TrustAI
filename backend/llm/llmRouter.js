const { config }  = require( "../config/config.js");

// Gemini SDK
const { GoogleGenAI }   = require("@google/genai");

// Initialize client
const ai = new GoogleGenAI({
  apiKey: config.GEMINI_API_KEY
});

console.log("Using Gemini model:", config.GEMINI_API_KEY);


// Main function to generate text
async function callLLM(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: config.GEMINI_MODEL,
      contents: prompt
    });

    return response.text; // new Gemini .text() API
  } catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message);
    throw new Error("Gemini request failed: " + err.message);
  }
}

module.exports = { callLLM };