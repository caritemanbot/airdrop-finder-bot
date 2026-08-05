require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

const token = process.env.BOT_TOKEN;

if (!token) {
  throw new Error("BOT_TOKEN is missing.");
}

const bot = new TelegramBot(token, {
  polling: true,
});

console.log("🚀 Airdrop Finder Bot is now online!");

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
`👋 Welcome to Airdrop Finder!

Your all-in-one Telegram bot for discovering TON ecosystem opportunities.

Features:
🚀 Latest Airdrops
📰 TON News
📊 Community Polls
🛡 Scam Link Detection
📅 Event Reminders
🏆 Reputation System
🤖 AI Assistant (Coming Soon)

Stay tuned for automatic updates!`
  );
});

bot.on("polling_error", (error) => {
  console.error(error.message);
});
