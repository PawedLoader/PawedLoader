module.exports = class AddonExporter {
  constructor() {
    this.addonIds = require('../export');
  }
  importAddons() {
    const _addons = {};
    this.addonIds.forEach(addonID => {
      const addon = require(`../addon-${addonID}/main.js`);
      _addons[addonID] = addon;
    });
    this.addons = _addons;
  }
}