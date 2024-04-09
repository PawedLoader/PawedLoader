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
    if (asset.data?.read) asset.data = asset.data.read();
    if (asset.prefix) return `${asset.prefix}${asset.data}`;
    return asset.data;
  }
}