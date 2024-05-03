// ==UserScript==
// @name         PawedLoader
// @namespace    https://google.com/
// @version      0.0.1
// @description  W.I.P
// @author       Ashimee
// @match        *://turbowarp.org/*
// @match        *://staging.turbowarp.org/*
// @match        *://packager.turbowarp.org/
// @icon         https://www.google.com/s2/favicons?domain=packager.turbowarp.org
// @run-at       document-end
// @grant        none
// @license      MIT and LGPL-3.0
// ==/UserScript==
// you lose the game :trol:
/* Last build: 1714752186598 */
(async function() {
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/addons/addon-example/main.js":
/*!******************************************!*\
  !*** ./src/addons/addon-example/main.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const addonAPI = __webpack_require__(/*! ../api */ "./src/addons/api.js");

const addonID = 'AshimeesExample';
module.exports = (function(addonData) {
  
  function setup() {
    addonData['cool'] = true;
    console.log('Wow!');
  }
  function main() {}

  return {
    name: 'Example - Mhm', id: addonID,
    description: 'a very cool addon!',
    lastupdate: '04/05/2024',
    /* DO NOT CHANGE */
    setup, data: addonData
  }
})(addonAPI.getData(addonID));

/***/ }),

/***/ "./src/addons/addon-exterrcatch/main.js":
/*!**********************************************!*\
  !*** ./src/addons/addon-exterrcatch/main.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// todo: this when garbo adds what i asked for.
const addonAPI = __webpack_require__(/*! ../api */ "./src/addons/api.js");

const addonID = 'Ashimee';
module.exports = (function(addonData) {
  
  function setup() {
    // damn
  }
  function main() {}

  return {
    name: 'Extension loading error catcher.', id: addonID,
    description: 'Catches errors when extensions load.',
    lastupdate: '04/30/2024',
    /* DO NOT CHANGE */
    setup, data: addonData
  }
})(addonAPI.getData(addonID));

/***/ }),

/***/ "./src/addons/api.js":
/*!***************************!*\
  !*** ./src/addons/api.js ***!
  \***************************/
/***/ ((module) => {

class AddonAPI {
  constructor() {}
  getData(addonID) {
    return {};
  }
}
module.exports = new AddonAPI;

/***/ }),

/***/ "./src/addons/classes/AddonExporter.js":
/*!*********************************************!*\
  !*** ./src/addons/classes/AddonExporter.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = class AddonExporter {
  constructor() {
    this.addonIds = __webpack_require__(/*! ../export */ "./src/addons/export.js");
  }
  get addons() {
    const _addons = {};
    addons.forEach(addonID => {
      const addon = __webpack_require__("./src/addons sync recursive ^\\.\\/addon\\-.*\\/main\\.js$")(`./addon-${addonID}/main.js`);
      _addons[addonID] = addon;
    });
    return addons;
  }
}

/***/ }),

/***/ "./src/addons/export.js":
/*!******************************!*\
  !*** ./src/addons/export.js ***!
  \******************************/
/***/ ((module) => {

// Addon files
module.exports = [];

/***/ }),

/***/ "./src/addons/manager.js":
/*!*******************************!*\
  !*** ./src/addons/manager.js ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const AddonExporter = __webpack_require__(/*! ./classes/AddonExporter */ "./src/addons/classes/AddonExporter.js");
class Addons extends AddonExporter {
  constructor() {
    super();
    this.api = __webpack_require__(/*! ./api */ "./src/addons/api.js");
  }
  load() {}
}
module.exports = new Addons;

/***/ }),

/***/ "./src/addons sync recursive ^\\.\\/addon\\-.*\\/main\\.js$":
/*!****************************************************!*\
  !*** ./src/addons/ sync ^\.\/addon\-.*\/main\.js$ ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./addon-example/main.js": "./src/addons/addon-example/main.js",
	"./addon-exterrcatch/main.js": "./src/addons/addon-exterrcatch/main.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/addons sync recursive ^\\.\\/addon\\-.*\\/main\\.js$";

/***/ }),

/***/ "./src/classes/AssetHandler.js":
/*!*************************************!*\
  !*** ./src/classes/AssetHandler.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const GZip = __webpack_require__(/*! ../classes/GZip */ "./src/classes/GZip.js");
const base64ToArrayBuffer = (__webpack_require__(/*! ../utils/index */ "./src/utils/index.js").base64ToArrayBuffer);

