const Tab = require('../../classes/Tab');
module.exports = class MyTab extends Tab {
  constructor(body) {
    super(body);
    this.node = document.createElement('span');
    this.node.textContent = `${body.tabNumber} : ${body.tabPath}`;
  }
}