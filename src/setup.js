module.exports = class PawedLoader {
  async $constructor() {
    // Caching
    const self = this;
    this.cache = {};
    // Some props to share
    this.props = {
      PawedLoader: this,
      ReduxStore: this.getRedux(),
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
      get highlighter() {
        return (self.cache['./modules/highlighter.min.js']=self.cache['./modules/highlighter.min.js']??require('./modules/highlighter.min.js'));
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
    // we setup Scratch all the way over here as to not miss any exports that it needs
    // we dont have to worry about anything requiring it because they are lazilly loaded
    this.props.Scratch = new (require('./classes/IntermediaryScratch'))(self.props);
    await this.props.Scratch.setup();
    // The almighty GUI needs the editor so we do it last :p
    this.props.GUI = new (require('./gui'))(this.props);
  }
  getRedux() {
    // Todo: Make this for multiple platforms (even ones we dont support)
    return window.ReduxStore;
  }
}