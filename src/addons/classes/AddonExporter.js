module.exports = class AddonExporter {
  constructor() {
    this.addonIds = require('../export');
  }
  get addons() {
    const _addons = {};
    addons.forEach(addonID => {
      const addon = require(`../addon-${addonID}/main.js`);
      _addons[addonID] = addon;
    });
    return addons;
  }
}