/**
 *  goal: Init input
 *  Put input inside a container
 *  Init a suggestion box that show the inputted value
 */
export default class Suggestion {
  constructor(id) {
    this.id = id;
    this.inputEle = document.querySelector(`[data-sg-id="${id}"]`);
  }
}
