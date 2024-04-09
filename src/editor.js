const EventEmitter = require('./classes/EventEmitter');

class Editor extends EventEmitter {
  constructor() {
    super();
  }
  get inEditor() {
    const state = ReduxStore?.getState();
    if (!state) return false;
    return !state.scratchGui.mode.isPlayerOnly;
  }
}
module.exports = new Editor;