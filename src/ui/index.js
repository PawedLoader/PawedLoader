const State = require('../classes/State');
const version = require('../defs').version;

// A bogus class
class StateNode extends State {
  constructor(nodeType, nodeFor, ...state) {
    super(...state);
    this.node = document.createElement(nodeType);
    this.node.setAttribute('paw-for', nodeFor);
  }
}
// The header for the UI
class UIHeader extends StateNode {
  constructor(GUI) {
    super('div', 'header');
    this.GUI = GUI;
    // Create the header
    this.createHeader();
  }
  createHeader() {
    // Create the header for the title and some buttons
    const titleNode = document.createElement('div');
    titleNode.appendChild(document.createTextNode('PawedLoader'));
    titleNode.appendChild(document.createTextNode(`v${version}`));
    titleNode.setAttribute('paw-for', 'header-title');
    // Create the close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.onclick = (event) => this.GUI.hide();
    closeButton.setAttribute('paw-for', 'modal-close');
    // Add the title and close button :thumbs_up:
    this.node.appendChild(titleNode);
    this.node.appendChild(closeButton);
  }
}
class UITabs extends StateNode {
  constructor(body) {
    super('div', 'tabs');
    this.body = body;
    // Register our TAB CHANGE event for when the tba changes
    this.register('TAB_CHANGED');
    // Set the defualt tab (the body chooses what this is, we get no rights >:3)
    this.tabNumber = body.tabNumber;
    this.tabPath = body.tabPath;
    this.tabs = {'Extensions': ['Merged', 'Unmerged', 'Gallery'], 'N-A~1': ['Packager', 'Addons', 'Themes', 'Credits']};
  }
  tabClicked(tab, event) {
    // Update the tab number and path and tell the body and us we changed the tab :shades:
    this.tabNumber = Number(tab.getAttribute('paw-tabNumber'));
    this.tabPath = String(tab.getAttribute('paw-tabPath'));
    this.emit('TAB_CHANGED', {tabNumber: this.tabNumber, tabPath: this.tabPath});
  }
  get generateTabs() {
    // Generate all the tab buttons
    let i = 0;
    // Create a section for them
    const sect = document.createElement('div');
    sect.setAttribute('paw-for', 'tab-sect');
    // For every tab group create a button
    for (const entry of Object.entries(this.tabs)) {
      // Create a body for the buttons and get the name of the tab group
      const sectName = document.createTextNode(entry[0]);
      const sectBody = document.createElement('div');
      sectBody.setAttribute('paw-for', 'tab-sect-body');
      // Get all the tabs in this tab group
      const tabs = entry[1];
      for (const tabText of tabs) {
        // Change the tba number :p
        i++;
        // Create the tab button
        const tab = document.createElement('button');
        tab.textContent = tabText;
        tab.setAttribute('paw-for', 'tab-button');
        // Assign the path and number to the button so we know what it corosponds to
        tab.setAttribute('paw-tabNumber', String(i));
        tab.setAttribute('paw-tabPath', String(`${sectName.textContent}/${tabText}`));
        // Set this to be the active tab IF the tab number is "i" (the current tab button)
        tab.setAttribute('paw-active', String(this.tabNumber === i));
        // Add the tab to the group and make it work when clicked
        tab.onclick = (event) => this.tabClicked(tab, event);
        sectBody.appendChild(tab);
      }
      // Create a wrapper for all of this
      const sectWrapper = document.createElement('div');
      sectWrapper.setAttribute('paw-for', 'tab-sect-pop');
      // If the group name does not start with N~A then we can add the section name
      if (!entry[0].startsWith('N-A')) sectWrapper.appendChild(sectName);
      // Add the section to the wrapper and the wrapper to the main section
      sectWrapper.appendChild(sectBody);
      sect.appendChild(sectWrapper);
    }
    return sect;
  }
  get getNode() {
    // Reset the HTML and generate the tabs
    this.node.innerHTML = '';
    this.node.appendChild(this.generateTabs);
    return this.node;
  }
}
// Our main body used to display tabs
class UIBody extends StateNode {
  constructor(props) {
    super('div', 'body');
    this.props = props;
    // Set the default tab number and path
    this.tabNumber = 1;
    this.tabPath = 'Extensions/Merged';
    // Create the tabs object and listen for a change so we can rerender
    this.tabs = new UITabs(this);
    this.tabs.on('TAB_CHANGED', (tabData) => this.renderTab(tabData.tabNumber, tabData.tabPath));
    // Render the initial tab so its not empty
    this.renderTab(this.tabNumber, this.tabPath);
  }
  get getTab() {
    // Get the tab in a wrapper
    const tabWrapper = document.createElement('div');
    // Get the tab's class, if it does not exist get a placeholder.
    const allTabs = require('./tabs').tabs;
    const tabClass = allTabs[this.tabPath] ?? require('./tabs').tabs['N-A'];
    // Add the tab to the tab wrapper
    const tab = new tabClass({ body: this });
    tabWrapper.appendChild(tab.getNode);
    tabWrapper.setAttribute('paw-for', 'tab-render');
    return tabWrapper;
  }
  renderTab(tabNumber, tabPath) {
    // Update the tabNumber and path and then create the tab
    this.tabNumber = tabNumber;
    this.tabPath = tabPath;
    this.node.innerHTML = '';
    this.node.appendChild(this.tabs.getNode); // We need to add back the tab selector
    this.node.appendChild(this.getTab);
  }
}
// The footer :trol:
class UIFooter extends StateNode {
  constructor(props) {
    super('div', 'footer');
    this.props = props;
  }
}
// The main UI class for creating the entire modal contents
class UI extends StateNode {
  constructor() {
    super('paw', 'main');
  }
  ui(gui) {
    // Create the header, body and footer
    const header = new UIHeader(gui);
    this.header = header;
    const body = new UIBody(gui);
    this.body = body;
    const footer = new UIFooter;
    this.footer = footer;
    // Reset the HTML and add our nodes
    this.node.innerHTML = '';
    this.node.appendChild(header.node);
    this.node.appendChild(body.node);
    this.node.appendChild(footer.node);
    return this.node;
  }
}
module.exports = new UI;
