const axios = require("axios");

class SourceManager {
  constructor() {
    this.sources = [];
  }

  register(source) {
    this.sources.push(source);
    console.log(`✅ Source loaded: ${source.name}`);
  }

  async fetchAll() {
    const results = [];

    for (const source of this.sources) {
      try {
        const data = await source.fetch();
        results.push(...data);
      } catch (err) {
        console.error(`❌ ${source.name}: ${err.message}`);
      }
    }

    return results;
  }
}

module.exports = new SourceManager();
