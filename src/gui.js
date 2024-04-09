const EventEmitter = require('./classes/EventEmitter');
const MenuBarButton = require('./classes/MenuBarButton');

class GUI extends EventEmitter {
  constructor() {
    // Importing some classes
    this.editor = require('./editor');
    this._modal = this.makeModal;
    this._menubutton = this.makeButton;
  }

  // Makers
  get makeButton() {
    const menuButton = new MenuBarButton('<h1>Pawloader</h1>', null, false);
    menuButton.node.addEventListener('click', (event) => this.menuButtonClicked(event));
    return menuButton;
  }
  get makeModal() {
    return document.createElement('dialog');
  }
  
  // Setup
  setup() {
    if (this._modal) {
      try { this._modal.remove() } catch {};
      this._modal = this.makeModal;
    }
    document.body.appendChild(this._modal);
    this.editor.on('OPENED', this.regenButton);
    this.editor.on('CLOSED', this.regenButton);
  }

  // Button stuff
  regenButton() {
    this._menubutton = this.makeButton;
    this._menubutton.show();
  }

  // Events
  menuButtonClicked(event) {
    this.show();
  }

  show() {
    this._modal.showModal();
  }
  hide() {
    this._modal.hide();
  }
}
module.exports = new GUI;