module.exports = class AssetsHandler {
  constructor() {
    this.assets = {};
    this.prefix = null;
  }
  async saveGZ(assetName, gzBase64, prefix) {
    prefix = prefix ?? null;
    // Load asset into memory after decoding the base64 and unzipping
    this.assets[assetName] = {data: (await (await (new GZip(base64ToArrayBuffer(gzBase64)).extract())).text()), prefix};
  }
  get(assetName) {
    const asset = this.assets[assetName];
    if (asset.data?.read) asset.data = asset.data.read();
    if (asset.prefix) return `${asset.prefix}${asset.data}`;
    return asset.data;
  }
  update(assetName, updator) {
    const asset = this.assets[assetName];
    if (typeof updator === 'function') {
      asset.data = updator(asset.data);
      return;
    }
    asset.data = updator;
  }
}

/***/ }),

/***/ "./src/classes/EventEmitter.js":
/*!*************************************!*\
  !*** ./src/classes/EventEmitter.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const hasOwn = (__webpack_require__(/*! ../utils/index */ "./src/utils/index.js").hasOwn);

class EventEmitter extends EventTarget {
  constructor() {
    super();
    this.events = {};
  }

  /**
   * Register a new kind of event
   * @param {String} eventName Event name
   */
  register(eventName) {
    this.events[eventName] = [];
  }

  /**
   * Calls every event with the event name
   * @param {String} eventName Event name
   * @param {Any} data Data to pass to the event handlers
   */
  emit(eventName, ...data) {
    if (!hasOwn(this.events, eventName)) return;
    const events = this.events[eventName];
    let popped = 0;
    for (let i = 0; i < events.length; i++) {
      const event = events[i - popped];
      event.callback(...data);
      if (event.deleteWhenCalled) {
        events.pop(i - popped);
        popped++;
      }
    }
  }

  /**
   * When an event happens call this
   * @param {String} eventName Event name
   * @param {Function} callback Function to run when the event is received
   */
  on(eventName, callback) {
    if (!hasOwn(this.events, eventName)) return;
    this.events[eventName].push({
      deleteWhenCalled: false,
      callback,
    });
  }

  /**
   * When an event happens call this but only let it happen once
   * @param {String} eventName Event name
   * @param {Function} callback Function to run when the event is received
   */
  once(eventName, callback) {
    if (!hasOwn(this.events, eventName)) return;
    this.events[eventName].push({
      deleteWhenCalled: true,
      callback,
    });
  }

  /**
   * Clears all the events
   */
  wipe() {
    for (const event in events) {
      events[event] = [];
    }
  }
}
module.exports = EventEmitter;

/***/ }),

