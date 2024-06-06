const patchGetBlockly = require('../patches/Scratch_gui_getBlockly');
const hasOwnMany = require('../utils').hasOwnMany;

// Simple function for overriding Function.prototype[proto] for its this arg
// Returns the this arg when all of hasArgs exist on the this arg
// Its weird ik :P
const BindFnForArgs = (proto, ...hasArgs) => {
  // https://github.com/EurekaScratch/eureka/blob/trunk/src/injector/inject.ts
  const oldBind = Function.prototype[proto];
  try {
    return new Promise((resolve, reject) => {
      // We dont wanna wait to long :yawn:
      const timeoutId = setTimeout(() => {
        // Reset the bind and reject
        Function.prototype[proto] = oldBind;
        reject();
      }, 5000);

      // Override the prototype.[proto] of Function to wait for the this arg to be captured
      Function.prototype[proto] = function (...args) {
        // If the proto is the old proto then apply it to this
        if (Function.prototype[proto] === oldBind) {
          return oldBind.apply(this, args);
        } else if (args[0] && hasOwnMany(args[0], ...hasArgs)) {
          // We got the object so return it :yaw:
          Function.prototype[proto] = oldBind;
          clearTimeout(timeoutId);
          resolve(args[0]);
          return oldBind.apply(this, args);
        }
        return oldBind.apply(this, args);
      };
    });
  } catch {
    Function.prototype[proto] = oldBind
    return null;
  }
};

