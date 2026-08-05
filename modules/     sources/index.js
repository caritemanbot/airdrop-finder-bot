class SourceManager {
  constructor() {
    this.sources = [];
  }

  register(source) {
    this.sources.push(source);
    console.log(`Loaded: ${source.name}`);
  }

  async fetchAll() {
    let results = [];

    for (const source of this.sources) {
      try {
        const data = await source.fetch();
        results.push(...data);
      } catch (err) {
        console.error(err.message);
      }
    }

    return results;
  }
}

module.exports = new SourceManager();
