const State = require('../classes/State');
const version = require('../defs').version;
class StateNode extends State {
  constructor(nodeType, nodeFor, ...state) {
    super(...state);
    this.node = document.createElement(nodeType);
    this.node.setAttribute('paw-for', nodeFor);
  }
}
class UIHeader extends StateNode {
  constructor(GUI) {
    super('div', 'header');
    this.GUI = GUI;
    this.createHeader();
  }
  createHeader() {
    const titleNode = document.createElement('div');
    titleNode.appendChild(document.createTextNode('PawedLoader'));
    titleNode.appendChild(document.createTextNode(`v${version}`));
    titleNode.setAttribute('paw-for', 'header-title');
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.onclick = (event) => this.GUI.hide();
    closeButton.setAttribute('paw-for', 'modal-close');
    this.node.appendChild(titleNode);
    this.node.appendChild(closeButton);
  }
}
class UITabs extends StateNode {
  constructor(body) {
    super('div', 'tabs');
    this.body = body;
    this.register('TAB_CHANGED');
    this.tabNumber = body.tabNumber;
    this.tabPath = body.tabPath;
    this.tabs = {'Extensions': ['Merged', 'Unmerged', 'Gallery'], 'N/A~1': ['Packager', 'Addons', 'Themes']};
  }
  tabClicked(tab, event) {
    this.tabNumber = Number(tab.getAttribute('paw-tabNumber'));
    this.tabPath = String(tab.getAttribute('paw-tabPath'));
    this.emit('TAB_CHANGED', {tabNumber: this.tabNumber, tabPath: this.tabPath});
  }
  get generateTabs() {
    let i = 0;
    const sect = document.createElement('div');
    sect.setAttribute('paw-for', 'tab-sect');
    for (const entry of Object.entries(this.tabs)) {
      const sectName = document.createTextNode(entry[0]);
      const sectBody = document.createElement('div');
      sectBody.setAttribute('paw-for', 'tab-sect-body');
      const tabs = entry[1];
      for (const tabText of tabs) {
        i++;
        const tab = document.createElement('button');
        tab.textContent = tabText;
        tab.setAttribute('paw-for', 'tab-button');
        tab.setAttribute('paw-tabNumber', String(i));
        tab.setAttribute('paw-tabPath', String(`${sectName.textContent}/${tabText}`));
        tab.setAttribute('paw-active', String(this.tabNumber === i));
        tab.onclick = (event) => this.tabClicked(tab, event);
        sectBody.appendChild(tab);
      }
      const sectWrapper = document.createElement('div');
      sectWrapper.setAttribute('paw-for', 'tab-sect-pop');
      if (!entry[0].startsWith('N/A')) sectWrapper.appendChild(sectName);
      sectWrapper.appendChild(sectBody);
      sect.appendChild(sectWrapper);
    }
    return sect;
  }
  get getNode() {
    this.node.innerHTML = '';
    this.node.appendChild(this.generateTabs);
    return this.node;
  }
}
class UIBody extends StateNode {
  constructor() {
    super('div', 'body');
    this.tabNumber = 1;
    this.tabPath = 'Extensions/Merged';
    this.tabs = new UITabs(this);
    this.tabs.on('TAB_CHANGED', (tabData) => this.renderTab(tabData.tabNumber, tabData.tabPath));
    this.renderTab(this.tabNumber, this.tabPath);
  }
  get getTab() {
    const tabWrapper = document.createElement('div');
    const allTabs = require('./tabs').tabs;
    const tabClass = allTabs[this.tabPath] ?? require('./tabs').tabs['N/A'];
    const tab = new tabClass(this);
    tabWrapper.appendChild(tab.getNode);
    tabWrapper.setAttribute('paw-for', 'tab-render');
    return tabWrapper;
  }
  renderTab(tabNumber, tabPath) {
    this.tabNumber = tabNumber;
    this.tabPath = tabPath;
    this.node.innerHTML = '';
    this.node.appendChild(this.tabs.getNode);
    this.node.appendChild(this.getTab);
  }
}
class UIFooter extends StateNode {
  constructor() {
    super('div', 'footer');
  }
}
class UI extends StateNode {
  constructor() {
    super('paw', 'main');
  }
  ui(gui) {
    const header = new UIHeader(gui);
    this.header = header;
    const body = new UIBody;
    this.body = body;
    const footer = new UIFooter;
    this.footer = footer;
    this.node.innerHTML = '';
    this.node.appendChild(header.node);
    this.node.appendChild(body.node);
    this.node.appendChild(footer.node);
    return this.node;
  }
}
module.exports = new UI;
