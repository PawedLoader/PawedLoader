const EventEmitter = require('./classes/EventEmitter');
const MenuBarButton = require('./classes/MenuBarButton');
const ScratchZ = require('./utils/scratchz');

class GUI extends EventEmitter {
  constructor() {
    super();
    // Setup events
    this.register('ASSETS_LOADED');
    this.state = new EventEmitter();
    this.state.register('ui/render');
    // Importing some classes
    this.editor = require('./editor');
    this.assets = require('./ui/assets');
    // Making the ui componnents
    this._modal = this.makeModal;
    this._menubutton = this.makeButton;
  }

  // Makers
  get makeButton() {
    const menuButton = new MenuBarButton('PawedLoader', null, false);
    menuButton.node.addEventListener('click', (event) => this.menuButtonClicked(event));
    return menuButton;
  }
  get makeModal() {
    return document.createElement('dialog');
  }
  
  // Setup
  setupAllGUI() {
    if (this._modal) {
      try { this._modal.remove() } catch {};
      this._modal = this.makeModal;
    }
    document.body.appendChild(this._modal);
    this.regenButton();
  }
  async setup() {
    this.editor.once('GUI_LOADED', () => {
      if (this.editor.inEditor) this.editor.emit('SCRATCHBLOCKS', ScratchZ.Blocks);
    });
    this.assets.loadAssets().then(() => {
      this.emit('ASSETS_LOADED');
      this.editor.on('OPENED/gui_events', () => this.regenButton());
      this.editor.on('CLOSED/gui_events', () => this.regenButton());
      if (this.editor.GUIavailable) this.setupAllGUI();
      else this.editor.on('GUI_LOADED', () => this.setupAllGUI());
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
  }

  show() {
    this._modal.innerHTML = '';
    this.constructGUI();
    this._modal.showModal();
  }

  hide() {
    this._modal.innerHTML = '';
    this._modal.hide();
  }
}
module.exports = new GUI;