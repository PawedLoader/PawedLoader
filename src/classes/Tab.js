module.exports = class Tab {
  constructor(body) {
    this.body = body;
    this.node = null;
  }
  get getNode() {
    return this.node;
  }
}