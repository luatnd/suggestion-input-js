import polyfill from '../../src/polyfill/index';
polyfill();

import Suggestion from '../../src/Suggestion/Suggestion';

class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  
  clear() {
    this.store = {};
  }
  
  getItem(key) {
    return this.store[key] || null;
  }
  
  setItem(key, value) {
    this.store[key] = value.toString();
  }
  
  removeItem(key) {
    delete this.store[key];
  }
};

window.localStorage = new LocalStorageMock();


test('Can init with ID', () => {
  document.body.innerHTML =
    `<div>
      <input type="text" data-sg-id="sg-appstore-ios">
    </div>`
  ;
  
  const id = 'sg-appstore-ios';
  expect(new Suggestion(id).id).toBe(id);
});

/**
 * Int will dangerous for comparison, so need string
 */
test('Can Init data, list of app with appId is String', () => {
  document.body.innerHTML =
    `<div>
      <input type="text" data-sg-id="sg-appstore-ios" class="initialClass1">
    </div>`
  ;
  
  const data = [
    {
      id: "1",
      icon: 'http://img.com/icon_url',
      name: 'Google Chrome',
    },
    {
      id: "2",
      icon: 'http://img.com/icon_url',
      name: 'Read Booker',
    },
    {
      id: "3",
      icon: 'http://img.com/icon_url',
      name: 'Boom Game',
    },
  ]
  
  const id = "sg-appstore-ios";
  const sgIntance = new Suggestion(id, data);
  
  expect(sgIntance.getDataItem('1').id).toBe('1');
  expect(sgIntance.getDataItem('1').name).toBe('Google Chrome');
});

test('Can init inputEle', () => {
  document.body.innerHTML =
    `<div>
      <input type="text" data-sg-id="sg-appstore-ios">
    </div>`
  ;
  
  const id = "sg-appstore-ios";
  const sgIntance = new Suggestion(id);
  
  expect(sgIntance.input.getDomEle().getAttribute('data-sg-id')).toBe(id);
});

test('Do not overwrite original class', () => {
  document.body.innerHTML =
    `<div>
      <input type="text" data-sg-id="sg-appstore-ios" class="initialClass1">
    </div>`
  ;
  
  const id = "sg-appstore-ios";
  const sgIntance = new Suggestion(id);
  
  expect(sgIntance.input.getDomEle().classList.contains('initialClass1')).toBe(true);
  expect(sgIntance.input.getDomEle().classList.length).toBe(2);
});



