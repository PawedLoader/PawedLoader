class ExtensionRegisterer {
  constructor(props) {
    this.props = props;
    // Get the VM from our props
    this.vm = props.Scratch.vm;
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
    let loadedCorrectly = true;
    try {
      await extensionManager.loadExtensionURL(url);
    } catch(error) {
      if (error.message == 'Too late to register new extensions.') loadedCorrectly = false;
      else loadedCorrectly = error;
    } finally {
      // And reset the security manager so that we dont get vulnerabilitys
      securityManager.getSandboxMode = old;
      if (typeof loadedCorrectly === 'boolean') return loadedCorrectly;
      throw loadedCorrectly;
    }
  }
}
module.exports = ExtensionRegisterer;