module.exports = class PawedLoader {
  constructor() {
    this.props = {
      PawedLoader: this,
      ReduxStore: this.getRedux(),
      Scratch: require('./classes/IntermediaryScratch'),
      addons: new (require('./addons/manager')),
      assets: require('./ui/assets'),
      db: require('./db'),
      minilog: require('./utils/minilog'),
      defs: require('./defs'),
    };
    this.props = {
      ...this.props,
      registerExt: new (require('./utils/registerext'))(this.props),
      editor: new (require('./editor'))(this.props),
    };
    this.props.GUI = new (require('./gui'))(this.props);
  }
  getRedux() {
    // Todo: Make this for multiple platforms (even ones we dont support)
    return window.ReduxStore;
  }
}