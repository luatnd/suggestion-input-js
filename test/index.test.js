import polyfill from '../src/polyfill/index';
polyfill();

import Suggestion from '../src/index';

test('Is instance', () => {
  document.body.innerHTML =
    `<div>
      <input type="text" data-sg-id="sg-appstore-ios">
    </div>`
  ;
  
  const id = 'sg-appstore-ios';
  expect(new Suggestion(id)).toBeInstanceOf(Suggestion);
});