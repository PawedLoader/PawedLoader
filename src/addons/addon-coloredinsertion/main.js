const addonID = 'AshimeeInsertionMarkerColors';
module.exports = (function() {

  let addonAPI, addonData = {};

  // I suggested this addon to ScratchAddons as-well
  function setup(api) {
    addonAPI = api;
    addonData = api.getData(addonID);
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

  return {
    name: 'Colored insertion markers.', id: addonID,
    description: 'Colors the insertion markers',
    lastupdate: '5/14/2024',
    /* DO NOT CHANGE */
    setup, data: addonData
  }
})();