/***/ "./src/classes/GZip.js":
/*!*****************************!*\
  !*** ./src/classes/GZip.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const {
  readBytes,
  readFlags,
  readString,
  readTerminatedString,
  unixTimestampToDate,
  bufferToStream,
  downloadArrayBuffer,
  downloadBlob,
  streamToBlob
} = __webpack_require__(/*! ../utils */ "./src/utils/index.js");
module.exports = class GZip {
  #dataView;
  #index = 0;
  #crc16;

  header;
  fileName;
  comment;

  constructor(arrayBuffer) {
      this.#dataView = new DataView(arrayBuffer);
      this.read();
  }
  read(){
      this.header = {
          signature: readString(this.#dataView, 0, 2), //should be xf8b
          compressionMethod: this.#dataView.getUint8(1), //should be 0x08
          flags: readFlags(this.#dataView, 3, ["ftext", "fhcrc", "fextra", "fname", "fcomment", "reserved1", "reserved2", "reserved3"]), //need to figure out if we read extra data in stream
          modificationTime: unixTimestampToDate(this.#dataView.getUint32(4, true)),
          extraFlags: this.#dataView.getUint8(8), //not important but is either 2 (best compression) or 4 (fast)
          os: this.#dataView.getUint8(9), //not useful but usually 0 on windows, 3 Unix, 7 mac
      };
      this.#index = 10;

      if(this.header.flags.fextra){
          const extraLength = this.#dataView.getUint16(this.#index, true);
          this.extra = readBytes(this.#dataView, this.#index + 2, extraLength);
          this.#index += extraLength + 2;
      } else {
          this.extra = [];
      }

      if(this.header.flags.fname){
          this.fileName = readTerminatedString(this.#dataView, this.#index);
          this.#index += this.fileName.length + 1; //+1 for null terminator
      } else {
          this.fileName = "";
      }

      if(this.header.flags.fcomment){
          this.comment = readTerminatedString(this.#dataView, this.#index);
          this.#index += this.comment.length + 1; //+1 for null terminator
      } else {
          this.comment = "";
      }

      if(this.header.flags.fhcrc){
          this.#crc16 = this.#dataView.getUint16(this.#index, true);
          this.#index += 2;
      } else {
          this.#crc16 = null;
      }

      //footer
      this.footer = {
          crc: this.#dataView.getUint32(this.#dataView.byteLength - 8, true),
          uncompressedSize: this.#dataView.getUint32(this.#dataView.byteLength - 4, true),
      }
  }
  extract(){
      //If you don't care about the file data just do this:
      //return streamToBlob(bufferToStream(this.#dataView.buffer).pipeThrough(new DecompressionStream("gzip")));
      //Otherwise slice where the data starts to the last 8 bytes
      return streamToBlob(bufferToStream(this.#dataView.buffer.slice(this.#index, this.#dataView.byteLength - 8)).pipeThrough(new DecompressionStream("deflate-raw")));
  }
}

/***/ }),

/***/ "./src/classes/MenuBarButton.js":
/*!**************************************!*\
  !*** ./src/classes/MenuBarButton.js ***!
  \**************************************/
/***/ ((module) => {

const fileGroupBar = document.querySelector('[class^=menu-bar_file-group]');
const buttonHoverClasses = fileGroupBar.querySelector('[class^=menu-bar_menu-bar-item]');

/**
 * Makes a button
 */
class MenuBarButton {
  /**
   * Constructor
   * @param {String} html
   * @param {String} image An image url, this is not required
   * @param {Boolean} isDropdown Weather or not this has a dropdown attached to it
   */
  constructor(html, image, isDropdown) {
    const newButton = document.querySelector('div[class^=menu-bar_menu-bar-item]').cloneNode(true);
    this.node = newButton;
    this.isDropdown = isDropdown ?? false;
    this.image = image ?? undefined;
    fileGroupBar.appendChild(newButton);
    this.hide();
    const images = newButton.querySelectorAll('img');
    if (!this.isDropdown) {
      images[1].remove();
      newButton.querySelector('div[class^=menu-bar_menu-bar-menu]').remove();
    }
    if (!this.image) images[0].remove();
    this.setLabel(html);
  }

  /**
   * Sets the label to the specified HTML
   * @param {String} html The HTML of the label
   */
  setLabel(html) {
    this.node.querySelector('span[class^=settings-menu_dropdown-label]').innerHTML = html;
  }

  /**
   * Shows the button
   */
  show() {
    this.node.style.display = '';
  }

  /**
   * Hides the button
   */
  hide() {
    this.node.style.display = 'none';
  }

  /**
   * Removes the button
   */
  remove() {
    this.node.remove();
  }
}
module.exports = MenuBarButton;

/***/ }),

/***/ "./src/classes/State.js":
/*!******************************!*\
  !*** ./src/classes/State.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const EventEmitter = __webpack_require__(/*! ./EventEmitter */ "./src/classes/EventEmitter.js");

module.exports = class State extends EventEmitter {
  constructor() {
    super();
    this.stateObject = {};
  }
}

/***/ }),

/***/ "./src/classes/Tab.js":
/*!****************************!*\
  !*** ./src/classes/Tab.js ***!
  \****************************/
/***/ ((module) => {

module.exports = class Tab {
  constructor(body) {
    this.body = body;
    this.node = null;
  }
  get getNode() {
    return this.node;
  }
}

/***/ }),

/***/ "./src/defs.js":
/*!*********************!*\
  !*** ./src/defs.js ***!
  \*********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const ScratchZ = __webpack_require__(/*! ./utils/scratchz */ "./src/utils/scratchz.js");

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


/***/ }),

/***/ "./src/editor.js":
/*!***********************!*\
  !*** ./src/editor.js ***!
  \***********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const EventEmitter = __webpack_require__(/*! ./classes/EventEmitter */ "./src/classes/EventEmitter.js");
const { ReduxStore, ScratchZ } = __webpack_require__(/*! ./defs */ "./src/defs.js");

class Editor extends EventEmitter {
  constructor() {
    super();
    // Setup
    this._wasInEditor = this.inEditor;
    this._loadingGUI = !this.GUIavailable;
    // Events
    this.register('OPENED'); this.register('OPENED/gui_events');
    this.register('CLOSED'); this.register('CLOSED/gui_events');
    this.register('GUI_LOADED');
    ReduxStore.subscribe(() => {
      if (this._loadingGUI) {
        if (this.GUIavailable) this._loadingGUI = false;
        this.emit('GUI_LOADED');
      }
      if (this._wasInEditor !== this.inEditor) {
        if (this._wasInEditor) this.emit('CLOSED');
        else this.emit('OPENED');
      }
    });
    if (this._wasInEditor) setTimeout(() => {
      this.emit('OPENED', 0);
    }, 500);
    this.on('OPENED', (guiDelay) => {
      setTimeout(() => this.emit('OPENED/gui_events'), guiDelay ?? 500);
    });
    this.on('CLOSED', () => {
      setTimeout(() => this.emit('CLOSED/gui_events'), 500);
    });
  }
  get GUIavailable() {
    return this.projectState.loadingState !== 'LOADING_VM_NEW_DEFAULT';
  }
  get inEditor() {
    const state = ReduxStore.getState();
    if (!state) return false;
    return !state.scratchGui.mode.isPlayerOnly;
  }
  get projectState() {
    const state = ReduxStore.getState();
    if (!state) return false;
    return state.scratchGui.projectState;
  }
}
module.exports = new Editor;

