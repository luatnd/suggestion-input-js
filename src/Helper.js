export function getNextKey(storeObject, currentKey) {
  let keys = Object.keys(storeObject);
  
  if (currentKey === null) {
    return keys[0];
  } else {
    let currIndex = keys.indexOf(currentKey);
    if (currIndex < 0) {
      return keys[0];
    } else if (currIndex === keys.length - 1) {
      return keys[keys.length - 1];
    } else {
      return keys[currIndex + 1];
    }
  }
}

export function getPrevKey(storeObject, currentKey) {
  let keys = Object.keys(storeObject);
  
  if (currentKey === null) {
    return keys[0];
  } else {
    let currIndex = keys.indexOf(currentKey);
    return (currIndex > 1) ? keys[currIndex - 1] : keys[0];
  }
}

export function highlightKeywords(str, keywords) {
  function regexEscape(str) {
    return str.replace(/[[{}()*+?^$|\]\.\\]/g, "\\$&")
  }
  
  const words = keywords.trim().split(' ').map(w => regexEscape(w));
  const safeRegEx = words.join('|');
  const containSomeOf = new RegExp(`(${safeRegEx})`, "gi");
  
  return str.replace(containSomeOf, '<span>$1</span>');
}

export function objectEqual(obj1, obj2) {
  let eq = true;
  
  const o1Keys = Object.keys(obj1);
  const o2Keys = Object.keys(obj2);
  
  if (o1Keys.length !== o2Keys.length) {
    eq = false;
  } else {
    for (let key of o1Keys) {
      if (typeof obj2[key] === 'undefined') {
        eq = false;
        break;
      }
    }
  }
  
  return eq;
}