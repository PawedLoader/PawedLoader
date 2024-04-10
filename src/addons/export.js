// Addon files
const addons = [];

// DO NOT MODIFY!!

class AddonExporter {
  constructor() {
    this.api = require('./api');
    this.addonIds = addons;
  }
  get addons() {
    const _addons = {};
    addons.forEach(addonID => {
      const addon = require(`./${addonID}/main.js`);
      _addons[addonID] = addon;
    });
    return addons;
  }
}
module.exports = new AddonExporter;