/***/ }),

/***/ "./src/gui.js":
/*!********************!*\
  !*** ./src/gui.js ***!
  \********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const minilog = __webpack_require__(/*! ./utils/minilog */ "./src/utils/minilog.js");

const EventEmitter = __webpack_require__(/*! ./classes/EventEmitter */ "./src/classes/EventEmitter.js");
const MenuBarButton = __webpack_require__(/*! ./classes/MenuBarButton */ "./src/classes/MenuBarButton.js");
const ScratchZ = __webpack_require__(/*! ./utils/scratchz */ "./src/utils/scratchz.js");

class GUI extends EventEmitter {
  constructor() {
    super();
    // Setup events
    this.register('ASSETS_LOADED');
    // Importing some classes
    this.editor = __webpack_require__(/*! ./editor */ "./src/editor.js");
    this.addons = __webpack_require__(/*! ./addons/manager */ "./src/addons/manager.js");
    this.assets = __webpack_require__(/*! ./ui/assets */ "./src/ui/assets.js");
    // Style sheet
    this.styles = document.createElement('style');
    this.styles.css = __webpack_require__(/*! ./ui/css */ "./src/ui/css.js");
    // Making the ui componnents
    this._modal = null;
    this._menubutton = this.makeButton;
  }

  // Makers
  get makeButton() {
    const menuButton = new MenuBarButton('PawedLoader', null, false);
    menuButton.node.addEventListener('click', (event) => this.menuButtonClicked(event));
    return menuButton;
  }
  get makeModal() {
    if (this._modal) this._modal.remove();
    const modal = document.createElement('dialog');
    document.body.appendChild(modal);
    modal.setAttribute('paw-for', 'modal');
    this.styles.textContent = this.styles.css.get();
    modal.appendChild(this.styles);
    this._modal = modal;
    this.constructGUI();
    return modal;
  }
  
  // Setup
  setupAllGUI() {
    if (this._modal) {
      try { this._modal.remove() } catch {};
    }
    this._modal = this.makeModal;
    this.regenButton();
    minilog.log('GUI Built');
  }
  async setup() {
    this.editor.once('GUI_LOADED', () => {
      if (this.editor.inEditor) this.editor.emit('SCRATCHBLOCKS', ScratchZ.Blocks);
      __webpack_require__(/*! ./setup */ "./src/setup.js")();
    });
    this.assets.loadAssets().then(() => {
      this.emit('ASSETS_LOADED');
      minilog.log('Assets loaded!');
      this.editor.on('OPENED/gui_events', () => this.regenButton());
      this.editor.on('CLOSED/gui_events', () => this.regenButton());
      this.setupAllGUI();
    });
  }

  // Button stuff
  regenButton() {
    if (this._menubutton) try { this._menubutton.remove() } catch {};
    this._menubutton = this.makeButton;
    this._menubutton.show();
  }

  // Events
  menuButtonClicked(event) {
    this.show();
  }

  // GUI
  constructGUI() {
    this._modal.appendChild((__webpack_require__(/*! ./ui/index */ "./src/ui/index.js").ui)(this));
  }

  show() {
    this._modal = this.makeModal;
    this._modal.showModal();
  }

  hide() {
    this._modal.innerHTML = '';
    this._modal.remove();
  }
}
module.exports = new GUI;


/***/ }),

/***/ "./src/patches/Scratch_gui_getBlockly.js":
/*!***********************************************!*\
  !*** ./src/patches/Scratch_gui_getBlockly.js ***!
  \***********************************************/
