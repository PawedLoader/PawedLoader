const minilog = require('./utils/minilog');
const vm = require('./defs').vm;
const GUI = require('./gui');
GUI.setup();
GUI.addons.load();
minilog.log('Loaded.');

vm.paw = GUI;
vm.paw._loadRequire = () => {
  if (vm.paw.require) return vm.paw.require;
  try {
    vm.paw.require = __webpack_require__;
    return vm.paw.require;
  } catch {
    console.error('Failed to expose __webpack_require_');
  };
};
