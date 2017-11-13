/**
 *  goal: Init input
 *  Put input inside a container
 *  Init a suggestion box that show the inputted value
 */

import SuggestionLogger from './SuggestionLogger.js';
import SuggestionStore from './SuggestionStore.js';

// TODO: change all class name into BEM
// TODO: change this to defaultSetting, and allow to pass the setting
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
    history:{
      className: "suggestion-list-history"
    }
  },
}
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
export default class Suggestion {
  /**
   *
   * @param {string} id
   * @param {[]} data
   */
  constructor(id, data) {
    this.id = id;
    this.setData(data);
    
    this.inputEle = document.querySelector(`[data-sg-id="${id}"]`);
    this.containerNode = null;
    this.suggestListNode = null;
    this.listNode = null; // Migrate to another class
    
    this.eventManager = {
      inputInput: null,
      inputFocus: null,
      inputBlur: null,
      docClick: null,
      listClick: null,
      docKeyDown: null,
    };
    
    this.logger = new SuggestionLogger(id, setting.debug);
    this.localStore = new SuggestionStore(id, setting);
    this.inputTimer = null;
    
    this.stateActive = false; // The dropDown is showing (input can focus or not)
    this.stateSuggestItems = {}; // List of item in suggest box
    //this.stateHistoryItems = {}; // List of item in history box
    this.stateFocusedItemKey = null; // The Focused (up/down key position) item `key` in this.data (get `key` by this.getId(item.id))
    this.stateSelectedItemKey = null; // The selected item `key` in this.data (get `key` by this.getId(item.id))
    
    this.initUI();
    this.updateStateSuggestItems(this.getData()); // Initial suggestion list
    this.startListener();
    this.initDatabase();
  }
  
  destruct() {
    this.inputEle.classList.remove(setting.suggestionInput.className);
    this.containerNode.outerHTML = this.inputEle.outerHTML;
    this.stopListener();
    // Remain the database
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
    const inputEle = this.inputEle.cloneNode(true);
    inputEle.classList.add(setting.suggestionInput.className);
    
    /**
     * Plugin container Dom node
     * @type {Element}
     */
    const containerNode = document.createElement('div');
    containerNode.classList.add(setting.container.className);
    this.inputEle.replaceWith(containerNode);
    this.containerNode = containerNode;
    
    this.inputEle = inputEle;
    containerNode.appendChild(this.inputEle);
    
    
    const suggestListNode = document.createElement('div');
    suggestListNode.classList.add(setting.suggestionList.className);
    containerNode.appendChild(suggestListNode);
    this.suggestListNode = suggestListNode;
  
    this.listNode = document.createElement('ul');
    this.suggestListNode.appendChild(this.listNode);
  }
  
  startListener() {
    
    this.inputEle.addEventListener("input", this.eventManager.inputInput = this.onInputEleInput.bind(this));
    this.inputEle.addEventListener("focus", this.eventManager.inputFocus = this.onInputEleFocus.bind(this));
    
    /**
     * Detect and handle click outside of suggestion container
     */
    document.addEventListener('click', this.eventManager.docClick = this.onDocumentClicked.bind(this));
  
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
    this.inputEle.removeEventListener("input", this.eventManager.inputInput);
    this.inputEle.removeEventListener("focus", this.eventManager.inputFocus);
    document.removeEventListener('click', this.eventManager.docClick);
    this.listNode.removeEventListener('click', this.eventManager.listClick);
    document.removeEventListener('keydown', this.eventManager.docKeyDown);
  }
  
  onInputEleInput () {
    const keyword = this.getKeyword();

    clearTimeout(this.inputTimer);
    this.inputTimer = setTimeout(() => {
      
      this.doSearch(keyword);
      
    }, setting.suggestionInput.searchDelay);
  }
  
  onInputEleFocus() {
    this.updateActiveState(true);
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
  
  onDocKeyDown(event) {
    // Do not care about some instances else
    if (this.stateActive) {
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
    const nextItemKey = Suggestion.getPrevKey(this.stateSuggestItems, this.stateFocusedItemKey);
    this.updateStateFocusedItemKey(nextItemKey);
  }
  
  onDownKey() {
    const prevItemKey = Suggestion.getNextKey(this.stateSuggestItems, this.stateFocusedItemKey);
    this.updateStateFocusedItemKey(prevItemKey);
  }
  
  onEnterKey() {
    // Enter then choose focused item is selected
    const selectedItemKey = this.stateFocusedItemKey;
    
    this.updateStateSelectedItemKey(selectedItemKey);
  }
  
  onListNodeClicked(event) {
    const clickedListItem = event.target.closest(`.${setting.suggestionList.className} > ul > li`);
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
  
  initDatabase() {
    this.logger.log("TODO: initDatabase");
  }

  showSuggestion() {
    this.suggestListNode.classList.add(setting.suggestionList.activeClassName);
  }
  
  hideSuggestion() {
    this.suggestListNode.classList.remove(setting.suggestionList.activeClassName);
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
  
  
  /**
   * Using as a setter + trigger UI change.
   *
   * @param {boolean} state
   */
  updateActiveState(state) {
    this.stateActive = state;
    
    if (this.stateActive) {
      this.showSuggestion();
    } else {
      this.hideSuggestion();
    }
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
    const item = this.getDataItemByKey(itemKey);
    this.updateInputVal(item.name);
  
    this.updateStateFocusedItemKey(itemKey);
    

    // Save history to DB:
    this.localStore.addHistoryItem(itemKey);
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
    if (this.inputEle === document.activeElement) {
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
    this.localStore.removeHistoryItem(itemKey);
    
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
    if (Suggestion.objectEqual(this.stateSuggestItems, items)) {
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
        iName.innerHTML = Suggestion.highlightKeywords(item.name, this.getKeyword());
        
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
   *
   * @param items
   * @returns {{}} newItems with history at the beginning of the list
   */
  mergeListWithHistory(items) {
    let historyItemKeys = this.localStore.getHistoryItemKeys();
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
  
  static getId(id) {
    return 'I' + id;
  }
  
  // TODO: Move all static fn to prototype or another helper class
  static getNextKey(storeObject, currentKey) {
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
  static getPrevKey(storeObject, currentKey) {
    let keys = Object.keys(storeObject);
    
    if (currentKey === null) {
      return keys[0];
    } else {
      let currIndex = keys.indexOf(currentKey);
      return (currIndex > 1) ? keys[currIndex - 1] : keys[0];
    }
  }
  static highlightKeywords(str, keywords) {
    function regexEscape(str) {
      return str.replace(/[[{}()*+?^$|\]\.\\]/g, "\\$&")
    }
    
    const words = keywords.trim().split(' ').map(w => regexEscape(w));
    const safeRegEx = words.join('|');
    const containSomeOf = new RegExp(`(${safeRegEx})`, "gi");
    
    return str.replace(containSomeOf, '<span>$1</span>');
  }
  static objectEqual(obj1, obj2) {
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
  
  updateInputVal (val) {
    this.inputEle.value = val;
  }
  
  updateHistoryList() {
  
  }
  
  
  doSearch(keyword) {

    const matchedItems = search(this.getData(), keyword);
    this.updateStateSuggestItems(matchedItems);
    
    /**
     * TODO: Move to Suggestion input class for easier testing
     */
    function search(items, keywords) {
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
  
  getKeyword() {
    return this.inputEle.value;
  }
  setKeyword(keyword) {
    this.inputEle.value = keyword;
  }
  
  getItemByKeyword(keyword) {
  
  }
}