/***/ ((module) => {

module.exports = function patch(Scratch) {
  Scratch.gui = undefined;
  delete Scratch.gui;
  (function(Scratch) {
    function getBlockly() {
      return new Promise((resolve_getBlockly, reject_getBlockly) => {
        // A single namespace as to not waste RAM with setTimeout loops
        if (!vm?.$LazySB) vm.$LazySB = {
          $dev: false,
          onBlockly(callback) {
            return new Promise((resolve_onBlockly, reject_onBlockly) => {
              if (typeof window?.ScratchBlocks === 'object') resolve_onBlockly(window.ScratchBlocks);
              function waitLoop() {
                if (vm.$LazySB.$dev) console.log('wait loop');
                if (typeof window?.ScratchBlocks !== 'object') {
                  if (vm.$LazySB.$dev) console.log('looping again');
                  setTimeout(() => waitLoop(), 10);
                } else {
                  if (vm.$LazySB.$dev) console.log('Found Blockly, resolving onBlockly');
                  callback(window.ScratchBlocks);
                  resolve_onBlockly(window.ScratchBlocks);
                }
              }
              setTimeout(() => waitLoop(), 10);
            });
          },
          waitingForBlockly: false,
          getBlocklyCallbacks: []
        }
        const LazySB = vm.$LazySB;
        if (!LazySB.waitingForBlockly) {
          const LazySB = vm.$LazySB;
          if (LazySB.$dev) console.log('waiting for blockly');
          LazySB.onBlockly((Blockly) => {
            const LazySB = vm.$LazySB;
            if (LazySB.$dev) console.log('onBlockly callback called');
            while (LazySB.getBlocklyCallbacks.length > 0) {
              const callback = LazySB.getBlocklyCallbacks.shift();
              if (typeof callback === 'function') callback(Blockly);
            }
            LazySB.waitingForBlockly = false;
            if (LazySB.$dev) console.log('no longer waiting for Blockly');
          });
          LazySB.waitingForBlockly = true;
        }
        LazySB.getBlocklyCallbacks.push(function(Blockly) {
          resolve_getBlockly(Blockly);
        });
      });
    }
    if (!Scratch?.gui) Scratch.gui = Scratch?.gui ?? {
      getBlockly,
      getBlocklyEagerly() {
        console.warn('Scratch.gui.getBlocklyEagerly is patched in and does not work!');
        return this.getBlockly();
      }
    }
  })(Scratch);
}

/***/ }),

/***/ "./src/setup.js":
/*!**********************!*\
  !*** ./src/setup.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = function setup() {
  (__webpack_require__(/*! ./utils/registerext */ "./src/utils/registerext.js").url)('data:application/javascript;base64,'+btoa('('+(function(Scratch) {
    class PawedLoaderLabel {
      getInfo() {
        return {
          id: 'AshimeePawedLoader',
          name: 'PawedLoader',
          blocks: [{
            blockType: Scratch.BlockType.XML,
            xml: '<sep gap="0" />'
          }]
        }
      }
    }
    Scratch.extensions.register(new PawedLoaderLabel);
    window.Scratch = Scratch;
    vm.paw._patchScratchGUI(Scratch);
  }).toString()+')(Scratch);'));
};

/***/ }),

/***/ "./src/ui/assets.js":
/*!**************************!*\
  !*** ./src/ui/assets.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const AssetsHandler = __webpack_require__(/*! ../classes/AssetHandler */ "./src/classes/AssetHandler.js");
const GUIAssets = new AssetsHandler();
async function loadAssets() {
  await GUIAssets.saveGZ('icon', `H4sIAAAAAAAAA01SSW7bQBD8SoP3MqeX2QJJh9x9ygsCJpADWLERCaafn2rmEoDoITnTtfWc7h9X+fj1c//69nleihSJMSVaX+Tz9vr7fl5eHo/3L+u67/vT7k9vf66rlVJW9i2X0/Vyev/+eJEf5+W5d9ExNqjCHQOtScMIVFhBRw0xQ0+KAq1iXUIq1wY71iptSAvRJuFSZXSYyeT2EC1oDu3oxNWbxZQ6N+4QOAy1wAtmyIQ3ceNhQoJ4ynbq4ol/hSxqQkSe40byqmiIF6kqVmRSnElUREiv6C6tP0+CapCPKBVsCnSqa9AJoz+arFDnabpVbsKpHNEOs02UTOJOLszkcemalOZHpfOWhu3mNK0+NtWMgayF4fiQkdI4m5mRdE1P1tOlB4alKB3Ho6mOpvmTqohcDy1Uq5M+wUQcpD3qsv43Pq8MpbTNIuWS02dWDoTReGY5CVKdy7dJKQTh4r1sJXmIHdkGNox0TuJBF5Q29K6FezW/ZOiNCVNJ5jlBwYoooLXBkcA5rZls/NcpArwmYBZM2V8HvGY2kTZSIPEoOyVTUcl7k2HRm0TPkPhaWTWdrryseW0vfwE5q1mv9AIAAA==`, 'data:image/svg+xml;base64,');
  GUIAssets.update('icon', (data) => btoa(data.replace('<svg ', '<svg style="fill:#ffffff;" ')));
}
GUIAssets.loadAssets = loadAssets;
module.exports = GUIAssets;

