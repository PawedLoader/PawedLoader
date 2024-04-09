const EventEmitter = require('./classes/EventEmitter');
const { ReduxStore } = require('./defs');

class Editor extends EventEmitter {
  constructor() {
    super();
    // Setup
    this._wasInEditor = this.inEditor;
    this._loadingGUI = !this.GUIavailable;
    // Events
    this.register('OPENED');
    this.register('CLOSED');
    this.register('GUI_LOADED');
    ReduxStore.subscribe(() => {
      if (this._loadingGUI) {
        if (this.GUIavailable) this._loadingGUI = false;
        this.emit('GUI_LOADED');
      }
      if (this._wasInEditor !== this.inEditor) {
        if (this._wasInEditor) this.emit('CLOSED');
        else this.emit('OPENED');
      }
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
module.exports = new Editor;