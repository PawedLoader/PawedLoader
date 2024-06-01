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
    // Making the ui componnents
    this._modal = null;
    this._menubutton = this.makeButton;
    // CSS
    require('./ui/css').wow = true;
  }

  // Makers
  get makeButton() {
    // Create a new menubar button that will be added to well the menu bar button
    // this specific button is used to open the GUI
    const menuButton = new MenuBarButton('PawedLoader', null, false);
    menuButton.node.addEventListener('click', (event) => this.menuButtonClicked(event));
    return menuButton;
  }
  get makeModal() {
    // Make sure the modal does not well already exist
    if (this._modal) this._modal.remove();

    // Apply some styling
    const background = document.createElement('div');
    background.setAttribute('paw-for', 'modal-bg');
    document.body.appendChild(background);

    // Create the modal element and append it to the document
    const modal = document.createElement('div');
    // Add our functions to show and remove the modal
    modal.remove = () => {
      document.body.removeChild(background);
      this._modal = null;
    }
    modal.showModal = () => {
      document.body.appendChild(background);
    };
    // Add the "modal" to the background
    const bgAlt = document.createElement('div');
    bgAlt.appendChild(modal);
    background.appendChild(bgAlt);
    // Tell any selectors this IS the modal
    modal.setAttribute('paw-for', 'modal');
    // Now we construct the GUI
    this._modal = modal;
    this.constructGUI();
    return modal;
  }
  
  // Setup
  setupAllGUI() {
    // Try to remove the modal if it exists
    if (this._modal) {
      try { this._modal.remove() } catch {};
    }

    // Remake the mpdal and add our menu button
    this._modal = this.makeModal;
    this._modal.remove(); // We dont want it shown as soon as we make it :skull:
    this.regenButton();
    this.minilog.log('GUI Built');
  }
  async setup() {
    // Wait until the GUI has loaded
    this.editor.once('GUI_LOADED', async () => {
      // When loaded check if we are in the editor, if we are then say we found ScratchBlocks
      if (this.editor.inEditor) this.editor.emit('SCRATCHBLOCKS', await this.Scratch.gui.getBlockly());
    });
    // Load the assets (this NEEDS to load before whats inside it hence the .then)
    this.assets.loadAssets().then(() => {
      // Tell them we loaded the assets
      this.emit('ASSETS_LOADED');
      this.minilog.log('Assets loaded!');
      // Setup some editor events to remake the button when it disappears
      // (OPENED / CLOSED) is called when we click the "see inside" button
      this.editor.on('OPENED/gui_events', () => this.regenButton());
      this.editor.on('CLOSED/gui_events', () => this.regenButton());
      // Then we make the modal and stuff.
      this.setupAllGUI();
    });
  }

  // Button stuff
  regenButton() {
    // Try to remove the button if it already exists (prevents alot of dupe btn issues)
    if (this._menubutton) try { this._menubutton.remove() } catch {};
    // Remake the button then show it
    this._menubutton = this.makeButton;
    this._menubutton.show();
  }

  // Events
  menuButtonClicked(event) {
    // Show the main modal when we are clicked
    // (we is the menu button for opening the GUI)
    this.show();
  }

  // GUI
  constructGUI() {
    // Create the main UI and add what it makes to the modal
    this.UI = require('./ui/index');
    this._modal.appendChild(this.UI.ui(this));
  }

  show() {
    // Remake the modal and then show it
    this._modal = this.makeModal;
    this._modal.showModal();
  }

  hide() {
    // Delete the HTML and remove the node
    this._modal.innerHTML = '';
    this._modal.remove();
  }
}
module.exports = GUI;