/***/ }),

/***/ "./src/ui/css.js":
/*!***********************!*\
  !*** ./src/ui/css.js ***!
  \***********************/
/***/ ((module) => {

let css = `
/* css will go here */
`;
module.exports = {
  get() {
    return css;
  },
  set(styles) {
    css = styles;
  }
};

/***/ }),

/***/ "./src/ui/index.js":
/*!*************************!*\
  !*** ./src/ui/index.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const State = __webpack_require__(/*! ../classes/State */ "./src/classes/State.js");
const version = (__webpack_require__(/*! ../defs */ "./src/defs.js").version);
class StateNode extends State {
  constructor(nodeType, nodeFor, ...state) {
    super(...state);
    this.node = document.createElement(nodeType);
    this.node.setAttribute('paw-for', nodeFor);
  }
}
class UIHeader extends StateNode {
  constructor(GUI) {
    super('div', 'header');
    this.GUI = GUI;
    this.createHeader();
  }
  createHeader() {
    const titleNode = document.createElement('div');
    titleNode.appendChild(document.createTextNode('PawedLoader'));
    titleNode.appendChild(document.createTextNode(`v${version}`));
    titleNode.setAttribute('paw-for', 'header-title');
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.onclick = (event) => this.GUI.hide();
    closeButton.setAttribute('paw-for', 'modal-close');
    this.node.appendChild(titleNode);
    this.node.appendChild(closeButton);
  }
}
class UITabs extends StateNode {
  constructor(body) {
    super('div', 'tabs');
    this.body = body;
    this.register('TAB_CHANGED');
    this.tabNumber = body.tabNumber;
    this.tabPath = body.tabPath;
    this.tabs = {'Extensions': ['Merged', 'Unmerged'], 'N/A~1': ['Packager', 'Addons', 'Themes']};
  }
  tabClicked(tab, event) {
    this.tabNumber = Number(tab.getAttribute('paw-tabNumber'));
    this.tabPath = String(tab.getAttribute('paw-tabPath'));
    this.emit('TAB_CHANGED', {tabNumber: this.tabNumber, tabPath: this.tabPath});
  }
  get generateTabs() {
    let i = 0;
    const sect = document.createElement('div');
    sect.setAttribute('paw-for', 'tab-sect');
    for (const entry of Object.entries(this.tabs)) {
      const sectName = document.createTextNode(entry[0]);
      const sectBody = document.createElement('div');
      sectBody.setAttribute('paw-for', 'tab-sect-body');
      const tabs = entry[1];
      for (const tabText of tabs) {
        i++;
        const tab = document.createElement('button');
        tab.textContent = tabText;
        tab.setAttribute('paw-for', 'tab-button');
        tab.setAttribute('paw-tabNumber', String(i));
        tab.setAttribute('paw-tabPath', String(`${sectName.textContent}/${tabText}`));
        tab.setAttribute('paw-active', String(this.tabNumber === i));
        tab.onclick = (event) => this.tabClicked(tab, event);
        sectBody.appendChild(tab);
      }
      const sectWrapper = document.createElement('div');
      sectWrapper.setAttribute('paw-for', 'tab-sect-pop');
      if (!entry[0].startsWith('N/A')) sectWrapper.appendChild(sectName);
      sectWrapper.appendChild(sectBody);
      sect.appendChild(sectWrapper);
    }
    return sect;
  }
  get getNode() {
    this.node.innerHTML = '';
    this.node.appendChild(this.generateTabs);
    return this.node;
  }
}
class UIBody extends StateNode {
  constructor() {
    super('div', 'body');
    this.tabNumber = 1;
    this.tabPath = 'Extensions/Merged';
    this.tabs = new UITabs(this);
    this.tabs.on('TAB_CHANGED', (tabData) => this.renderTab(tabData.tabNumber, tabData.tabPath));
    this.renderTab(this.tabNumber, this.tabPath);
  }
  get getTab() {
    const tabWrapper = document.createElement('div');
    const allTabs = (__webpack_require__(/*! ./tabs */ "./src/ui/tabs.js").tabs);
    const tabClass = allTabs[this.tabPath] ?? (__webpack_require__(/*! ./tabs */ "./src/ui/tabs.js").tabs)['N/A'];
    const tab = new tabClass(this);
    tabWrapper.appendChild(tab.getNode);
    tabWrapper.setAttribute('paw-for', 'tab-render');
    return tabWrapper;
  }
  renderTab(tabNumber, tabPath) {
    this.tabNumber = tabNumber;
    this.tabPath = tabPath;
    this.node.innerHTML = '';
    this.node.appendChild(this.tabs.getNode);
    this.node.appendChild(this.getTab);
  }
}
class UIFooter extends StateNode {
  constructor() {
    super('div', 'footer');
  }
}
class UI extends StateNode {
  constructor() {
    super('paw', 'main');
  }
  ui(gui) {
    const header = new UIHeader(gui);
    const body = new UIBody;
    const footer = new UIFooter;
    this.node.innerHTML = '';
    this.node.appendChild(header.node);
    this.node.appendChild(body.node);
    this.node.appendChild(footer.node);
    return this.node;
  }
}
module.exports = new UI;


