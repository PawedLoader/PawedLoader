class EventEmitter extends EventTarget {
  constructor() {
    super();
    this.events = {};
  }

  /**
   * Register a new kind of event
   * @param {String} eventName Event name
   */
  register(eventName) {
    this.events[eventName] = [];
  }

  /**
   * Calls every event with the event name
   * @param {String} eventName Event name
   * @param {Any} data Data to pass to the event handlers
   */
  emit(eventName, ...data) {
    if (!hasOwn(this.events, eventName)) return;
    const events = this.events[eventName];
    let popped = 0;
    for (let i = 0; i < events.length; i++) {
      const event = events[i - popped];
      event.callback(...data);
      if (event.deleteWhenCalled) {
        events.pop(i - popped);
        popped++;
      }
    }
  }

  /**
   * When an event happens call this
   * @param {String} eventName Event name
   * @param {Function} callback Function to run when the event is received
   */
  on(eventName, callback) {
    if (!hasOwn(this.events, eventName)) return;
    this.events[eventName].push({
      deleteWhenCalled: false,
      callback,
    });
  }

  /**
   * When an event happens call this but only let it happen once
   * @param {String} eventName Event name
   * @param {Function} callback Function to run when the event is received
   */
  once(eventName, callback) {
    if (!hasOwn(this.events, eventName)) return;
    this.events[eventName].push({
      deleteWhenCalled: true,
      callback,
    });
  }

  /**
   * Clears all the events
   */
  wipe() {
    for (const event in events) {
      events[event] = [];
    }
  }
}
module.exports = EventEmitter;