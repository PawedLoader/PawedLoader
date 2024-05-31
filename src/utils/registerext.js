class ExtensionRegisterer {
  constructor(props) {
    this.props = props;
    // Get the VM from our props
    this.vm = props.vm;
  }
  async plugin(extension) {
    // Create the extension instance (pass runtime as per the usual)
    const extensionInstance = new extension(runtime);
    // Register the service
    const serviceName = vm.extensionManager._registerInternalExtension(extensionInstance);
    // Now apply it to the VM so it knows its loaded
    this.vm.extensionManager._loadedExtensions.set(extensionInstance.getInfo().id, serviceName);
  }
  async url(url) {
    // Disable the security manager real quick
    const extensionManager = this.vm.extensionManager, securityManager = extensionManager.securityManager;
    const old = securityManager.getSandboxMode;
    securityManager.getSandboxMode = function() {
      return 'unsandboxed';
    }
    // Load the URL
    await extensionManager.loadExtensionURL(url);
    // And reset the security manager so that we dont get vulnerabilitys
    securityManager.getSandboxMode = old;
  }
}
module.exports = ExtensionRegisterer;