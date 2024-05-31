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
  async getVM() {
    return (await this.IntermediaryScratch)
  }
}
module.exports = new AddonAPI;