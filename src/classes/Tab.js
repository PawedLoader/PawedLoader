module.exports = class Tab {
  constructor(body) {
    this.body = body;
    this.node = null;
  }
  constructNode() {} // The user will override this
  get getNode() {
    this.constructNode();
    return this.node;
  }
}