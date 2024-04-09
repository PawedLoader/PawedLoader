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
    if (this._modal) this._modal = this.makeModal;
    document.body.appendChild
    this.editor.on('OPENED',)
  }

  // Events
  menuButtonClicked(event) {
    
  }

  show() {
    this._modal.showModal();
  }
  hide() {
    this._modal.hide();
  }
}
module.exports = new GUI;