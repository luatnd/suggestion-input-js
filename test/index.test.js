import InputSuggestion from '../src/index';

test('Can init with ID', () => {
  const id = 'the-foo-id';
  expect(new InputSuggestion(id).id).toBe(id);
});