const  express  = require("express");
const { dataControlAgent }  = require("../agents/dataControlAgent");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const toggles = req.body;
    const result = await dataControlAgent(toggles);
    res.json({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, error: err.message });
  }
});

module.exports = router;
