
export default class SuggestionLogger {
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