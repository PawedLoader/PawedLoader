// Takes 2.5s to run so we dont slow down the original loading process :thumbs_up:
setTimeout(() => {
  const LOAD_TIME = Date.now();
  // Import the main class
  const PawedLoader = new (require('./setup'));
  // Temporarially expose for debugging (the constructor promise may fail!)
  window.$PawedLoader = PawedLoader;
  // Load the main class and some props up
  PawedLoader.$constructor().then(() => {
    const { minilog, GUI, Scratch } = PawedLoader.props;
    const vm = Scratch.vm;
    // Well since it loaded we can delete the temporary expose
    delete window.$PawedLoader;

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
    minilog.log('Time taken: ', Date.now()-LOAD_TIME);
  }).catch((err) => {
    const minilog = require('./utils/minilog');
    minilog.error('Failed to load.', err);
    minilog.log('Time taken: ', Date.now()-LOAD_TIME);
  });
}, 2500);