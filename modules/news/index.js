const bot=require("../../services/telegram");

const {GROUP_ID}=require("../../config/config");

const {saveNews}=require("../../services/database/news");
const { summarizeNews } = require("../ai/gemini");

async function processNews(items){

    for(const item of items){

        const isNew=await saveNews(item);

        const aiResult = await summarizeNews(
  item.title,
  item.description || ""
);
        if(!isNew) continue;

        await bot.sendMessage(
            GROUP_ID,

`📰 TON News

${item.title}

Source:
${item.source}

${item.url}`
        );

    }

}

module.exports={
    processNews
}
