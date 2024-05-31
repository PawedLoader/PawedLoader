const EventEmitter = require('./EventEmitter');

// This is just me being lazy and planning ahead
// its currently useless
module.exports = class State extends EventEmitter {
  constructor() {
    super();
    this.stateObject = {};
  }
}