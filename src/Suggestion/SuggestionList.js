/**
 *
 */
import SuggestionLogger from './SuggestionLogger.js';
import { objectEqual, highlightKeywords, getPrevKey, getNextKey } from "./Helper.js";

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

export default class SuggestionList {
  constructor(id, setting, props) {
    this.id = id;
    this.setting = setting;
    this.props = props;
    
    this.suggestListNode = null;
    this.listNode = null; // Migrate to another class
    
    this.logger = new SuggestionLogger(id, setting.debug);
    
    
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
    const nextItemKey = getPrevKey(this.stateSuggestItems, this.stateFocusedItemKey);
    this.updateStateFocusedItemKey(nextItemKey);
  }
  
  onDownKey() {
    const prevItemKey = getNextKey(this.stateSuggestItems, this.stateFocusedItemKey);
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
    if (objectEqual(this.stateSuggestItems, items)) {
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
        iName.innerHTML = highlightKeywords(item.name, this.props.getKeyword());
        
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