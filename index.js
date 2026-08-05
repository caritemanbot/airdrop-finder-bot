require("dotenv").config();

const bot = require("./services/telegram");
require("./scheduler");

console.log("🚀 TON Radar Bot is online!");

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
`🚀 Welcome to TON Radar!

The ultimate TON ecosystem assistant.

✅ Auto TON News
✅ Auto Airdrop Alerts
✅ TON Project Updates
✅ Scam Detection
✅ Wallet Tracking
✅ AI Assistant

Monitoring is active 24/7.`
  );
});

bot.on("polling_error", (error) => {
  console.error(error.message);
});
