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
  constructor(id, data) {
    this.id = id;
    this.data = data;
    
    this.inputEle = document.querySelector(`[data-sg-id="${id}"]`);
    this.containerNode = null;
    this.suggestListNode = null;
    this.listNode = null; // Migrate to another class
    
    this.eventManager = {
      inputInput: null,
      inputFocus: null,
      inputBlur: null,
      docClick: null,
    };
    
    this.logger = new Logger(id, setting.debug);
    
    
    this.initUI();
    this.updateSuggestionList(this.getData()); // Initial suggestion list
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
    this.inputEle.replaceWith2(containerNode);
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
  }
  
  stopListener() {
    this.inputEle.removeEventListener("input", this.eventManager.inputInput);
    this.inputEle.removeEventListener("focus", this.eventManager.inputFocus);
    document.addEventListener('click', this.eventManager.docClick);
  }
  
  onInputEleInput () {
    let myTimer;
    const keyword = this.getKeyword();
    
    clearTimeout(myTimer);
    myTimer = setTimeout(() => {
      this.suggestListNode.innerHTML = keyword;
    }, setting.suggestionInput.searchDelay);
  }
  onInputEleFocus() {
    this.showSuggestion();
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
      this.hideSuggestion();
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
    this.data = data;
  }
  
  /**
   * Some part of this.data
   *
   * Current update method:
   *    Clear all child of DOM node listNode
   *    Append new child for listNode
   *
   * @param items
   */
  updateSuggestionList(items) {
    if (this.listNode === null) {
      this.logger.log('ERROR: listNode is null');
      return;
    }
    
    this.listNode.innerHTML = null;
    
    for (let key in items) {
      if (items.hasOwnProperty(key)) {
        const app = items[key];
        
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
  
        const iDiv = document.createElement('div');
        iDiv.classList.add('flex');
        
        const iBtn = document.createElement('div');
        iBtn.classList.add('item-btn');
        
        const iIcon = document.createElement('img');
        iIcon.classList.add('item-img');
        iIcon.setAttribute('alt', app.name);
        iIcon.setAttribute('src', app.icon);
        
        const iName = document.createElement('span');
        iName.classList.add('item-title');
        iName.innerText = app.name;
        
        iDiv.appendChild(iIcon);
        iDiv.appendChild(iName);
        iNode.appendChild(iDiv);
        iNode.appendChild(iBtn);
        
        
        // Append to list
        this.listNode.appendChild(iNode);
      }
    }
  }
  
  updateHistoryList() {
  
  }
  
  doSearch() {
  
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