/***/ }),

/***/ "./src/ui/tab/$Placeholder.js":
/*!************************************!*\
  !*** ./src/ui/tab/$Placeholder.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Tab = __webpack_require__(/*! ../../classes/Tab */ "./src/classes/Tab.js");
module.exports = class MyTab extends Tab {
  constructor(body) {
    super(body);
    this.node = document.createElement('span');
    this.node.textContent = `[TAB NOT IMPLEMENTED] ${body.tabNumber} : ${body.tabPath}`;
  }
}

/***/ }),

/***/ "./src/ui/tab/Extensions_Merged.js":
/*!*****************************************!*\
  !*** ./src/ui/tab/Extensions_Merged.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Tab = __webpack_require__(/*! ../../classes/Tab */ "./src/classes/Tab.js");
module.exports = class MyTab extends Tab {
  constructor(body) {
    super(body);
    this.node = document.createElement('span');
    this.node.textContent = `${body.tabNumber} : ${body.tabPath}`;
  }
}

/***/ }),

/***/ "./src/ui/tabs.js":
/*!************************!*\
  !*** ./src/ui/tabs.js ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  tabs: {
    'N/A': __webpack_require__(/*! ./tab/$Placeholder */ "./src/ui/tab/$Placeholder.js"),
    'Extensions/Merged': __webpack_require__(/*! ./tab/Extensions_Merged */ "./src/ui/tab/Extensions_Merged.js"),
  }
}

/***/ }),

/***/ "./src/utils/index.js":
/*!****************************!*\
  !*** ./src/utils/index.js ***!
  \****************************/
/***/ ((module) => {

function bufferToStream(arrayBuffer) {
  return new ReadableStream({
      start(controller) {
          controller.enqueue(arrayBuffer);
          controller.close();
      }
  });
}

function downloadArrayBuffer(arrayBuffer, fileName) {
  const blob = new Blob([arrayBuffer]);
  downloadBlob(blob, fileName);
}
function downloadBlob(blob, fileName = "download.x"){
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.setAttribute('download', fileName);
  link.click();
  window.URL.revokeObjectURL(blobUrl);
}

async function streamToBlob(stream, type) {
  const reader = stream.getReader();
  let done = false;
  const data = [];

  while (!done) {
      const result = await reader.read();
      done = result.done;
      if (result.value) {
          data.push(result.value);
      }
  }

  return new Blob(data, { type });
}

function unixTimestampToDate(timestamp){
  return new Date(timestamp * 1000);
}

function readString(dataView, offset, length) {
  const str = [];
  for (let i = 0; i < length; i++) {
      str.push(String.fromCharCode(dataView.getUint8(offset + i)));
  }
  return str.join("");
}

function readTerminatedString(dataView, offset) {
  const str = [];
  let val;
  let i = 0;

  while (val != 0) {
      val = dataView.getUint8(offset + i);
      if (val != 0) {
          str.push(String.fromCharCode(val));
      }
      i++
  }
  return str.join("");
}

function readBytes(dataView, offset, length) {
  const bytes = [];
  for (let i = 0; i < length; i++) {
      bytes.push(dataView.getUint8(offset + i));
  }
  return bytes;
}

function readFlags(dataView, offset, flagLabels) {
  const flags = {};

  for (let i = 0; i < flagLabels.length; i++) {
      const byte = dataView.getUint8(offset + Math.min(i / 8));
      flags[flagLabels[i]] = (((1 << i) & byte) >> i) === 1;
  }

  return flags;
}

function base64ToArrayBuffer(base64) {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Calls hasOwnProperty without doing it on the main object.
 * @param {Object} object The object to check for the key on.
 * @param {String} key The key to check for.
 */
const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

const wait = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}

module.exports = {
  wait,
  hasOwn,
  // gzip stuff
  readBytes,
  readFlags,
  readString,
  readTerminatedString,
  unixTimestampToDate,
  bufferToStream,
  downloadArrayBuffer,
  downloadBlob,
  streamToBlob,
  base64ToArrayBuffer
};

/***/ }),

