const fs  = require("fs");
const path  = require("path");
const  {callLLM} = require("../llm/llmRouter");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "../llm/prompts/explain_prompt.txt"),
  "utf8"
);
;

async function dataControlAgent(toggles) {
  const prompt = TEMPLATE.replace(
    "{{TOGGLES}}",
    JSON.stringify(toggles, null, 2)
  );

  const output = await callLLM(prompt);

  try {
    return JSON.parse(output);
  } catch (err) {
    return { summary: output, impacts: [] };
  }
}
module.exports = { dataControlAgent };
