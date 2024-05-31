const EventEmitter = require('./classes/EventEmitter');
const MenuBarButton = require('./classes/MenuBarButton');

class GUI extends EventEmitter {
  constructor(props) {
    super();
    // Setup events
    this.register('ASSETS_LOADED');
    // Importing some classes
    this.props = props;
    this.minilog = props.minilog;
    this.editor = props.editor;
    this.addons = props.addons;
    this.assets = props.assets;
    this.DB = props.db;
    this.Scratch = props.Scratch;
    // Style sheet
    this.styles = document.createElement('style');
    this.styles.css = require('./ui/css');
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

    const background = document.createElement('div');
    background.style.backgroundColor = 'var(--ui-modal-overlay)';
    background.style.zIndex = "1500";
    background.style.position = "absolute";
    background.style.top = "0px";
    background.style.left = "0px";
    background.style.width = "100%";
    background.style.height = "100%";
    document.body.appendChild(background);

    //Create the modal element and append it to the document
    const modal = document.createElement('div');
    modal.style.width = "auto";
    modal.style.height = "60%";
    modal.style.aspectRatio = "5/3";
    modal.style.backgroundColor = 'var(--ui-modal-background)';
    modal.style.position = "absolute";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%,-50%)";
    modal.style.borderStyle = "solid";
    modal.style.borderRadius = "0.5rem";
    modal.style.borderWidth = "4px";
    modal.style.borderColor = "var(--ui-white-transparent)";

    modal.remove = () => {
      document.body.removeChild(background);
      this._modal = null;
    }

    //Add our functions to show and remove modals
    modal.showModal = () => {
      document.body.appendChild(background);
    };

    background.appendChild(modal);

    //Set attributes and text contents
    modal.setAttribute('paw-for', 'modal');
    this.styles.textContent = this.styles.css.get();
    modal.appendChild(this.styles);
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
    this.editor.once('GUI_LOADED', async () => {
      if (this.editor.inEditor) this.editor.emit('SCRATCHBLOCKS', await this.Scratch.gui.getBlockly());
      require('./setup')();
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
    this.UI = require('./ui/index');
    this._modal.appendChild(this.UI.ui(this));
  }

  show() {
    this._modal = this.makeModal;
    this._modal.showModal();
  }

  hide() {
    this._modal.innerHTML = '';
    this._modal.remove();
  }
}
module.exports = GUI;
