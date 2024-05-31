module.exports = class Tab {
  constructor(props) {
    this.body = props.body;
    this.node = null;
  }
  constructNode() {} // The user will override this
  get getNode() {
    // Make the node and return it
    // this is a default, it can be overridden
    this.constructNode();
    return this.node;
  }
}