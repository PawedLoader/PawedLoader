const AddonExporter = require('./classes/AddonExporter');
class Addons extends AddonExporter {
  constructor() {
    super();
    this.api = require('./api');
  }
  load() {}
}
module.exports = new Addons;