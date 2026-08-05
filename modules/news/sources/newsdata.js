const axios = require("axios");
const { NEWSDATA_API_KEY } = require("../../../config/config");

module.exports = {
  name: "NewsData",

  async fetch() {
    const url =
      "https://newsdata.io/api/1/news";

    const { data } = await axios.get(url, {
      params: {
        apikey: NEWSDATA_API_KEY,
        q: "TON OR Telegram OR blockchain OR crypto OR web3",
        language: "en"
      }
    });

    if (!data.results) return [];

    return data.results.map((item) => ({
      title: item.title,
      url: item.link,
      source: item.source_id || "NewsData"
    }));
  }
};
