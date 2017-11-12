/**
 *  goal: Init input
 *  Put input inside a container
 *  Init a suggestion box that show the inputted value
 */

// TODO: change all class name into BEM
const setting = {
  container: {
    className: "suggestion-container"
  },
  suggestionInput: {
    className: "suggestion-input",
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
    
    this.initUI();
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
    
    this.inputEle = inputEle;
    containerNode.appendChild(this.inputEle);
    
    
    const suggestListNode = document.createElement('div');
    suggestListNode.classList.add(setting.suggestionList.className);
    containerNode.appendChild(suggestListNode);
  }
  
  showSuggestion() {
  }
  
  hideSuggestion() {
  }
  
  updateSuggestionList() {
  
  }
  
  updateHistoryList() {
  
  }
  
  startListener() {
  
  }
  
  stopListener() {
  
  }
  
  doSearch() {
  
  }
  
  getItemByKeyword(keyword) {
  
  }
}
