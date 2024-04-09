const EventEmitter = require('./classes/EventEmitter');
const { ReduxStore } = require('./defs');

class Editor extends EventEmitter {
  constructor() {
    super();
    // Setup
    this._wasInEditor = this.inEditor;
    // Events
    this.register('OPENED');
    this.register('CLOSED');
    ReduxStore.subscribe(() => {
      if (this._wasInEditor !== this.inEditor) {
        if (this._wasInEditor) this.emit('CLOSED');
        else this.emit('OPENED');
      }
    });
  }
  get inEditor() {
    const state = ReduxStore?.getState();
    if (!state) return false;
    return !state.scratchGui.mode.isPlayerOnly;
  }
}
module.exports = new Editor;