// ==UserScript==
// @name         PawedLoader
// @namespace    https://google.com/
// @version      0.0.1
// @description  W.I.P
// @author       Ashimee
// @match        *://turbowarp.org/*
// @match        *://packager.turbowarp.org/
// @icon         https://www.google.com/s2/favicons?domain=packager.turbowarp.org
// @run-at       document-end
// @grant        none
// @license      MIT and LGPL-3.0
// ==/UserScript==
// you lose the game :trol:
/* Last build: 1712728884600 */
(async function() {
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

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

/***/ "./src/addons/example/main.js":
/*!************************************!*\
  !*** ./src/addons/example/main.js ***!
  \************************************/
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

/***/ "./src/addons/export.js":
/*!******************************!*\
  !*** ./src/addons/export.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Addon files
const addons = [];

// DO NOT MODIFY!!

class AddonExporter {
  constructor() {
    this.api = __webpack_require__(/*! ./api */ "./src/addons/api.js");
    this.addonIds = addons;
  }
  get addons() {
    const _addons = {};
    addons.forEach(addonID => {
      const addon = __webpack_require__("./src/addons sync recursive ^\\.\\/.*\\/main\\.js$")(`./${addonID}/main.js`);
      _addons[addonID] = addon;
    });
    return addons;
  }
}
module.exports = new AddonExporter;

/***/ }),

/***/ "./src/addons sync recursive ^\\.\\/.*\\/main\\.js$":
/*!*********************************************!*\
  !*** ./src/addons/ sync ^\.\/.*\/main\.js$ ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./example/main.js": "./src/addons/example/main.js"
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
webpackContext.id = "./src/addons sync recursive ^\\.\\/.*\\/main\\.js$";

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

/***/ "./src/defs.js":
/*!*********************!*\
  !*** ./src/defs.js ***!
  \*********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const ScratchZ = __webpack_require__(/*! ./utils/scratchz */ "./src/utils/scratchz.js");

const ReduxStore = ScratchZ.ReduxStore, vm = ScratchZ.vm, runtime = vm.runtime;
const onDesktopApp = document.location.href.includes('resources/app.asar');

module.exports = {
  // Constants
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

const EventEmitter = __webpack_require__(/*! ./classes/EventEmitter */ "./src/classes/EventEmitter.js");
const MenuBarButton = __webpack_require__(/*! ./classes/MenuBarButton */ "./src/classes/MenuBarButton.js");
const ScratchZ = __webpack_require__(/*! ./utils/scratchz */ "./src/utils/scratchz.js");

class GUI extends EventEmitter {
  constructor() {
    super();
    // Setup events
    this.register('ASSETS_LOADED');
    this.state = new EventEmitter();
    this.state.register('ui/render');
    // Importing some classes
    this.editor = __webpack_require__(/*! ./editor */ "./src/editor.js");
    this.addons = __webpack_require__(/*! ./addons/export */ "./src/addons/export.js");
    this.assets = __webpack_require__(/*! ./ui/assets */ "./src/ui/assets.js");
    // Making the ui componnents
    this._modal = this.makeModal;
    this._menubutton = this.makeButton;
  }

  // Makers
  get makeButton() {
    const menuButton = new MenuBarButton('PawedLoader', null, false);
    menuButton.node.addEventListener('click', (event) => this.menuButtonClicked(event));
    return menuButton;
  }
  get makeModal() {
    return document.createElement('dialog');
  }
  
  // Setup
  setupAllGUI() {
    if (this._modal) {
      try { this._modal.remove() } catch {};
      this._modal = this.makeModal;
    }
    document.body.appendChild(this._modal);
    this.regenButton();
  }
  async setup() {
    this.editor.once('GUI_LOADED', () => {
      if (this.editor.inEditor) this.editor.emit('SCRATCHBLOCKS', ScratchZ.Blocks);
    });
    this.assets.loadAssets().then(() => {
      this.emit('ASSETS_LOADED');
      this.editor.on('OPENED/gui_events', () => this.regenButton());
      this.editor.on('CLOSED/gui_events', () => this.regenButton());
      if (this.editor.GUIavailable) this.setupAllGUI();
      else this.editor.on('GUI_LOADED', () => this.setupAllGUI());
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
  }

  show() {
    this._modal.innerHTML = '';
    this.constructGUI();
    this._modal.showModal();
  }

  hide() {
    this._modal.innerHTML = '';
    this._modal.hide();
  }
}
module.exports = new GUI;

/***/ }),

/***/ "./src/ui/assets.js":
/*!**************************!*\
  !*** ./src/ui/assets.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const AssetsHandler = __webpack_require__(/*! ../classes/AssetHandler */ "./src/classes/AssetHandler.js");
