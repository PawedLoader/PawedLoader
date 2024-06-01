!function letsTrickWebpack() {
  const require = () => {}, __webpack_require__ = () => {};
  require('./ui/assets');
}
module.exports = class PawedLoader {
  async $constructor() {
    // We gotta setup some exports that we will pass around
    // Its done here as to not run the same code multiple times (webpack issue)
    const Scratch = new (require('./classes/IntermediaryScratch'));
    await Scratch.setup();
    // Caching
    const self = this;
    this.cache = {};
    // Some props to share (Hopefully lazilly loaded w/ cache)
    this.props = {
      PawedLoader: this,
      ReduxStore: this.getRedux(),
      Scratch,
      get assets() {
        return (self.cache['./ui/assets']=self.cache['./ui/assets']??require('./ui/assets'));
      },
      get db() {
        return (self.cache['./db']=self.cache['./db']??require('./db'));
      },
      get minilog() {
        return (self.cache['./utils/minilog']=self.cache['./utils/minilog']??require('./utils/minilog'));
      },
      get defs() {
        return (self.cache['./defs']=self.cache['./defs']??require('./defs'));
      },
    };
    // These props require stuff from the original props to function so we do it here
    this.props = {
      ...this.props,
      get registerExt() {
        return (self.cache['./utils/registerext']=self.cache['./utils/registerext']??new (require('./utils/registerext'))(self.props));
      },
      get editor() {
        return (self.cache['./editor']=self.cache['./editor']??new (require('./editor'))(self.props));
      },
      get addons() {
        return (self.cache['./addons/manager']=self.cache['./addons/manager']??new (require('./addons/manager'))(self.props));
      },
    };
    // The almighty GUI needs the editor so we do it last :p
    this.props.GUI = new (require('./gui'))(this.props);
  }
  getRedux() {
    // Todo: Make this for multiple platforms (even ones we dont support)
    return window.ReduxStore;
  }
}