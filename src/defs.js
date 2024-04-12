const ScratchZ = require('./utils/scratchz');

const version = `0.0.1`;

const ReduxStore = ScratchZ.ReduxStore, vm = ScratchZ.vm, runtime = vm.runtime;
const onDesktopApp = document.location.href.includes('resources/app.asar');

module.exports = {
  // Constants
  version,
  onDesktopApp,
  // GUI stuff
  ScratchZ,
  ReduxStore,
  // "VM" stuff
  vm,
  runtime
}
