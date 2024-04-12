const { vm, runtime } = require('../defs');
module.exports = {
  plugin: function RegisterExtensionFromClass(extension) {
    var extensionInstance = new extension(runtime);
    var serviceName = vm.extensionManager._registerInternalExtension(extensionInstance);
    vm.extensionManager._loadedExtensions.set(extensionInstance.getInfo().id, serviceName);
  },
  url: async function RegisterExtensionFromURL(url) {
    const extensionManager = vm.extensionManager, securityManager = extensionManager.securityManager;
    const old = securityManager.getSandboxMode;
    securityManager.getSandboxMode = function() {
      return 'unsandboxed';
    }
    await extensionManager.loadExtensionURL(url);
    securityManager.getSandboxMode = old;
  }
};