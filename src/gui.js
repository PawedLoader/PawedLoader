const minilog = require('./utils/minilog');

const EventEmitter = require('./classes/EventEmitter');
const MenuBarButton = require('./classes/MenuBarButton');
const ScratchZ = require('./utils/scratchz');

class GUI extends EventEmitter {
  constructor() {
    super();
    // Setup events
    this.register('ASSETS_LOADED');
    // Importing some classes
    this.editor = require('./editor');
    this.addons = require('./addons/manager');
    this.assets = require('./ui/assets');
    // Making the ui componnents
    this._modal = null;
    this._menubutton = this.makeButton;
  }

  // Makers
  get makeButton() {
    const menuButton = new MenuBarButton('PawedLoader', null, false);
    menuButton.node.addEventListener('click', (event) => this.menuButtonClicked(event));
    return menuButton;
  }
  get makeModal() {
    if (this._modal) this._modal.remove();
    const modal = document.createElement('dialog');
    document.body.appendChild(modal);
    this._modal = modal;
    this.constructGUI();
    return modal;
  }
  
  // Setup
  setupAllGUI() {
    if (this._modal) {
      try { this._modal.remove() } catch {};
    }
    this._modal = this.makeModal;
    this.regenButton();
    minilog.log('GUI Built');
  }
  async setup() {
    this.editor.once('GUI_LOADED', () => {
      if (this.editor.inEditor) this.editor.emit('SCRATCHBLOCKS', ScratchZ.Blocks);
    });
    this.assets.loadAssets().then(() => {
      this.emit('ASSETS_LOADED');
      minilog.log('Assets loaded!');
      this.editor.on('OPENED/gui_events', () => this.regenButton());
      this.editor.on('CLOSED/gui_events', () => this.regenButton());
      this.setupAllGUI();
    });
  }

  // Button stuff
  regenButton() {
    if (this._menubutton) try { this._menubutton.remove() } catch {};
    this._menubutton = this.makeButton;
    this._menubutton.show();
  }

  // Events
  menuButtonClicked(event) {
    this.show();
  }

  // GUI
  constructGUI() {
    const temp = document.createElement('img');
    temp.src = this.assets.get('icon');
    temp.width = 16;
    temp.height = 16;
    this._modal.appendChild(temp);
  }

  show() {
    this._modal = this.makeModal;
    this._modal.showModal();
  }

  hide() {
    this._modal.innerHTML = '';
    this._modal.hide();
  }
}
module.exports = new GUI;