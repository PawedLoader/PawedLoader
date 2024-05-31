const AddonExporter = require('./classes/AddonExporter');
class Addons extends AddonExporter {
  constructor() {
    super();
    this.api = require('./api');
    this.importAddons();
    this.loadAll();
  }
  load(addonId) {
    // todo: check if the addon is enabled
    if (!addonId) return false;
    console.log('Loading addon:', addonId);
    this.addons[addonId].setup();
  }
  loadAll() {
    this.addonIds.forEach((addonId) => {
      this.load(addonId);
    });
  }
}
module.exports = Addons;