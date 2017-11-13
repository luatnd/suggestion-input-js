/**
 *
 */
export default class SuggestionInput {
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