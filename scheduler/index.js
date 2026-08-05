const cron = require("node-cron");

const sources = require("../modules/sources");
const demo = require("../modules/news/sources/demo");

sources.register(demo);

cron.schedule("*/10 * * * *", async () => {

    console.log("Checking sources...");

    const news = await sources.fetchAll();

    console.log(news);

});

console.log("Scheduler started.");
