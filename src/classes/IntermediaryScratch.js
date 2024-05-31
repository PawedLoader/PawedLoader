const patchGetBlockly = require('../patches/Scratch_gui_getBlockly');
let ScratchExport;
class IntermediaryScratch {
  constructor() {
    this.gui = {};
    // Patch the this.gui object so that we can use Scratch.gui.getBlockly without issues
    patchGetBlockly(this);
    // When the API is created (the REAL Scratch object) modify it and update our export
    this.vm.on('CREATE_UNSANDBOXED_EXTENSION_API', Scratch => {
      patchGetBlockly(Scratch);
      ScratchExport = Scratch;
    });
    // Register a extension to get the REAL Scratch object
    this.registerExtension = new (require('../utils/registerext'))(this);
    this.registerExtension.url('data:application/javascript;base64,'+btoa('('+(function(Scratch) {
      // This is just a bunch of placeholder code for loading :yawn:
      class PawedLoaderLabel {
        getInfo() {
          return {
            id: 'AshimeePawedLoader',
            name: 'PawedLoader',
            blocks: [{
              blockType: Scratch.BlockType.XML,
              xml: '<sep gap="0" />'
            }]
          }
        }
      }
      Scratch.extensions.register(new PawedLoaderLabel);
      window.Scratch = Scratch;
    }).toString()+')(Scratch);'));
  }
  get vm() {
    // Allow us to get the VM on many platforms
    let vm;
    if (window.eureka?.vm) vm = window.eureka.vm;
    if (window.vm) vm = window.vm;
    return vm;
  }
}
// Export the Scratch object
// (initially make it the Intermediary version so we can use Scratch)
ScratchExport = new IntermediaryScratch;
module.exports = ScratchExport;