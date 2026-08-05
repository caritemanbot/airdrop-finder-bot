const cron = require("node-cron");

cron.schedule("*/10 * * * *", () => {
  console.log("⏰ Scheduler is running...");
});

console.log("✅ Scheduler started.");
