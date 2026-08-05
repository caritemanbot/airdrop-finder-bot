class SourceManager {
  constructor() {
    this.sources = [];
  }

  register(source) {
    this.sources.push(source);
  }

  async fetchAll() {
    const results = [];

    for (const source of this.sources) {
      try {
        const data = await source.fetch();
        results.push(...data);
      } catch (e) {
        console.error(e.message);
      }
    }

    return results;
  }
}

module.exports = new SourceManager();