/***/ "./src/utils/minilog.js":
/*!******************************!*\
  !*** ./src/utils/minilog.js ***!
  \******************************/
/***/ ((module) => {

const prefix = 'PawLoader |';
const log = (...a) => console.log(prefix, ...a);
const warn = (...a) => console.warn(prefix, ...a);
const error = (...a) => console.error(prefix, ...a);
module.exports = { log, warn, error };

/***/ }),

/***/ "./src/utils/registerext.js":
/*!**********************************!*\
  !*** ./src/utils/registerext.js ***!
  \**********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { vm, runtime } = __webpack_require__(/*! ../defs */ "./src/defs.js");
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

/***/ }),

/***/ "./src/utils/scratchz.js":
/*!*******************************!*\
  !*** ./src/utils/scratchz.js ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// I did make this, its just the only copy I have.
class ScratchZ {constructor(){this.c_gbw="gui_blocks-wrapper",this.__rc="__reactContainer",this.__rii="__reactInternalInstance$";const t=window.Scratch||{};this.BlockType=t?.BlockType||{BOOLEAN:"Boolean",BUTTON:"button",LABEL:"label",COMMAND:"command",CONDITIONAL:"conditional",EVENT:"event",HAT:"hat",LOOP:"loop",REPORTER:"reporter",XML:"xml"},this.ArgumentType=t?.ArgumentType||{ANGLE:"angle",BOOLEAN:"Boolean",COLOR:"color",NUMBER:"number",STRING:"string",MATRIX:"matrix",NOTE:"note",IMAGE:"image",COSTUME:"costume",SOUND:"sound"},this.TargetType=t?.TargetType||{SPRITE:"sprite",STAGE:"stage"}}get on_projectPage(){return"object"==typeof this.ReduxState?.scratchGui}get on_homePage(){return"object"==typeof this.ReduxState?.splash}get on_profilePage(){return!!app?.profileModel?.getId?.()}get on_messagesPage(){return"string"==typeof this.ReduxState?.messages?.status?.clear&&!this.on_homePage}get gbWrapper(){return document.querySelector(`[class^="${this.c_gbw}"]`)}get containerKey(){return(Object.keys(app)||[]).find((t=>t.startsWith(this.__rc)))}get instanceKey(){return Object.keys(this.gbWrapper||{}).find((t=>t.startsWith(this.__rii)))}get ReduxStore(){return app[this.containerKey]?.child?.stateNode?.store}get ReduxState(){return this.ReduxStore?.getState?.()}get vm(){return window.vm||this.ReduxState?.scratchGui?.vm}get Blocks(){if("object"==typeof window?.ScratchBlocks)return window.ScratchBlocks;const t=Object.entries(this.gbWrapper||{}).find((t=>t[0].startsWith(this.__rii)))?.[1];if(!t)return;let e=t;for(;e&&!e?.stateNode?.ScratchBlocks;)e=e.child;return e.stateNode.ScratchBlocks}};
const ScratchZinstance = new ScratchZ;
let instance = ScratchZinstance;
__webpack_require__(/*! ../patches/Scratch_gui_getBlockly */ "./src/patches/Scratch_gui_getBlockly.js")(instance);
const useScratch = Scratch => {
  instance = Scratch;
  Scratch.ReduxStore = ScratchZinstance.ReduxStore;
  Scratch.ReduxState = ScratchZinstance.ReduxState;
  __webpack_require__(/*! ../patches/Scratch_gui_getBlockly */ "./src/patches/Scratch_gui_getBlockly.js")(Scratch);
  if (Scratch?.gui) Scratch.gui.getBlockly().then(Blockly => Scratch.Blocks = Blockly);
};
vm.on('CREATE_UNSANDBOXED_EXTENSION_API', Scratch => useScratch(Scratch));
class getter {
  get instance() {
    return instance;
  }
}
module.exports = new getter().instance;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const minilog = __webpack_require__(/*! ./utils/minilog */ "./src/utils/minilog.js");
const vm = (__webpack_require__(/*! ./defs */ "./src/defs.js").vm);
const GUI = __webpack_require__(/*! ./gui */ "./src/gui.js");

// Exposing Scratch.gui.getBlockly patch.
GUI.constructor.prototype._patchScratchGUI = __webpack_require__(/*! ./patches/Scratch_gui_getBlockly */ "./src/patches/Scratch_gui_getBlockly.js");

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

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map
})();