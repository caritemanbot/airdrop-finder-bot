const bot = require("../../services/telegram");
const { GROUP_ID } = require("../../config/config");

const { saveProject } = require("../../repositories/projectRepository");
const { analyzeProject } = require("../ai/projectAnalysis");

async function processProjects(items) {
  for (const item of items) {

    const isNew = await saveProject(item);

    if (!isNew) continue;

    const analysis = await analyzeProject(item);

    await bot.sendMessage(
      GROUP_ID,
`🆕 NEW PROJECT

${item.name}

${analysis}

🌐 ${item.website || "N/A"}`
    );
  }
}

module.exports = {
  processProjects
};
