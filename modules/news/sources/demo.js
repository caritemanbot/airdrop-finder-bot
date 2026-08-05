module.exports = {
  name: "Demo Source",

  async fetch() {
    return [
      {
        title: "TON Demo News",
        url: "https://example.com/news-1",
        source: "Demo"
      }
    ];
  }
};
