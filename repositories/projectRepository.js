const prisma = require("../services/prisma");

async function saveProject(project) {
  const existing = await prisma.project.findFirst({
    where: {
      name: project.name,
      source: project.source
    }
  });

  if (existing) return false;

  await prisma.project.create({
    data: project
  });

  return true;
}

module.exports = {
  saveProject
};
