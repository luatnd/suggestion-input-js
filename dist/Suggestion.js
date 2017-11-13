/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(module) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__polyfill_index_js__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Suggestion_Suggestion_js__ = __webpack_require__(4);

Object(__WEBPACK_IMPORTED_MODULE_0__polyfill_index_js__["a" /* default */])();



if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
  module.exports = __WEBPACK_IMPORTED_MODULE_1__Suggestion_Suggestion_js__["a" /* default */];
else
  window.Suggestion = __WEBPACK_IMPORTED_MODULE_1__Suggestion_Suggestion_js__["a" /* default */];

console.log('plugin: all done');
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(1)(module)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = function(originalModule) {
	if(!originalModule.webpackPolyfill) {
		var module = Object.create(originalModule);
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		Object.defineProperty(module, "exports", {
			enumerable: true,
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__DOM_js__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ESX_js__ = __webpack_require__(17);



/* harmony default export */ __webpack_exports__["a"] = (function () {
  Object(__WEBPACK_IMPORTED_MODULE_0__DOM_js__["a" /* default */])();
  Object(__WEBPACK_IMPORTED_MODULE_1__ESX_js__["a" /* default */])();
});

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * This file contain all polyfill for the browser DOM
 */
/* harmony default export */ __webpack_exports__["a"] = (function () {
  addReplaceWith();
  closest_Polyfill();
  remove_Polyfill();
});

function addReplaceWith(){
  /**
   * Element.prototype.replaceWith
   */
  function ReplaceWith(Ele) {
    'use-strict'; // For safari, and IE > 10
    var parent = this.parentNode,
      i = arguments.length,
      firstIsNode = +(parent && typeof Ele === 'object');
    if (!parent) return;
    
    while (i-- > firstIsNode){
      if (parent && typeof arguments[i] !== 'object'){
        arguments[i] = document.createTextNode(arguments[i]);
      } if (!parent && arguments[i].parentNode){
        arguments[i].parentNode.removeChild(arguments[i]);
        continue;
      }
      parent.insertBefore(this.previousSibling, arguments[i]);
    }
    if (firstIsNode) parent.replaceChild(Ele, this);
  }
  
  if (!Element.prototype.replaceWith)
    Element.prototype.replaceWith = ReplaceWith;
  if (!CharacterData.prototype.replaceWith)
    CharacterData.prototype.replaceWith = ReplaceWith;
  if (!DocumentType.prototype.replaceWith)
    DocumentType.prototype.replaceWith = ReplaceWith;
}


function closest_Polyfill() {
  if (!Element.prototype.matches)
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector;
  
  if (!Element.prototype.closest)
    Element.prototype.closest = function(s) {
      var el = this;
      if (!document.documentElement.contains(el)) return null;
      do {
        if (el.matches(s)) return el;
        el = el.parentElement;
      } while (el !== null);
      return null;
    };
}

function remove_Polyfill() {
  // from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
  (function (arr) {
    arr.forEach(function (item) {
      if (item.hasOwnProperty('remove')) {
        return;
      }
      Object.defineProperty(item, 'remove', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function remove() {
          if (this.parentNode !== null)
            this.parentNode.removeChild(this);
        }
      });
    });
  })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
}

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SuggestionLogger_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__SuggestionStore_js__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__SuggestionInput_js__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__SuggestionList_js__ = __webpack_require__(22);
/**
 *  goal: Init input
 *  Put input inside a container
 *  Init a suggestion box that show the inputted value
 */







const setting = {
  debug: true,
  container: {
    className: "suggestion-container"
  },
  suggestionInput: {
    className: "suggestion-input",
    searchDelay: 200, // TOdo: Expose to API
  },
  suggestionList: {
    className: "suggestion-list",
    activeClassName: "show",
    history: {
      className: "suggestion-list-history"
    }
  },
}

class Suggestion {
  /**
   *
   * @param {string} id
   * @param {[]} data
   * @param {{}} option {
   *  debug: boolean,
   *  searchDelay: int,
   * }
   */
  constructor(id, data, option = {
    debug: false,
    searchDelay: 200,
  }) {
    this.id = id;
    this.setData(data);
    this.setting = this.mapPublicOption(option);
    
    this.containerNode = null;
    
    this.eventManager = {
      docClick: null,
    };
    
    this.logger = new __WEBPACK_IMPORTED_MODULE_0__SuggestionLogger_js__["a" /* default */](id, this.setting.debug);
    this.localStore = new __WEBPACK_IMPORTED_MODULE_1__SuggestionStore_js__["a" /* default */](id, this.setting);
    this.stateActive = false; // The dropDown is showing (input can focus or not)
    
    this.input = new __WEBPACK_IMPORTED_MODULE_2__SuggestionInput_js__["a" /* default */](id, this.setting, {
      doSearch: this.doSearch.bind(this),
      updateActiveState: this.updateActiveState.bind(this),
    });
    
    this.dropdown = new __WEBPACK_IMPORTED_MODULE_3__SuggestionList_js__["a" /* default */](id, this.setting, {
      localStore: this.localStore,
      getStateActive: this.getStateActive.bind(this),
      getDataItemByKey: this.getDataItemByKey.bind(this),
      getKeyword: this.input.getKeyword.bind(this.input),
      setKeyword: this.input.setKeyword.bind(this.input),
      getInputDomEle: this.input.getDomEle.bind(this.input),
    });
    
    this.initUI();
    this.dropdown.updateStateSuggestItems(this.getData()); // Initial suggestion list
    this.startListener();
    //this.initDatabase();
  }
  
  destruct() {
    this.input.destruct();
    this.dropdown.destruct();
    this.containerNode.outerHTML = this.input.getDomEle().outerHTML;
    
    this.stopListener();
    // Remain the database
  }
  
  mapPublicOption(option) {
    const newSetting = Object.assign({}, setting);
    
    if (typeof option !== 'undefined') {
      if (typeof option.debug !== 'undefined') {
        newSetting.debug = option.debug;
      }
      if (typeof option.searchDelay !== 'undefined') {
        newSetting.suggestionInput = Object.assign({}, newSetting.suggestionInput, {searchDelay: option.searchDelay});
      }
    }
    
    return newSetting;
  }
  
  /**
   * Transform input element UI into a suggestion input UI
   *    Container
   *        SuggestionInput
   *            InputEle
   *        SuggestionList
   *            ListItem
   *
   * TODO: disable UI
   * 1. Disable the UI
   * 2. Init
   * 3. Done then enable the UI
   */
  initUI() {
    const newInputEle = this.input.getDomEle().cloneNode(true);
    newInputEle.classList.add(this.setting.suggestionInput.className);
    
    /**
     * Plugin container Dom node
     * @type {Element}
     */
    const containerNode = document.createElement('div');
    containerNode.classList.add(this.setting.container.className);
    this.input.getDomEle().replaceWith(containerNode);
    this.containerNode = containerNode;
    
    this.input.setDomEle(newInputEle);
    containerNode.appendChild(this.input.getDomEle());
    
    
    const suggestListNode = document.createElement('div');
    suggestListNode.classList.add(this.setting.suggestionList.className);
    containerNode.appendChild(suggestListNode);
    this.dropdown.setSuggestListNode(suggestListNode);
    
    this.dropdown.setListNodeEle(document.createElement('ul'));
    this.dropdown.getSuggestListNode().appendChild(this.dropdown.getListNodeEle());
  }
  
  startListener() {
    this.input.startListener();
    
    /**
     * Detect and handle click outside of suggestion container
     */
    document.addEventListener('click', this.eventManager.docClick = this.onDocumentClicked.bind(this));
    
    this.dropdown.startListener();
  }
  
  stopListener() {
    this.input.stopListener();
    document.removeEventListener('click', this.eventManager.docClick);
    this.dropdown.stopListener();
  }
  
  /**
   * Can use Element.closest() but its very experimental, not safe
   * Can use Element.closest() polyfill with Element.matches(), but matches() is non-standard itself
   * Use node.contains()
   *
   * TODO: might need 200px on mobile screen so that we can click outside, 400px is too tall
   *
   * @param event
   */
  onDocumentClicked(event) {
    const isClickedInside = this.containerNode.contains(event.target);
    if (!isClickedInside) {
      this.updateActiveState(false);
    }
  }
  
  /**
   * List Items of this suggestion instance
   * Data structure:
   *    data[key] = {
   *      id: string,
   *      icon: string,
   *      name: string,
   *    }
   *    NOTE that: key = "I" + app.id;
   *    Because we need key:string to control the order, can not control order with key:int
   *
   * @returns {*}
   */
  getData() {
    return this.data;
  }
  
  setData(data) {
    this.data = {};
    if (Array.isArray(data)) {
      for (let item of data) {
        this.data[Suggestion.getId(item.id)] = item;
      }
    }
  }
  
  getDataItem(itemOriginalId) {
    return this.getDataItemByKey(Suggestion.getId(itemOriginalId));
  }
  
  getDataItemByKey(itemKey) {
    return (typeof this.data[itemKey] !== 'undefined') ? this.data[itemKey] : null;
  }
  
  getStateActive() {
    return this.stateActive;
  }
  
  /**
   * Using as a setter + trigger UI change.
   *
   * @param {boolean} state
   */
  updateActiveState(state) {
    this.stateActive = state;
    
    if (this.stateActive) {
      this.dropdown.showSuggestion();
    } else {
      this.dropdown.hideSuggestion();
    }
  }
  
  static getId(id) {
    return 'I' + id;
  }
  
  doSearch(keyword) {
    const matchedItems = __WEBPACK_IMPORTED_MODULE_3__SuggestionList_js__["a" /* default */].search(this.getData(), keyword);
    this.dropdown.updateStateSuggestItems(matchedItems);
  }
  
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Suggestion;



/***/ }),
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * This file contain all polyfill for the ES5, ES6, ES_X version
 */
/* harmony default export */ __webpack_exports__["a"] = (function () {
  objectAssignPolyfill();
});

function objectAssignPolyfill() {
  
  if (typeof Object.assign != 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
      value: function assign(target, varArgs) { // .length of function is 2
        'use strict';
        if (target == null) { // TypeError if undefined or null
          throw new TypeError('Cannot convert undefined or null to object');
        }
        
        var to = Object(target);
        
        for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];
          
          if (nextSource != null) { // Skip over if undefined or null
            for (var nextKey in nextSource) {
              // Avoid bugs when hasOwnProperty is shadowed
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
      },
      writable: true,
      configurable: true
    });
  }
}


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

class SuggestionLogger {
  constructor(id, debug = false) {
    this.id = id;
    this.debug = debug;
  }
  
  log() {
    const args = [].slice.call(arguments);
    if (this.debug) {
      console.log(`[${this.id}]`, ...args);
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SuggestionLogger;


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class MyLocalStorage {
  constructor (key) {
    this.localStoreIndex = key;
    
    if (this.storageAvailable('localStorage')) {
      // Yippee! We can use localStorage awesomeness
    }
    else {
      // Too bad, no localStorage for us
    }
  }
  
  getStore() {
    const store = localStorage.getItem(this.localStoreIndex);
    return store ? JSON.parse(store) : {};
  }
  
  setStore(storeData) {
    localStorage.setItem(this.localStoreIndex, (typeof storeData !== 'undefined')
      ? JSON.stringify(storeData)
      : '{}'
    );
  }
  
  /**
   * LocalStorage
   *    [localStoreIndex] : {
   *      [index]: indexData
   *    }
   *
   * @param index
   * @returns {null}
   */
  getData(index) {
    const data = this.getStore();
  
    return (typeof data[index] !== 'undefined') ? data[index] : null;
  }
  
  /**
   * LocalStorage
   *    [localStoreIndex] : {
   *      [index]: indexData
   *    }
   *
   * @param index
   * @param indexData
   */
  setData(index, indexData) {
    const data = this.getStore();
    data[index] = indexData;
    
    this.setStore(data)
  }
  
  
  storageAvailable(type) {
    try {
      const storage = window[type],
        x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      
      return true;
    }
    catch(e) {
      return e instanceof DOMException && (
          // everything except Firefox
        e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage.length !== 0;
    }
  }
}


class SuggestionStore {
  constructor(id, setting) {
    this.store = new MyLocalStorage('Suggestion_' + id);
  }
  
  /**
   * LocalStorage
   *    "mySuggestionPlugin_1" : {
   *      "history": {
   *        itemKey: itemKey, // For fast access
   *      }
   *    }
   *
   */
  getHistoryItemKeys() {
    const historyItems = this.store.getData('history');
  
    return historyItems !== null ? historyItems : {};
  }
  
  isHistoryItemExist(itemKey) {
    const historyItems = this.getHistoryItemKeys();
  
    return (typeof historyItems[itemKey] !== 'undefined');
  }
  
  /**
   * Add history item to the history store
   * NOTE: Save max 25 history item
   *
   * @param itemKey
   */
  addHistoryItem (itemKey) {
    if (this.isHistoryItemExist(itemKey)) {
      return;
    }
    
    const MAX_HISTORY_ITEM = 25;
    
    const historyItems = this.getHistoryItemKeys();
    const newHistoryItems = {[itemKey]: itemKey};
    let count = 0;
    for (let prop in historyItems) {
      if (count >= MAX_HISTORY_ITEM - 1) {
        break;
      } else {
        count++;
      }
  
      if (historyItems.hasOwnProperty(prop)) {
        newHistoryItems[prop]  = historyItems[prop];
      }
    }
    
    this.store.setData('history', newHistoryItems);
  }
  
  removeHistoryItem (itemKey) {
    const historyItems = this.getHistoryItemKeys();
    delete historyItems[itemKey];
    this.store.setData('history', historyItems);
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SuggestionStore;


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 *
 */
class SuggestionInput {
  constructor(id, setting, props) {
    this.inputEle = document.querySelector(`[data-sg-id="${id}"]`);
    
    this.setting = setting;
    this.props = props;
    
    this.eventManager = {
      inputInput: null,
      inputFocus: null,
      inputBlur: null,
    };
  
    this.inputTimer = null;
    //this.startListener(); // Can not start listener this time,
  }
  
  destruct() {
    this.inputEle.classList.remove(this.setting.suggestionInput.className);
    this.stopListener();
  }
  
  getDomEle() {
    return this.inputEle;
  }
  
  setDomEle(ele) {
    return this.inputEle = ele;
  }
  
  getKeyword() {
    return this.inputEle.value;
  }
  
  setKeyword(keyword) {
    this.inputEle.value = keyword;
  }
  
  startListener() {
    this.inputEle.addEventListener("input", this.eventManager.inputInput = this.onInputEleInput.bind(this));
    this.inputEle.addEventListener("focus", this.eventManager.inputFocus = this.onInputEleFocus.bind(this));
  }
  
  stopListener() {
    this.inputEle.removeEventListener("input", this.eventManager.inputInput);
    this.inputEle.removeEventListener("focus", this.eventManager.inputFocus);
  }
  
  onInputEleInput() {
    const keyword = this.getKeyword();
    clearTimeout(this.inputTimer);
    this.inputTimer = setTimeout(() => {
      
      this.props.doSearch(keyword);
      
    }, this.setting.suggestionInput.searchDelay);
  }
  
  onInputEleFocus() {
    this.props.updateActiveState(true);
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SuggestionInput;


/***/ }),
/* 21 */,
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__SuggestionLogger_js__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Helper_js__ = __webpack_require__(23);
/**
 *
 */



const KEY = {
  AT:              64,
  BACKSPACE:       8,
  DELETE:          46,
  TAB:             9,
  ESC:             27,
  RETURN:          13,
  LEFT:            37,
  UP:              38,
  RIGHT:           39,
  DOWN:            40,
  SPACE:           32,
  HOME:            36,
  END:             35,
  COMMA:           188,
  NUMPAD_ADD:      107,
  NUMPAD_DECIMAL:  110,
  NUMPAD_DIVIDE:   111,
  NUMPAD_ENTER:    108,
  NUMPAD_MULTIPLY: 106,
  NUMPAD_SUBTRACT: 109,
  PAGE_DOWN:       34,
  PAGE_UP:         33,
  PERIOD:          190,
};

class SuggestionList {
  constructor(id, setting, props) {
    this.id = id;
    this.setting = setting;
    this.props = props;
    
    this.suggestListNode = null;
    this.listNode = null; // Migrate to another class
    
    this.logger = new __WEBPACK_IMPORTED_MODULE_0__SuggestionLogger_js__["a" /* default */](id, setting.debug);
    
    
    this.eventManager = {
      listClick: null,
      docKeyDown: null,
    };
    
    
    this.stateSuggestItems = {}; // List of item in suggest box
    //this.stateHistoryItems = {}; // List of item in history box
    this.stateFocusedItemKey = null; // The Focused (up/down key position) item `key` in this.data (get `key` by this.getId(item.id))
    this.stateSelectedItemKey = null; // The selected item `key` in this.data (get `key` by this.getId(item.id))
  }
  
  destruct() {
  
  }
  
  
  setListNodeEle(ele) {
    this.listNode = ele;
  }
  
  getListNodeEle() {
    return this.listNode;
  }
  
  setSuggestListNode(ele) {
    this.suggestListNode = ele;
  }
  
  getSuggestListNode() {
    return this.suggestListNode;
  }
  
  startListener() {
    /**
     * Detect click an list item
     */
    this.listNode.addEventListener('click', this.eventManager.listClick = this.onListNodeClicked.bind(this));
  
    /**
     * Handle keyboard selection
     */
    document.addEventListener('keydown', this.eventManager.docKeyDown = this.onDocKeyDown.bind(this));
  }
  
  stopListener() {
    this.listNode.removeEventListener('click', this.eventManager.listClick);
    document.removeEventListener('keydown', this.eventManager.docKeyDown);
  }
  
  onDocKeyDown(event) {
    // Do not care about some instances else
    if (this.props.getStateActive()) {
      switch (event.keyCode) {
        case KEY.DOWN:
          this.onDownKey();
          break;
        case KEY.UP:
          this.onUpKey();
          break;
        case KEY.RETURN:
          event.preventDefault();
          this.onEnterKey();
          break;
      }
    }
  }
  
  onUpKey() {
    const nextItemKey = Object(__WEBPACK_IMPORTED_MODULE_1__Helper_js__["b" /* getPrevKey */])(this.stateSuggestItems, this.stateFocusedItemKey);
    this.updateStateFocusedItemKey(nextItemKey);
  }
  
  onDownKey() {
    const prevItemKey = Object(__WEBPACK_IMPORTED_MODULE_1__Helper_js__["a" /* getNextKey */])(this.stateSuggestItems, this.stateFocusedItemKey);
    this.updateStateFocusedItemKey(prevItemKey);
  }
  
  onEnterKey() {
    // Enter then choose focused item is selected
    const selectedItemKey = this.stateFocusedItemKey;
    
    this.updateStateSelectedItemKey(selectedItemKey);
  }
  
  onListNodeClicked(event) {
    const clickedListItem = event.target.closest(`.${this.setting.suggestionList.className} > ul > li`);
    if (clickedListItem !== null) {
      const isHistoryDeleteBtn = event.target.matches('.item-btn');
      
      if (isHistoryDeleteBtn) {
        
        this.removeHistoryListItem(clickedListItem);
        
      } else {
        
        this.updateStateSelectedItemKey(clickedListItem.getAttribute('data-key'));
        
      }
      
    } else {
      this.logger.log('Error: Can not found the item?');
    }
  }
  
  showSuggestion() {
    this.suggestListNode.classList.add(this.setting.suggestionList.activeClassName);
  }
  
  hideSuggestion() {
    this.suggestListNode.classList.remove(this.setting.suggestionList.activeClassName);
  }
  
  
  
  /**
   * Using as a setter + trigger UI change.
   * @param {string} itemKey
   */
  updateStateSelectedItemKey(itemKey) {
    if (itemKey === this.stateSelectedItemKey) {
      return;
    }
    
    // Remove active from old node
    if (this.stateSelectedItemKey !== null) {
      const prevActiveNode = this.listNode.querySelector(`[data-key="${this.stateSelectedItemKey}"]`);
      if (prevActiveNode) {
        // prevActiveNode can be null because the current filtered list can not ensure contain old select item
        prevActiveNode.classList.remove('selected');
      }
    }
    
    // Add active to new node
    const activeNode = this.listNode.querySelector(`[data-key="${itemKey}"]`);
    if (activeNode) {
      activeNode.classList.add('selected');
    }
    
    // Update state
    this.stateSelectedItemKey = itemKey;
    
    // Trigger UI change to input
    const item = this.props.getDataItemByKey(itemKey);
    this.props.setKeyword(item.name);
    
    this.updateStateFocusedItemKey(itemKey);
    
    
    // Save history to DB:
    this.props.localStore.addHistoryItem(itemKey);
  }
  
  /**
   * Using as a setter + trigger UI change.
   * @param {string} focusedItemKey
   */
  updateStateFocusedItemKey(focusedItemKey) {
    if (focusedItemKey === this.stateFocusedItemKey) {
      return;
    }
    
    // Remove active from old node
    if (this.stateFocusedItemKey !== null) {
      const prevActiveNode = this.listNode.querySelector(`[data-key="${this.stateFocusedItemKey}"]`);
      if (prevActiveNode) {
        // prevActiveNode can be null because the current filtered list can not ensure contain old select item
        prevActiveNode.classList.remove('focused');
      }
    }
    
    // Add active to new node
    const activeNode = this.listNode.querySelector(`[data-key="${focusedItemKey}"]`);
    if (activeNode) {
      activeNode.classList.add('focused');
    }
    
    // Update state
    this.stateFocusedItemKey = focusedItemKey;
    
    // Scroll into view only if input was focused
    if (this.props.getInputDomEle() === document.activeElement) {
      if (typeof activeNode.scrollIntoView !== 'undefined') {
        activeNode.scrollIntoView()
      }
    }
  }
  
  
  /**
   * Using as a setter + trigger UI change.
   *
   * Remove history item
   */
  removeHistoryListItem (listItemElement) {
    const itemKey = listItemElement.getAttribute('data-key');
    
    // remove from history
    this.props.localStore.removeHistoryItem(itemKey);
    
    // remove from dom
    listItemElement.classList.add('remove'); // CSS transition
    setTimeout(function () {
      listItemElement.remove();
    }, 300);
    
    // Dangerously remove from state but avoid the DOM change
    delete this.stateSuggestItems[itemKey];
  }
  
  /**
   * Using as a setter + trigger UI change.
   *
   * Do update suggestion list and change the DOM
   * Only do update when items list was different to old items
   *
   * Some part of this.data
   *
   * Current update method:
   *    Clear all child of DOM node listNode
   *    Append new child for listNode
   *
   * @param items
   */
  updateStateSuggestItems(items) {
    // Need update or not
    if (Object(__WEBPACK_IMPORTED_MODULE_1__Helper_js__["d" /* objectEqual */])(this.stateSuggestItems, items)) {
      this.logger.log('new items same as old items --> No update');
      
      return;
    }
    
    
    /**
     * ====  HISTORY ITEM APPEND =======
     */
    const newItems = this.mergeListWithHistory(items);
    /**
     * ====  END: HISTORY ITEM APPEND =======
     */
    
    
    this.stateSuggestItems = newItems;
    
    
    if (this.listNode === null) {
      this.logger.log('ERROR: listNode is null');
      return;
    }
    
    this.listNode.innerHTML = null;
    
    for (let key in newItems) {
      if (newItems.hasOwnProperty(key)) {
        const item = newItems[key];
        
        /*
        <li>
            <div class="flex">
                <img class="item-img" alt="alt" src="http://is4.mzstatic.com/image/thumb/Purple128/v4/32/7e/ce/327ece67-3ebe-a39b-fb34-71ca3d917823/AppIcon-1x_U007emarketing-85-220-7.png/200x200bb.png">
                <span class="item-title">Tool glasses</span>
            </div>
            <div class="item-btn"></div>
        </li>
        
        TODO: Allow configure className of these elements
         */
        const iNode = document.createElement('li');
        iNode.setAttribute('data-key', key);
        
        const iDiv = document.createElement('div');
        iDiv.classList.add('flex');
        
        const iIcon = document.createElement('img');
        iIcon.classList.add('item-img');
        iIcon.setAttribute('alt', item.name);
        iIcon.setAttribute('src', item.icon);
        
        const iName = document.createElement('span');
        iName.classList.add('item-title');
        //iName.innerHTML = highlightKeywords(item.name, this.input.getKeyword());
        iName.innerHTML = Object(__WEBPACK_IMPORTED_MODULE_1__Helper_js__["c" /* highlightKeywords */])(item.name, this.props.getKeyword());
        
        iDiv.appendChild(iIcon);
        iDiv.appendChild(iName);
        iNode.appendChild(iDiv);
        
        
        
        /**
         * Handle History item UI
         */
        if (item.isHistory) {
          iNode.classList.add('his');
          
          const iBtn = document.createElement('div');
          iBtn.classList.add('item-btn');
          
          iNode.appendChild(iBtn);
        }
        /**
         * END Handle History item UI
         */
        
        
        // Append to list
        this.listNode.appendChild(iNode);
      }
    }
  }
  
  /**
   * The basic idea is check list items,
   * if it's is history item then move it to the beginning of the list
   * TODO: separate logic
   *
   * @param items
   * @returns {{}} newItems with history at the beginning of the list
   */
  mergeListWithHistory(items) {
    let historyItemKeys = this.props.localStore.getHistoryItemKeys();
    const suitableHistoryItems = {};
    let newItems = Object.assign({}, items);
    
    for (let key in historyItemKeys) {
      if (historyItemKeys.hasOwnProperty(key)) {
        
        if (typeof items[key] !== 'undefined') {
          const historyItem = items[key];
          
          suitableHistoryItems[key] = Object.assign({}, historyItem, {isHistory: true});
          delete newItems[key];
        }
        
      }
    }
    newItems = Object.assign({}, suitableHistoryItems, newItems);
    
    //this.logger.log("suitableHistoryItems: ", suitableHistoryItems);
    //this.logger.log("newItems: ", newItems);
    
    return newItems;
  }
  
  
  static search(items, keywords) {
    let newItems = {};
    
    for (let prop in items) {
      if (items.hasOwnProperty(prop)) {
        const app = items[prop];
        
        let matched = false;
        const words = keywords.trim().toLowerCase().split(' ');
        const title = app.name.toLowerCase()
        
        for (let i = 0, l = words.length; i < l; i++) {
          matched = matched || (title.indexOf(words[i]) >= 0);
        }
        
        if (matched) {
          newItems[prop] = app;
        }
      }
    }
    
    return newItems;
  }
  
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SuggestionList;


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = getNextKey;
/* harmony export (immutable) */ __webpack_exports__["b"] = getPrevKey;
/* harmony export (immutable) */ __webpack_exports__["c"] = highlightKeywords;
/* harmony export (immutable) */ __webpack_exports__["d"] = objectEqual;
function getNextKey(storeObject, currentKey) {
  let keys = Object.keys(storeObject);
  
  if (currentKey === null) {
    return keys[0];
  } else {
    let currIndex = keys.indexOf(currentKey);
    if (currIndex < 0) {
      return keys[0];
    } else if (currIndex === keys.length - 1) {
      return keys[keys.length - 1];
    } else {
      return keys[currIndex + 1];
    }
  }
}

function getPrevKey(storeObject, currentKey) {
  let keys = Object.keys(storeObject);
  
  if (currentKey === null) {
    return keys[0];
  } else {
    let currIndex = keys.indexOf(currentKey);
    return (currIndex > 1) ? keys[currIndex - 1] : keys[0];
  }
}

function highlightKeywords(str, keywords) {
  function regexEscape(str) {
    return str.replace(/[[{}()*+?^$|\]\.\\]/g, "\\$&")
  }
  
  const words = keywords.trim().split(' ').map(w => regexEscape(w));
  const safeRegEx = words.join('|');
  const containSomeOf = new RegExp(`(${safeRegEx})`, "gi");
  
  return str.replace(containSomeOf, '<span>$1</span>');
}

function objectEqual(obj1, obj2) {
  let eq = true;
  
  const o1Keys = Object.keys(obj1);
  const o2Keys = Object.keys(obj2);
  
  if (o1Keys.length !== o2Keys.length) {
    eq = false;
  } else {
    for (let key of o1Keys) {
      if (typeof obj2[key] === 'undefined') {
        eq = false;
        break;
      }
    }
  }
  
  return eq;
}

/***/ })
/******/ ]);