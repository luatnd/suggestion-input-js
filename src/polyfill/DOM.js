/**
 * This file contain all polyfill for the browser DOM
 */
export default function () {
  addReplaceWith();
  closest_Polyfill();
}

function addReplaceWith(){
  /**
   * Element.prototype.replaceWith
   */
  function ReplaceWith(Ele) {
    'use-strict'; // For safari, and IE > 10
    var parent = this.parentNode,
      i = arguments.length,
      firstIsNode = +(parent && typeof Ele === 'object');
    if (!parent) return;
    
    while (i-- > firstIsNode){
      if (parent && typeof arguments[i] !== 'object'){
        arguments[i] = document.createTextNode(arguments[i]);
      } if (!parent && arguments[i].parentNode){
        arguments[i].parentNode.removeChild(arguments[i]);
        continue;
      }
      parent.insertBefore(this.previousSibling, arguments[i]);
    }
    if (firstIsNode) parent.replaceChild(Ele, this);
  }
  
  if (!Element.prototype.replaceWith)
    Element.prototype.replaceWith = ReplaceWith;
  if (!CharacterData.prototype.replaceWith)
    CharacterData.prototype.replaceWith = ReplaceWith;
  if (!DocumentType.prototype.replaceWith)
    DocumentType.prototype.replaceWith = ReplaceWith;
}


function closest_Polyfill() {
  if (!Element.prototype.matches)
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector;
  
  if (!Element.prototype.closest)
    Element.prototype.closest = function(s) {
      var el = this;
      if (!document.documentElement.contains(el)) return null;
      do {
        if (el.matches(s)) return el;
        el = el.parentElement;
      } while (el !== null);
      return null;
    };
}