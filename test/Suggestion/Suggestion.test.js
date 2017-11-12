import polyfill from '../../src/polyfill/index';
polyfill();

import Suggestion from '../../src/Suggestion/Suggestion';

test('Can init with ID', () => {
  document.body.innerHTML =
    `<div>
      <input type="text" data-sg-id="sg-appstore-ios">
    </div>`
  ;
  
  const id = 'sg-appstore-ios';
  expect(new Suggestion(id).id).toBe(id);
});

test('Can init inputEle', () => {
  document.body.innerHTML =
    `<div>
      <input type="text" data-sg-id="sg-appstore-ios">
    </div>`
  ;
  
  const id = "sg-appstore-ios";
  const sgIntance = new Suggestion(id);
  
  expect(sgIntance.inputEle.getAttribute('data-sg-id')).toBe(id);
});

test('Do not overwrite original class', () => {
  document.body.innerHTML =
    `<div>
      <input type="text" data-sg-id="sg-appstore-ios" class="initialClass1">
    </div>`
  ;
  
  const id = "sg-appstore-ios";
  const sgIntance = new Suggestion(id);
  
  expect(sgIntance.inputEle.classList.contains('initialClass1')).toBe(true);
  expect(sgIntance.inputEle.classList.length).toBe(2);
});