class IntermediaryScratch {
  constructor(props) {
    this.props = props;
    this.$internal = {BindFnForArgs, loadVM: function() {
      return new Promise(async (resolve, reject) => {
        // Faster than wasting time if its already found by another script
        if (window?.vm) resolve(window.vm);
        else if (window?.eureka) resolve(window.eureka.vm);
        // Last resort is this:
        else resolve(await BindFnForArgs('bind', 'editingTarget', 'runtime'));
      });
    }};
    // Setup some default values
    this.gui = {}, this.vm = null, this.renderer = null, this.extensions = {
      unsandboxed: true,
      register() {throw new Error('Not implemented yet.')},
    }, this.ScratchLeak = null;
    // Patch the this.gui object so that we can use Scratch.gui.getBlockly without issues
    patchGetBlockly(this);
    // Run some global patches on Blockly
    this.gui.getBlockly().then((Blockly) => (require('../patches/GlobalBlocklyPatches')(Blockly)));
    // The basics
    this.BlockType = {
      // https://github.com/TurboWarp/scratch-vm/blob/develop/src/extension-support/block-type.js
      XML: 'xml',
      LABEL: 'label',
      COMMAND: 'command',
      REPORTER: 'reporter',
      BOOLEAN: 'Boolean',
      HAT: 'hat',
      EVENT: 'event',
      CONDITIONAL: 'conditional',
      LOOP: 'loop',
      BUTTON: 'button',
      // INLINE: 'inline',
    };
    this.ArgumentType = {
      // https://github.com/TurboWarp/scratch-vm/blob/develop/src/extension-support/argument-type.js
      STRING: 'string',
      NUMBER: 'number',
      BOOLEAN: 'Boolean',
      ANGLE: 'angle',
      MATRIX: 'matrix',
      COLOR: 'color',
      NOTE: 'note',
      IMAGE: 'image',
      COSTUME: 'costume',
      SOUND: 'sound',
      // NULL: null,
    };
    this.TargetType = {
      // https://github.com/TurboWarp/scratch-vm/blob/develop/src/extension-support/target-type.js
      STAGE: 'stage',
      SPRITE: 'sprite',
    };
    this.ReporterScope = {
      // https://github.com/TurboWarp/scratch-vm/blob/develop/src/extension-support/reporter-scope.js
      GLOBAL: 'global',
      TARGET: 'target',
    };
  }
  async setup() {
    // Load the VM
    const vm = await this.$internal.loadVM();
    if (!vm) throw new Error('Could not get VM?');
    this.vm = vm;
    // Expose the runtime and renderer
    this.runtime = vm.runtime;
    this.renderer = vm.runtime.renderer;
    // When the API is created (the REAL Scratch object) modify it and update our export
    vm.on('CREATE_UNSANDBOXED_EXTENSION_API', Scratch => {
      this.ScratchLeak = Scratch;
      patchGetBlockly(Scratch);
    });
    // The registrar
    this.extensions = {
      unsandboxed: true,
      register: async (extension) => {
        // For NOW we will yell at the user if they try to use this :3
        throw new Error('API not implemented');
        // Check if we have a creation event :yawn:
        // (we need to hack it)
        if (vm._events['CREATE_UNSANDBOXED_EXTENSION_API']) {
          // Use an event to register the extension we want before the dummy extension
          vm.once('CREATE_UNSANDBOXED_EXTENSION_API', Scratch => {
            // Now we register the ACTUAL extension
            Scratch.extensions.register(extension);
          });
          // Now register a dummy extension to initilize the Scratch object
          const dummyURL = 'data:text/plain,/*Im a dummy*/'+Date.now();
          await this.props.registerExt.url(dummyURL);
          vm.extensionManager.workerURLS.pop();
          // Some cleanup
          document.querySelector(`script[src="${dummyURL}"]`).remove();
        } else {
          return this.props.registerExt.plugin(extension);
        }
      },
    };
    if (!vm.securityManager) {
      // https://github.com/TurboWarp/scratch-vm/blob/develop/src/extension-support/tw-security-manager.js
      vm.securityManager = new (class SecurityManager {
        getSandboxMode (extensionURL) {
          // Default to worker for Scratch compatibility
          return Promise.resolve('unsandboxed');
        }
        canLoadExtensionFromProject (extensionURL) {
            // Default to false for security
            return Promise.resolve(false);
        }
        rewriteExtensionURL (extensionURL) {
            return Promise.resolve(extensionURL);
        }
        canFetch (resourceURL) {
            // By default, allow any requests.
            return Promise.resolve(true);
        }
        canOpenWindow (websiteURL) {
            // By default, allow all.
            return Promise.resolve(true);
        }
        canRedirect (websiteURL) {
            // By default, allow all.
            return Promise.resolve(true);
        }
        canRecordAudio () {
            return Promise.resolve(true);
        }
        canRecordVideo () {
            return Promise.resolve(true);
        }
        canReadClipboard () {
            return Promise.resolve(true);
        }
        canNotify () {
            return Promise.resolve(true);
        }
        canGeolocate () {
            return Promise.resolve(true);
        }
        canEmbed (documentURL) {
          return Promise.resolve(true);
        }
      });
    }
    // https://github.com/TurboWarp/scratch-vm/blob/develop/src/extension-support/tw-unsandboxed-extension-runner.js
    const parseURL = url => {
      try {
        return new URL(url, location.href);
      } catch (e) {
        return null;
      }
    };
    this.canFetch = async url => {
      const parsed = parseURL(url);
      if (!parsed) {
        return false;
      }
      // Always allow protocols that don't involve a remote request.
      if (parsed.protocol === 'blob:' || parsed.protocol === 'data:') {
        return true;
      }
      return vm.securityManager.canFetch(parsed.href);
    };
    this.canOpenWindow = async url => {
      const parsed = parseURL(url);
      if (!parsed) {
        return false;
      }
      // Always reject protocols that would allow code execution.
      // eslint-disable-next-line no-script-url
      if (parsed.protocol === 'javascript:') {
        return false;
      }
      return vm.securityManager.canOpenWindow(parsed.href);
    };
    this.canRedirect = async url => {
      const parsed = parseURL(url);
      if (!parsed) {
        return false;
      }
      // Always reject protocols that would allow code execution.
      // eslint-disable-next-line no-script-url
      if (parsed.protocol === 'javascript:') {
        return false;
      }
      return vm.securityManager.canRedirect(parsed.href);
    };
    this.canRecordAudio = async () => vm.securityManager.canRecordAudio();
    this.canRecordVideo = async () => vm.securityManager.canRecordVideo();
    this.canReadClipboard = async () => vm.securityManager.canReadClipboard();
    this.canNotify = async () => vm.securityManager.canNotify();
    this.canGeolocate = async () => vm.securityManager.canGeolocate();
    this.canEmbed = async url => {
      const parsed = parseURL(url);
      if (!parsed) {
        return false;
      }
      return vm.securityManager.canEmbed(parsed.href);
    };
    this.fetch = async (url, options) => {
      const actualURL = url instanceof Request ? url.url : url;
      const staticFetchResult = staticFetch(url);
      if (staticFetchResult) {
        return staticFetchResult;
      }
      if (!await this.canFetch(actualURL)) {
        throw new Error(`Permission to fetch ${actualURL} rejected.`);
      }
      return fetch(url, options);
    };
    this.openWindow = async (url, features) => {
      if (!await this.canOpenWindow(url)) {
        throw new Error(`Permission to open tab ${url} rejected.`);
      }
      // Use noreferrer to prevent new tab from accessing `window.opener`
      const baseFeatures = 'noreferrer';
      features = features ? `${baseFeatures},${features}` : baseFeatures;
      return window.open(url, '_blank', features);
    };
    this.redirect = async url => {
      if (!await this.canRedirect(url)) {
        throw new Error(`Permission to redirect to ${url} rejected.`);
      }
      location.href = url;
    };
  }
}
// Export the Scratch* class
module.exports = IntermediaryScratch;