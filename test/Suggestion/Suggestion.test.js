import Suggestion from '../../src/Suggestion/Suggestion';

test('Can init with ID', () => {
  const id = 'the-foo-id';
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

