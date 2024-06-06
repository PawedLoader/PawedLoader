const addonID = 'AshimeeShadowManager';
module.exports = (function() {
  
  let addonAPI, addonData = {};
  function setup(api) {
    addonAPI = api;
    addonData = api.getData(addonID);
    api.getBlockly().then((Blockly) => {
      const CM = Blockly.ContextMenu;
      const CMS = CM.show;
      CM.show = function(...args) {
        // Get the items
        const [event, items, RTL] = args;
        const blocks = vm.editingTarget.blocks;
        const targetBlock_ = Blockly.mainWorkspace.currentGesture_.targetBlock_;
        const vmBlock_ = blocks.getBlock(targetBlock_?.id);
        if (targetBlock_ && vmBlock_) {
          function shadowBlock(shadowStatus, targetBlock) {
            targetBlock = targetBlock ?? targetBlock_;
            let vmBlock = vmBlock_;
            if (targetBlock ?? false) {
              vmBlock = blocks.getBlock(targetBlock?.id);
              if (!vmBlock) return false;
            }
            if (!vmBlock?.parent) return false;
            vmBlock.shadow = shadowStatus;
            targetBlock.setShadow(shadowStatus);
            const parent = blocks.getBlock(vmBlock.parent);
            const container = Object.entries(parent.inputs).find(entry => entry[1].block === vmBlock.id)?.[1];
            if (!container) return false;
            if (shadowStatus) container.shadow = vmBlock.id;
            else container.shadow = null;
            return true;
          }
          // Check if the block is a shadow
          const isReporter = (!targetBlock_.previousConnection && !targetBlock_.nextConnection);
          const canShadow = (isReporter && !vmBlock_.topLevel);
          items.push({enabled: canShadow, text: 'shadow block', callback: () => {
            shadowBlock(true);
          }});
          items.push({enabled: true, text: 'unshadow inputs', callback: () => {
            Object.values(vmBlock_.inputs).forEach(input => {
              if (!input.shadow) return false;
              const shadowId = input.shadow;
              input.block = shadowId;
              input.shadow = null;
              const shadowBlock = blocks.getBlock(shadowId);
              if (!shadowBlock?.shadow || !shadowBlock) return false;
              shadowBlock.shadow = false;
              const sbBlock = Blockly.mainWorkspace.blockDB_[shadowBlock];
              if (!sbBlock) return false;
              sbBlock.setShadow(false);
            });
            vm.refreshWorkspace();
          }});
        }
        // Then we can reshow it
        return CMS.apply(this, args);
      }
    });
  }

  return {
    name: 'Shadow Manager', id: addonID,
    description: 'Shadow and unshadow inputs',
    lastupdate: '06/05/2024',
    /* DO NOT CHANGE */
    setup, data: addonData
  }
})();