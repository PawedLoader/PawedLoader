class AddonAPI {
  constructor() {
    this.IntermediaryScratch = {gui:{}};
    require('../patches/Scratch_gui_getBlockly')(this.IntermediaryScratch);
  }
  getData(addonID) {
    return {};
  }
  // Internal stuff for addons
  async getBlockly() {
    return (await this.IntermediaryScratch.gui.getBlockly());
  }
}
module.exports = new AddonAPI;