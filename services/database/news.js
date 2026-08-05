const prisma = require("../prisma");

async function saveNews(news){

    const exist = await prisma.news.findUnique({
        where:{
            url:news.url
        }
    });

    if(exist){
        return false;
    }

    await prisma.news.create({
        data:{
            title:news.title,
            url:news.url,
            source:news.source
        }
    });

    return true;

}

module.exports={
    saveNews
}
