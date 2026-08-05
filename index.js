require("dotenv").config();

const bot = require("./services/telegram");

console.log("🚀 TON Radar is running...");

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
`🚀 Welcome to TON Radar!

Your automated TON ecosystem assistant.

Available modules

📰 TON News
🚀 Airdrops
🛡 Scam Detection
📊 Polls
🏆 Reputation
🤖 AI Assistant

Monitoring is active 24/7.`
  );
});

bot.on("polling_error", console.log);
