const EventEmitter = require('./classes/EventEmitter');

class Editor extends EventEmitter {
  constructor(props) {
    super();
    // Loading in the props
    this.props = props;
    this.ReduxStore = props.ReduxStore;
    // Setup
    this._wasInEditor = this.inEditor;
    this._loadingGUI = !this.GUIavailable;
    // Events
    this.register('OPENED'); this.register('OPENED/gui_events');
    this.register('CLOSED'); this.register('CLOSED/gui_events');
    this.register('GUI_LOADED');
    ReduxStore.subscribe(() => {
      if (this._loadingGUI) {
        if (this.GUIavailable) this._loadingGUI = false;
        this.emit('GUI_LOADED');
      }
      if (this._wasInEditor !== this.inEditor) {
        if (this._wasInEditor) this.emit('CLOSED');
        else this.emit('OPENED');
        this._wasInEditor = this.inEditor;
      }
    });
    if (this._wasInEditor) setTimeout(() => {
      this.emit('OPENED', 0);
    }, 500);
    this.on('OPENED', (guiDelay) => {
      setTimeout(() => this.emit('OPENED/gui_events'), guiDelay ?? 500);
    });
    this.on('CLOSED', (guiDelay) => {
      setTimeout(() => this.emit('CLOSED/gui_events'), guiDelay ?? 500);
    });
  }
  get GUIavailable() {
    return this.projectState.loadingState !== 'LOADING_VM_NEW_DEFAULT';
  }
  get inEditor() {
    const state = ReduxStore.getState();
    if (!state) return false;
    return !state.scratchGui.mode.isPlayerOnly;
  }
  get projectState() {
    const state = ReduxStore.getState();
    if (!state) return false;
    return state.scratchGui.projectState;
  }
}
module.exports = Editor;