const GUIAssets = new AssetsHandler();
async function loadAssets() {
  await GUIAssets.saveGZ('icon', `H4sIAAAAAAAAA01SSW7bQBD8SoP3MqeX2QJJh9x9ygsCJpADWLERCaafn2rmEoDoITnTtfWc7h9X+fj1c//69nleihSJMSVaX+Tz9vr7fl5eHo/3L+u67/vT7k9vf66rlVJW9i2X0/Vyev/+eJEf5+W5d9ExNqjCHQOtScMIVFhBRw0xQ0+KAq1iXUIq1wY71iptSAvRJuFSZXSYyeT2EC1oDu3oxNWbxZQ6N+4QOAy1wAtmyIQ3ceNhQoJ4ynbq4ol/hSxqQkSe40byqmiIF6kqVmRSnElUREiv6C6tP0+CapCPKBVsCnSqa9AJoz+arFDnabpVbsKpHNEOs02UTOJOLszkcemalOZHpfOWhu3mNK0+NtWMgayF4fiQkdI4m5mRdE1P1tOlB4alKB3Ho6mOpvmTqohcDy1Uq5M+wUQcpD3qsv43Pq8MpbTNIuWS02dWDoTReGY5CVKdy7dJKQTh4r1sJXmIHdkGNox0TuJBF5Q29K6FezW/ZOiNCVNJ5jlBwYoooLXBkcA5rZls/NcpArwmYBZM2V8HvGY2kTZSIPEoOyVTUcl7k2HRm0TPkPhaWTWdrryseW0vfwE5q1mv9AIAAA==`, 'data:image/svg+xml,');
}
GUIAssets.loadAssets = loadAssets;
module.exports = GUIAssets;

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

/***/ "./src/utils/scratchz.js":
/*!*******************************!*\
  !*** ./src/utils/scratchz.js ***!
  \*******************************/
/***/ ((module) => {

// I did make this, its just the only copy I have.
class ScratchZ {constructor(){this.c_gbw="gui_blocks-wrapper",this.__rc="__reactContainer",this.__rii="__reactInternalInstance$";const t=window.Scratch||{};this.BlockType=t?.BlockType||{BOOLEAN:"Boolean",BUTTON:"button",LABEL:"label",COMMAND:"command",CONDITIONAL:"conditional",EVENT:"event",HAT:"hat",LOOP:"loop",REPORTER:"reporter",XML:"xml"},this.ArgumentType=t?.ArgumentType||{ANGLE:"angle",BOOLEAN:"Boolean",COLOR:"color",NUMBER:"number",STRING:"string",MATRIX:"matrix",NOTE:"note",IMAGE:"image",COSTUME:"costume",SOUND:"sound"},this.TargetType=t?.TargetType||{SPRITE:"sprite",STAGE:"stage"}}get on_projectPage(){return"object"==typeof this.ReduxState?.scratchGui}get on_homePage(){return"object"==typeof this.ReduxState?.splash}get on_profilePage(){return!!app?.profileModel?.getId?.()}get on_messagesPage(){return"string"==typeof this.ReduxState?.messages?.status?.clear&&!this.on_homePage}get gbWrapper(){return document.querySelector(`[class^="${this.c_gbw}"]`)}get containerKey(){return(Object.keys(app)||[]).find((t=>t.startsWith(this.__rc)))}get instanceKey(){return Object.keys(this.gbWrapper||{}).find((t=>t.startsWith(this.__rii)))}get ReduxStore(){return app[this.containerKey]?.child?.stateNode?.store}get ReduxState(){return this.ReduxStore?.getState?.()}get vm(){return window.vm||this.ReduxState?.scratchGui?.vm}get Blocks(){if("object"==typeof window?.ScratchBlocks)return window.ScratchBlocks;const t=Object.entries(this.gbWrapper||{}).find((t=>t[0].startsWith(this.__rii)))?.[1];if(!t)return;let e=t;for(;e&&!e?.stateNode?.ScratchBlocks;)e=e.child;return e.stateNode.ScratchBlocks}};
module.exports = new ScratchZ;

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
const vm = (__webpack_require__(/*! ./defs */ "./src/defs.js").vm);
const GUI = __webpack_require__(/*! ./gui */ "./src/gui.js");
GUI.setup();
vm.paw = GUI;
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map
})();