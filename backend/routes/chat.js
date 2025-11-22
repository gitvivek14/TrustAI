const express = require("express");
const router = express.Router();
const chatAgent = require("../agents/chatAgent");

router.post("/", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message required" });

        const reply = await chatAgent.chat(message);
        res.json({ reply });
    } catch (e) {
        res.status(500).json({ error: "Chat failed" });
    }
});

module.exports = router;