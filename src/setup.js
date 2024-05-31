module.exports = class PawedLoader {
  constructor() {
    this.props = {
      PawedLoader: this,
      Scratch: require('./classes/IntermediaryScratch'),
      editor: new (require('./editor')),
      addons: new (require('./addons/manager')),
      assets: require('./ui/assets'),
      db: require('./db'),
      minilog: require('./utils/minilog'),
      defs: require('./defs'),
      registerExt: new (require('./utils/registerext'))(this.props),
      GUI: new (require('./gui'))(this.props),
    };
  }
}