const patchGetBlockly = require('../patches/Scratch_gui_getBlockly');
const hasOwnMany = require('../utils').hasOwnMany;

let ScratchExport;

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
  constructor() {
    this.$internal = {BindFnForArgs, loadVM: function() {
      return new Promise(async (resolve, reject) => {
        // Faster than wasting time if its already found by another script
        if (window?.vm) resolve(window.vm);
        else if (window?.eureka) resolve(window.eureka.vm);
        // Last resort is this:
        else resolve(await BindFnForArgs('bind', 'editingTarget', 'runtime'));
      });
    }};
    // Setup som default values
    this.gui = {}, this.vm = null, this.renderer = null;
    // Patch the this.gui object so that we can use Scratch.gui.getBlockly without issues
    patchGetBlockly(this);
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
      patchGetBlockly(Scratch);
      ScratchExport = Scratch;
    });
  }
}
// Export the Scratch* class
module.exports = IntermediaryScratch;