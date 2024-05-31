// (Basically a limited version of the Scratch object, with some more features)
class AddonAPI {
  constructor(props) {
    this.props = props;
    // Fetch IntermediaryScratch from the props
    // Props is a long chain so yeah-
    this.IntermediaryScratch = props.Scratch;
  }
  getData(addonID) {
    // Todo: let addons store persistant data
    return {};
  }
  // Internal stuff for addons
  async getBlockly() {
    return (await this.IntermediaryScratch.gui.getBlockly());
  }
  async getVM() {
    return (await this.IntermediaryScratch.vm);
  }
}
module.exports = AddonAPI;