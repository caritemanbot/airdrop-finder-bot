const { saveNews } = require("../../services/database/news");

async function processNews(items){

    for(const item of items){

        const isNew = await saveNews(item);

        if(isNew){
            console.log("NEW:",item.title);
        }

    }

}

module.exports={
    processNews
}
