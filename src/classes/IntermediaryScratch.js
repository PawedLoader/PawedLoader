const patchGetBlockly = require('../patches/Scratch_gui_getBlockly');
let ScratchExport;
class IntermediaryScratch {
  constructor() {
    this.gui = {};
    patchGetBlockly(this);
    this.vm.on('CREATE_UNSANDBOXED_EXTENSION_API', Scratch => {
      patchGetBlockly(Scratch);
      ScratchExport = Scratch;
    });
    this.registerExtension = new (require('../utils/registerext'))(this);
    this.registerExtension.url('data:application/javascript;base64,'+btoa('('+(function(Scratch) {
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
    let vm;
    if (window.eureka?.vm) vm = window.eureka.vm;
    if (window.vm) vm = window.vm;
    return vm;
  }
}
ScratchExport = new IntermediaryScratch;
module.exports = ScratchExport;