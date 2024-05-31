require('../patches/Scratch_gui_getBlockly')(instance);
const useScratch = Scratch => {
  instance = Scratch;
  Scratch.ReduxStore = ScratchZinstance.ReduxStore;
  Scratch.ReduxState = ScratchZinstance.ReduxState;
  require('../patches/Scratch_gui_getBlockly')(Scratch);
  if (Scratch?.gui) Scratch.gui.getBlockly().then(Blockly => Scratch.Blocks = Blockly);
};
vm.on('CREATE_UNSANDBOXED_EXTENSION_API', Scratch => useScratch(Scratch));