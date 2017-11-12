
export default class InputSuggestion {
  constructor(id) {
    console.log('Hi Suggestion: ', id);
  }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
  module.exports = InputSuggestion;
else
  window.InputSuggestion = InputSuggestion;

console.log('plugin: all done');