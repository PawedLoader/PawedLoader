function Lock(ModalLock, onfree) {
  this.freed = false;
  this.free = () => {
    // What goes in first comes out first
    ModalLock.locks.shift();
    this.freed = true;
    onfree(this);
  };
}
module.exports = class ModalLock {
  constructor() {
    this.locks = [];
  }
  aquireLock(callback) {
    this.locks.push(() => {
      callback(new Lock(this, () => {}));
    });
    this.refreshLocks();
  }
}