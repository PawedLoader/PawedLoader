const AddonExporter = require('./classes/AddonExporter');
class Addons extends AddonExporter {
  constructor(props) {
    super(props);
    // Import our API and addons
    this.api = new require('./api')(props);
    this.importAddons();
    // Load ALL the addons :clap:
    this.loadAll();
  }
  load(addonId) {
    // todo: check if the addon is enabled
    if (!addonId) return false;
    console.log('Loading addon:', addonId);
    // Run the setup function for that addon (this is how it "loads")
    this.addons[addonId].setup();
  }
  loadAll() {
    // Just loop over all the addons and load them
    this.addonIds.forEach((addonId) => {
      this.load(addonId);
    });
  }
}
module.exports = Addons;