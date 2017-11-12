import Suggestion from './Suggestion/Suggestion.js';

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
  module.exports = Suggestion;
else
  window.Suggestion = Suggestion;

console.log('plugin: all done');