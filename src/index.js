setTimeout(() => {
  const PawedLoader = new (require('./setup'));
  const { minilog, GUI, Scratch } = PawedLoader.props;
  const vm = Scratch.vm;

  // Exposing Scratch.gui.getBlockly patch.
  GUI.constructor.prototype._patchScratchGUI = require('./patches/Scratch_gui_getBlockly');

  GUI.setup();
  GUI.addons.load();
  minilog.log('Loaded.');

  vm.paw = PawedLoader;
  vm.paw._loadRequire = () => {
    if (vm.paw.require) return vm.paw.require;
    try {
      vm.paw.require = __webpack_require__;
      return vm.paw.require;
    } catch {
      console.error('Failed to expose __webpack_require_');
    };
  };
}, 2500);