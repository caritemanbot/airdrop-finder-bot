require("dotenv").config();

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  GROUP_ID: process.env.GROUP_ID,
  DATABASE_URL: process.env.DATABASE_URL,
  NEWSDATA_API_KEY: process.env.NEWSDATA_API_KEY
};
