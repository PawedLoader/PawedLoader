module.exports = class PawedLoader {
  async $constructor() {
    // We gotta setup some exports that we will pass around
    // Its done here as to not run the same code multiple times (webpack issue)
    const Scratch = new (require('./classes/IntermediaryScratch'));
    await Scratch.setup();
    this.props = {
      PawedLoader: this,
      ReduxStore: this.getRedux(),
      Scratch,
      assets: require('./ui/assets'),
      db: require('./db'),
      minilog: require('./utils/minilog'),
      defs: require('./defs'),
    };
    // These props require stuff from the original props to function so we do it here
    this.props = {
      ...this.props,
      registerExt: new (require('./utils/registerext'))(this.props),
      editor: new (require('./editor'))(this.props),
      addons: new (require('./addons/manager'))(this.props),
    };
    // The almighty GUI needs the editor so we do it last :p
    this.props.GUI = new (require('./gui'))(this.props);
  }
  getRedux() {
    // Todo: Make this for multiple platforms (even ones we dont support)
    return window.ReduxStore;
  }
}