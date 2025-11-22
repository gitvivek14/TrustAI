const axios = require("axios");
const { config }  = require( "../config/config.js");

async function  simulatorAgent(modifiedFeatures) {
  const url = `${config.MODEL_SERVER_URL}/score`;
  const resp = await axios.post(url, { features: modifiedFeatures });
  return resp.data; // should include probability and score
}

module.exports = { simulatorAgent };
