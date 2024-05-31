const EventEmitter = require('./classes/EventEmitter');

class Editor extends EventEmitter {
  constructor(props) {
    super();
    // Loading in the props
    this.props = props;
    this.ReduxStore = props.ReduxStore;
    // Initial values like if we are in the editor when loaded
    // and if the GUI is still loading or not
    this._wasInEditor = this.inEditor;
    this._loadingGUI = !this.GUIavailable;
    // Register some events for us and others to use
    this.register('OPENED'); this.register('OPENED/gui_events');
    this.register('CLOSED'); this.register('CLOSED/gui_events');
    this.register('GUI_LOADED');
    // Subscribe to the Redux so we know when it changes
    // this is used for checking changes in state.scratchGui
    ReduxStore.subscribe(() => {
      // Check if we are loading the GUI still
      if (this._loadingGUI) {
        // Since we are "still" loading we check if the GUI is avalible now
        // and if it is we are no longer loading the GUI, aswell as emit an event saying it loaded
        if (this.GUIavailable) this._loadingGUI = false;
        this.emit('GUI_LOADED');
      }
      // Check if we changed editor state
      if (this._wasInEditor !== this.inEditor) {
        // If we WERE in the editor then we closed the editor (went to the project page)
        // Otherwise if we WERE NOT we opened the editor
        if (this._wasInEditor) this.emit('CLOSED');
        else this.emit('OPENED');
        // Update the wasInEditor so it does stay the same when we open/close
        this._wasInEditor = this.inEditor;
      }
    });
    // If we are in the editor initially tell them we opened it :yawn:
    if (this._wasInEditor) setTimeout(() => {
      this.emit('OPENED', 0);
    }, 500);
    // Copy the OPEN and CLOSE events for the editor for the GUI with some delay
    this.on('OPENED', (guiDelay) => {
      setTimeout(() => this.emit('OPENED/gui_events'), guiDelay ?? 500);
    });
    this.on('CLOSED', (guiDelay) => {
      setTimeout(() => this.emit('CLOSED/gui_events'), guiDelay ?? 500);
    });
  }
  get GUIavailable() {
    // Check if the VM is unloaded which usually means the GUI is also not finished
    return this.projectState.loadingState !== 'LOADING_VM_NEW_DEFAULT';
  }
  get inEditor() {
    // Get the ReduxState
    const state = ReduxStore.getState();
    if (!state) return false;
    // Make sure we are not using the player (called isPlayerOnly)
    return !state.scratchGui.mode.isPlayerOnly;
  }
  get projectState() {
    // Get the ReduxState
    const state = ReduxStore.getState();
    if (!state) return false;
    // Well its legit what it says it is
    return state.scratchGui.projectState;
  }
}
module.exports = Editor;