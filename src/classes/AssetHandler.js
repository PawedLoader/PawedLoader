const GZip = require('../classes/GZip');
const base64ToArrayBuffer = require('../utils/index').base64ToArrayBuffer;

module.exports = class AssetsHandler {
  constructor() {
    this.assets = {};
    this.prefix = null;
  }
  async saveGZ(assetName, gzBase64, prefix) {
    prefix = prefix ?? null;
    // Load asset into memory after decoding the base64 and unzipping
    this.assets[assetName] = {data: (await (await (new GZip(base64ToArrayBuffer(gzBase64)).extract())).text()), prefix};
  }
  get(assetName) {
    const asset = this.assets[assetName];
    // Read the assed data and append the prefix
    if (asset.data?.read) asset.data = asset.data.read();
    if (asset.prefix) return `${asset.prefix}${asset.data}`;
    return asset.data;
  }
  update(assetName, updator) {
    // Set the asset data to our "updator" and if its a function its return value
    const asset = this.assets[assetName];
    if (typeof updator === 'function') {
      asset.data = updator(asset.data);
      return;
    }
    asset.data = updator;
  }
}