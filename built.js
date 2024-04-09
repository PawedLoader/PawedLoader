// ==UserScript==
// @name         PawedLoader
// @namespace    https://google.com/
// @version      0.0.1
// @description  W.I.P
// @author       Ashimee
// @match        *://turbowarp.org/*
// @match        *://packager.turbowarp.org/
// @icon         https://www.google.com/s2/favicons?domain=packager.turbowarp.org
// @grant        none
// @license      MIT and LGPL-3.0
// ==/UserScript==

/* Last build: 1712686372704 */
(async function() {
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

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

/***/ "./src/classes/MenuBarButton.js":
/*!**************************************!*\
  !*** ./src/classes/MenuBarButton.js ***!
  \**************************************/
/***/ ((module) => {

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
    queries.fileGroupBar.appendChild(newButton);
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
const onDesktopApp = docHref.includes('resources/app.asar');

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
const { ReduxStore } = __webpack_require__(/*! ./defs */ "./src/defs.js");

class Editor extends EventEmitter {
  constructor() {
    super();
    // Setup
    this._wasInEditor = this.inEditor;
    // Events
    this.register('OPENED');
    this.register('CLOSED');
    ReduxStore.subscribe(() => {
      if (this._wasInEditor !== this.inEditor) {
        if (this._wasInEditor) this.emit('CLOSED');
        else this.emit('OPENED');
      }
    });
  }
  get inEditor() {
    const state = ReduxStore?.getState();
    if (!state) return false;
    return !state.scratchGui.mode.isPlayerOnly;
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

class GUI extends EventEmitter {
  constructor() {
    // Importing some classes
    this.editor = __webpack_require__(/*! ./editor */ "./src/editor.js");
    this._modal = this.makeModal;
    this._menubutton = this.makeButton;
  }

  // Makers
  get makeButton() {
    const menuButton = new MenuBarButton('<h1>Pawloader</h1>', null, false);
    menuButton.node.addEventListener('click', (event) => this.menuButtonClicked(event));
    return menuButton;
  }
  get makeModal() {
    return document.createElement('dialog');
  }
  
  // Setup
  setup() {
    if (this._modal) {
      try { this._modal.remove() } catch {};
      this._modal = this.makeModal;
    }
    document.body.appendChild(this._modal);
    this.editor.on('OPENED', this.regenButton);
    this.editor.on('CLOSED', this.regenButton);
  }

  // Button stuff
  regenButton() {
    this._menubutton = this.makeButton;
    this._menubutton.show();
  }

  // Events
  menuButtonClicked(event) {
    this.show();
  }

  show() {
    this._modal.showModal();
  }
  hide() {
    this._modal.hide();
  }
}
module.exports = new GUI;

/***/ }),

/***/ "./src/utils/index.js":
/*!****************************!*\
  !*** ./src/utils/index.js ***!
  \****************************/
/***/ (() => {

/**
 * Calls hasOwnProperty without doing it on the main object.
 * @param {Object} object The object to check for the key on.
 * @param {String} key The key to check for.
 */
const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

modules.exports = {
  hasOwn
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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const GUI = __webpack_require__(/*! ./gui */ "./src/gui.js");
GUI.setup();
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map
})();