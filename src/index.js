// Takes 2.5s to run so we dont slow down the original loading process :thumbs_up:
setTimeout(() => {
  // Import the main class and some dependancys from its props
  const PawedLoader = new (require('./setup'));
  const { minilog, GUI, Scratch } = PawedLoader.props;
  const vm = Scratch.vm;

  // Exposing Scratch.gui.getBlockly patch.
  GUI.constructor.prototype._patchScratchGUI = require('./patches/Scratch_gui_getBlockly');

  // Setting up the gui and loading addons
  GUI.setup();
  GUI.addons.load();
  minilog.log('Loaded.');

  // Exposing to the VM and letting the user use __webpack_require__
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