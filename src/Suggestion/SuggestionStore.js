class MyLocalStorage {
  constructor (key) {
    this.localStoreIndex = key;
    
    if (this.storageAvailable('localStorage')) {
      // Yippee! We can use localStorage awesomeness
    }
    else {
      // Too bad, no localStorage for us
    }
  }
  
  getStore() {
    const store = localStorage.getItem(this.localStoreIndex);
    return store ? JSON.parse(store) : {};
  }
  
  setStore(storeData) {
    localStorage.setItem(this.localStoreIndex, (typeof storeData !== 'undefined')
      ? JSON.stringify(storeData)
      : '{}'
    );
  }
  
  /**
   * LocalStorage
   *    [localStoreIndex] : {
   *      [index]: indexData
   *    }
   *
   * @param index
   * @returns {null}
   */
  getData(index) {
    const data = this.getStore();
  
    return (typeof data[index] !== 'undefined') ? data[index] : null;
  }
  
  /**
   * LocalStorage
   *    [localStoreIndex] : {
   *      [index]: indexData
   *    }
   *
   * @param index
   * @param indexData
   */
  setData(index, indexData) {
    const data = this.getStore();
    data[index] = indexData;
    
    this.setStore(data)
  }
  
  
  storageAvailable(type) {
    try {
      const storage = window[type],
        x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      
      return true;
    }
    catch(e) {
      return e instanceof DOMException && (
          // everything except Firefox
        e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage.length !== 0;
    }
  }
}


export default class SuggestionStore {
  constructor(id, setting) {
    this.store = new MyLocalStorage('Suggestion_' + id);
  }
  
  /**
   * LocalStorage
   *    "mySuggestionPlugin_1" : {
   *      "history": {
   *        itemKey: itemKey, // For fast access
   *      }
   *    }
   *
   */
  getHistoryItemKeys() {
    const historyItems = this.store.getData('history');
  
    return historyItems !== null ? historyItems : {};
  }
  
  getHistoryItem(itemKey) {
    const historyItems = this.getHistoryItemKeys();
  
    return (typeof historyItems[itemKey] !== 'undefined') ? itemKey[itemKey] : null;
  }
  
  isHistoryItemExist(itemKey) {
    const historyItems = this.getHistoryItemKeys();
  
    return (typeof historyItems[itemKey] !== 'undefined');
  }
  
  addHistoryItem (itemKey) {
    const historyItems = this.getHistoryItemKeys();
    historyItems[itemKey] = itemKey;
    
    this.store.setData('history', historyItems);
  }
}