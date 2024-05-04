const hasOwn = require('../../utils/index').hasOwn;
const Tab = require('../../classes/Tab');

module.exports = class MyTab extends Tab {
  constructor(body) {
    super(body);
    this.node = document.createElement('span');
    this.node.textContent = `${body.tabNumber} : ${body.tabPath}`;
    // Please keep this list in alphabetical order please.
    // Contenplating if I should keep role and did shit or not.
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
    },/*{
      name: 'SharkPool',
      link: 'https://www.youtube.com/@SharkPool_SP/',
    },*/];
  }
  constructNode() {
    this.node.innerHTML = '';
    const tabTitle = document.createElement('h3');
    tabTitle.textContent = 'CREDITS';
    tabTitle.setAttribute('paw-for', 'credits-title');
    const creditsHolder = document.createElement('div');
    creditsHolder.setAttribute('paw-for', 'credits-holder');
    for (const user of this.credits) {
      const userNode = document.createElement('div');
      userNode.setAttribute('paw-for', 'credits-user');
      const username = document.createElement('a');
      username.textContent = user.name;
      username.href = user.link;
      userNode.appendChild(username);
      if (hasOwn(user, 'secret')) userNode.alt = user.secret;
      creditsHolder.appendChild(userNode);
    }
    this.node.appendChild(tabTitle);
    this.node.appendChild(creditsHolder);
  }
}