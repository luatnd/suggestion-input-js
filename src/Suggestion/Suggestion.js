/**
 *  goal: Init input
 *  Put input inside a container
 *  Init a suggestion box that show the inputted value
 */

// TODO: change all class name into BEM
// TODO: change this to defaultSetting, and allow to pass the setting
const setting = {
  container: {
    className: "suggestion-container"
  },
  suggestionInput: {
    className: "suggestion-input",
    searchDelay: 200, // TOdo: Expose to API
  },
  suggestionList: {
    className: "suggestion-list",
    history:{
      className: "suggestion-list-history"
    }
  },
}
export default class Suggestion {
  constructor(id) {
    this.id = id;
    this.inputEle = document.querySelector(`[data-sg-id="${id}"]`);
    this.containerNode = null;
    this.suggestListNode = null;
    this.eventManager = {
      inputInput: null,
      inputFocus: null,
      inputBlur: null,
    };
    
    this.initUI();
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
  }
  
  startListener() {
    
    this.inputEle.addEventListener("input", this.eventManager.inputInput = this.onInputEleInput.bind(this));
    this.inputEle.addEventListener("focus", this.eventManager.inputFocus = this.onInputEleFocus.bind(this));
    
    // TOdo: Change this to on click outside then hide
    this.inputEle.addEventListener("blur", this.eventManager.inputBlur = this.onInputEleBlur.bind(this));
  }
  
  stopListener() {
    this.inputEle.removeEventListener("input", this.eventManager.inputInput);
    this.inputEle.removeEventListener("focus", this.eventManager.inputFocus);
    
    // TOdo: Change this to on click outside then hide
    this.inputEle.removeEventListener("blur", this.eventManager.inputBlur);
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
    console.log("this: ", this);
    this.showSuggestion();
  }
  onInputEleBlur() {
    this.hideSuggestion();
  }
  
  initDatabase() {
    console.log("TODO:");
  }
  
  showSuggestion() {
    console.log("TODO:");
  }
  
  hideSuggestion() {
    console.log("TODO:");
  }
  
  updateSuggestionList() {
  
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
