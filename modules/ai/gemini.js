const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function summarizeNews(title, description = "") {
  const prompt = `
You are an expert Web3 news analyst.

Summarize the following news in under 50 words.

Then return JSON in this format:

{
  "summary":"",
  "category":"",
  "score":0
}

Title:
${title}

Description:
${description}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text;
  return text;
}

module.exports = {
  summarizeNews,
};
