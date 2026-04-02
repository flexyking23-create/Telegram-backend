const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());

// Your Telegram bot token (set in Render environment variables)
const BOT_TOKEN = process.env.BOT_TOKEN;

// Temporary storage for users who message the bot
let users = {};

// Endpoint for Telegram webhook
app.post("/webhook", (req, res) => {
    const message = req.body.message;
    if (message) {
        const chatId = message.chat.id;
        users[chatId] = true; // Save user chat_id
        console.log("User saved:", chatId);
    }
    res.sendStatus(200);
});

// Endpoint for sending messages from your website/dashboard
app.post("/send", async (req, res) => {
    const { chatId, text } = req.body;
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text })
        });
        res.send("Message sent");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error sending message");
    }
});

// Endpoint for mini app messages
app.post("/miniapp-message", async (req, res) => {
    const { chatId, text } = req.body;
    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text })
        });
        res.send("Delivered");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error delivering message");
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
