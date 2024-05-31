const hasOwn = require('../../utils/index').hasOwn;
const Tab = require('../../classes/Tab');

// The credits tab
module.exports = class MyTab extends Tab {
  constructor(props) {
    super(props);
    const body = props.body;
    // Create the inital node for when its "unloaded"
    this.node = document.createElement('span');
    this.node.textContent = `${body.tabNumber} : ${body.tabPath}`;
    // List of contributors to turn into 
    // Please keep this list in alphabetical order please.
    this.credits = [{
      name: 'Ashime',
      link: 'https://github.com/Ashimee/',
      secret: 'Made all the internals bub.',
    }, {
      name: 'Drago-Cuven',
      link: 'https://github.com/Drago-Cuven/',
    }, {
      name: 'ObviousAlexC',
      link: 'https://github.com/ObviousAlexC/',
      secret: 'Pen+ guy :>',
    }];
  }
  constructNode() {
    // Reset the HTML for the node as we remake it when the tab is opened
    this.node.innerHTML = '';
    // Create the tab title and set it to "CREDITS"
    const tabTitle = document.createElement('h3');
    tabTitle.textContent = 'CREDITS';
    tabTitle.setAttribute('paw-for', 'credits-title');
    // Create a div to hold all! of our credits
    const creditsHolder = document.createElement('div');
    creditsHolder.setAttribute('paw-for', 'credits-holder');
    // Convert all the users in the "credits" array to anchor tags and add then to the creditsHolder
    for (const user of this.credits) {
      // Make the user their own div cause why not
      const userNode = document.createElement('div');
      userNode.setAttribute('paw-for', 'credits-user');
      // Create the anchor tag and add it to the userNode div
      const username = document.createElement('a');
      username.textContent = user.name;
      username.href = user.link;
      userNode.appendChild(username);
      // Ooo secret (just some hover text :thumbs_up:)
      if (hasOwn(user, 'secret')) userNode.title = user.secret;
      // Add the userNode to the creditsHolder so you can see it
      creditsHolder.appendChild(userNode);
    }
    // Adding all the stuff we just made to the node so we can see it
    this.node.appendChild(tabTitle);
    this.node.appendChild(creditsHolder);
  }
}