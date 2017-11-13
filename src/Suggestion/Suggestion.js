/**
 *  goal: Init input
 *  Put input inside a container
 *  Init a suggestion box that show the inputted value
 */

import SuggestionLogger from './SuggestionLogger.js';
import SuggestionStore from './SuggestionStore.js';
import SuggestionInput from "./SuggestionInput.js";
import SuggestionList from "./SuggestionList.js";

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
    history: {
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
    
    this.containerNode = null;
    
    this.eventManager = {
      docClick: null,
    };
    
    this.logger = new SuggestionLogger(id, setting.debug);
    this.localStore = new SuggestionStore(id, setting);
    this.stateActive = false; // The dropDown is showing (input can focus or not)
    
    this.input = new SuggestionInput(id, setting, {
      doSearch: this.doSearch.bind(this),
      updateActiveState: this.updateActiveState.bind(this),
    });
    
    this.dropdown = new SuggestionList(id, setting, {
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
    this.initDatabase();
  }
  
  destruct() {
    this.input.destruct();
    this.dropdown.destruct();
    this.containerNode.outerHTML = this.input.getDomEle().outerHTML;
    
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
    const newInputEle = this.input.getDomEle().cloneNode(true);
    newInputEle.classList.add(setting.suggestionInput.className);
    
    /**
     * Plugin container Dom node
     * @type {Element}
     */
    const containerNode = document.createElement('div');
    containerNode.classList.add(setting.container.className);
    this.input.getDomEle().replaceWith(containerNode);
    this.containerNode = containerNode;
    
    this.input.setDomEle(newInputEle);
    containerNode.appendChild(this.input.getDomEle());
    
    
    const suggestListNode = document.createElement('div');
    suggestListNode.classList.add(setting.suggestionList.className);
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
    const matchedItems = SuggestionList.search(this.getData(), keyword);
    this.dropdown.updateStateSuggestItems(matchedItems);
  }
  
}
