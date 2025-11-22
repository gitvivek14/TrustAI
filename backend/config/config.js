require("dotenv").config();

module.exports.config = {
  PORT: process.env.PORT || 5000,
  MODEL_SERVER_URL: process.env.MODEL_SERVER_URL || "http://localhost:8000",

  // Gemini
  LLM_PROVIDER: process.env.LLM_PROVIDER || "gemini",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash"
};
