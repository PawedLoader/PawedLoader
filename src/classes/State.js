const EventEmitter = require('./EventEmitter');

module.exports = class State extends EventEmitter {
  constructor() {
    super();
    this.stateObject = {};
  }
}