module.exports = function setup() {
  require('./utils/registerext').url('data:application/javascript;base64,'+btoa('('+(function(Scratch) {
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
};