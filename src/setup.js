module.exports = function setup() {
  require('./utils/registerext').url('data:application/javascript;base64,'+btoa('('+(function(Scratch) {
    class PawedLoaderLabel {
      getInfo() {
        return {
          id: 'AshimeePawedLoader',
          name: 'Pawed Loader',
          blocks: [{
            blockType: Scratch.BlockType.XML,
            xml: '<sep gap="0" />'
          }]
        }
      }
    }
    Scratch.extensions.register(new PawedLoaderLabel);
    window.Scratch = Scratch;
    vm.paw._patchScratchGUI(Scratch);
  }).toString()+')(Scratch);'));
};