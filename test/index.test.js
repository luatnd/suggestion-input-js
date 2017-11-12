import Suggestion from '../src/index';

test('Is instance', () => {
  const id = 'the-foo-id';
  expect(new Suggestion(id)).toBeInstanceOf(Suggestion);
});