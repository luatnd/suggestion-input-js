/**
 *  goal: Init input
 *  Put input inside a container
 *  Init a suggestion box that show the inputted value
 */

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
    };
    
    this.logger = new Logger(id, setting.debug);
    this.inputTimer = null;
    
    this.stateActive = false; // The dropDown is showing (input can focus or not)
    this.stateSuggestItems = {};
    this.stateHistoryItems = {};
    
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
  }
  
  stopListener() {
    this.inputEle.removeEventListener("input", this.eventManager.inputInput);
    this.inputEle.removeEventListener("focus", this.eventManager.inputFocus);
    document.removeEventListener('click', this.eventManager.docClick);
    this.listNode.removeEventListener('click', this.eventManager.listClick);
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
  
  onListNodeClicked(event) {
    const clickedListItem = event.target.closest(`.${setting.suggestionList.className} > ul > li`);
    if (clickedListItem !== null) {
      const item = this.getDataItemByKey(clickedListItem.getAttribute('data-id'));
      this.updateInputVal(item.name);
    } else {
      this.logger.log('Error: Can not found the item?');
    }
  }
  
  initDatabase() {
    this.logger.log("TODO: initDatabase");
  }
  
  /**
   * Using as a setter for stateActive
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

  showSuggestion() {
    this.suggestListNode.classList.add(setting.suggestionList.activeClassName);
  }
  
  hideSuggestion() {
    this.suggestListNode.classList.remove(setting.suggestionList.activeClassName);
  }
  
  /**
   * List Items of this suggestion instance
   * Data structure:
   *    data[app.id] = {
   *      id: string,
   *      icon: string,
   *      name: string,
   *    }
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
    
    this.stateSuggestItems = items;
    
    if (this.listNode === null) {
      this.logger.log('ERROR: listNode is null');
      return;
    }
    
    this.listNode.innerHTML = null;
    
    for (let key in items) {
      if (items.hasOwnProperty(key)) {
        const item = items[key];
        
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
        iNode.setAttribute('data-id', key);
  
        const iDiv = document.createElement('div');
        iDiv.classList.add('flex');
        
        const iBtn = document.createElement('div');
        iBtn.classList.add('item-btn');
        
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
        iNode.appendChild(iBtn);
        
        
        // Append to list
        this.listNode.appendChild(iNode);
      }
    }
  }
  
  static getId(id) {
    return 'I' + id;
  }
  
  // TODO: Move all static fn to prototype or another helper class
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
    this.logger.log('Show suggestion for ' + keyword);
  
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

class Logger {
  constructor(id, debug = false) {
    this.id = id;
    this.debug = debug;
  }
  
  log() {
    const args = [].slice.call(arguments);
    if (setting.debug) {
      console.log(`[${this.id}]`, ...args);
    }
  }
}