module.exports = function patch(Scratch) {
  Scratch.gui = undefined;
  delete Scratch.gui;
  (function(Scratch) {
    function getBlockly() {
      return new Promise((resolve_getBlockly, reject_getBlockly) => {
        // A single namespace as to not waste RAM with setTimeout loops
        if (!vm?.$LazySB) vm.$LazySB = {
          $dev: false,
          onBlockly(callback) {
            return new Promise((resolve_onBlockly, reject_onBlockly) => {
              if (typeof window?.ScratchBlocks === 'object') resolve_onBlockly(window.ScratchBlocks);
              function waitLoop() {
                if (vm.$LazySB.$dev) console.log('wait loop');
                if (typeof window?.ScratchBlocks !== 'object') {
                  if (vm.$LazySB.$dev) console.log('looping again');
                  setTimeout(() => waitLoop(), 10);
                } else {
                  if (vm.$LazySB.$dev) console.log('Found Blockly, resolving onBlockly');
                  callback(window.ScratchBlocks);
                  resolve_onBlockly(window.ScratchBlocks);
                }
              }
              setTimeout(() => waitLoop(), 10);
            });
          },
          waitingForBlockly: false,
          getBlocklyCallbacks: []
        }
        const LazySB = vm.$LazySB;
        if (!LazySB.waitingForBlockly) {
          const LazySB = vm.$LazySB;
          if (LazySB.$dev) console.log('waiting for blockly');
          LazySB.onBlockly((Blockly) => {
            const LazySB = vm.$LazySB;
            if (LazySB.$dev) console.log('onBlockly callback called');
            while (LazySB.getBlocklyCallbacks.length > 0) {
              const callback = LazySB.getBlocklyCallbacks.shift();
              if (typeof callback === 'function') callback(Blockly);
            }
            LazySB.waitingForBlockly = false;
            if (LazySB.$dev) console.log('no longer waiting for Blockly');
          });
          LazySB.waitingForBlockly = true;
        }
        LazySB.getBlocklyCallbacks.push(function(Blockly) {
          resolve_getBlockly(Blockly);
        });
      });
    }
    if (!Scratch?.gui) Scratch.gui = Scratch?.gui ?? {
      getBlockly,
      getBlocklyEagerly() {
        console.warn('Scratch.gui.getBlocklyEagerly is patched in and does not work!');
        return this.getBlockly();
      }
    }
  })(Scratch);
}