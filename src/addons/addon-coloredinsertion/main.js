// todo: this when garbo adds what i asked for.
const addonAPI = require('../api');

const addonID = 'AshimeeInsertionMarkerColors';
module.exports = (function(addonData) {
  // I suggested this addon to ScratchAddons as-well
  function setup() {
    addonAPI.getBlockly().then(Blockly => {
      const BlockSvgProto = Blockly.BlockSvg.prototype;
      const BSP_setColour = BlockSvgProto.setColour;
      BlockSvgProto.setColour = function(...colours) {
        if (this.isInsertionMarker()) {
          return true;
        }
        return BSP_setColour.call(this, ...colours);
      }
    });
  }
  function main() {}

  return {
    name: 'Colored insertion markers.', id: addonID,
    description: 'Colors the insertion markers',
    lastupdate: '5/14/2024',
    /* DO NOT CHANGE */
    setup, data: addonData
  }
})(addonAPI.getData(addonID));