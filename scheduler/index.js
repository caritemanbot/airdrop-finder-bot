const cron = require("node-cron");
const { checkTONNews } = require("../modules/news");

cron.schedule("*/10 * * * *", () => {
    checkTONNews();
});

console.log("Scheduler started.");
