const GZip = require('../classes/GZip');

module.exports = class AssetsHandler {
  constructor() {
    this.assets = {};
    this.prefix = null;
  }
  saveGZ(assetName, gzBase64, prefix) {
    prefix = prefix ?? null;
    // Load gzip asset into memory after decoding the base64
    this.assets[assetName] = {data: atob(gzBase64), gzip: true, prefix};
  }
  get(assetName) {
    // If the asset is not decompressed then decompress it.
    const asset = this.assets[assetName];
    if (asset.gzip) asset.gzip = false, asset.data = new GZip(asset.data).read();
    if (asset.prefix) return `${asset.prefix}${asset.data}`;
    return asset.data;
  }
}