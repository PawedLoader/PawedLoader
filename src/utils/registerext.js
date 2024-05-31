class ExtensionRegisterer {
  constructor(props) {
    this.props = props;
    this.vm = props.vm;
  }
  async plugin(extension) {
    const extensionInstance = new extension(runtime);
    const serviceName = vm.extensionManager._registerInternalExtension(extensionInstance);
    this.vm.extensionManager._loadedExtensions.set(extensionInstance.getInfo().id, serviceName);
  }
  async url(url) {
    const extensionManager = this.vm.extensionManager, securityManager = extensionManager.securityManager;
    const old = securityManager.getSandboxMode;
    securityManager.getSandboxMode = function() {
      return 'unsandboxed';
    }
    await extensionManager.loadExtensionURL(url);
    securityManager.getSandboxMode = old;
  }
}
module.exports = ExtensionRegisterer;