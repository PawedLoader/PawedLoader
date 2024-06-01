const Tab = require('../../classes/Tab');
let Packager = null;

module.exports = class MyTab extends Tab {
  constructor(props) {
    super(props);
    const body = props.body;
    this.node = document.createElement('span');
    if (!Packager) Packager = ''; //require('../documents/turbowarp-packager-standalone.html');
    this.node.textContent = 'WIP';
  }
}