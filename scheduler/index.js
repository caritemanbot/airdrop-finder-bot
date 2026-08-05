const cron=require("node-cron");

const sources=require("../modules/sources");

const newsdata=require("../modules/news/sources/newsdata");

const {processNews}=require("../modules/news");

sources.register(demo);

cron.schedule("*/10 * * * *",async()=>{

    console.log("Checking news...");

    const data=await sources.fetchAll();

    await processNews(data);

});

console.log("Scheduler Started");
