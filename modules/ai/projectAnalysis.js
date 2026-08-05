const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

async function analyzeProject(project) {
  const prompt = `
Analyze this Web3 project.

Project:
${project.name}

Description:
${project.description}

Return a short analysis under 80 words.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt
  });

  return response.text;
}

module.exports = {
  analyzeProject
};
