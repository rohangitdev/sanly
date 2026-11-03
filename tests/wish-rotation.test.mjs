import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseNextWish, normalizeWishText, uniqueWishes, validateWishCatalogue } from '../src/sanly-wish-rotation.ts';

const item = (id, text = id) => ({ id, text, language: 'English', occasion: 'Birthday', style: 'Warm' });

test('normalization ignores case and punctuation', () => {
  assert.equal(normalizeWishText('Hello, WORLD!'), normalizeWishText('hello world'));
});

test('empty catalogue is handled safely', () => {
  assert.equal(chooseNextWish([]).wish, null);
  assert.deepEqual(validateWishCatalogue(null), []);
});

test('deduplicates by text and ID', () => {
  assert.deepEqual(uniqueWishes([item('a', 'Hello!'), item('b', 'hello'), item('a', 'Different')]).map(x => x.id), ['a']);
});

test('does not repeat a recently selected wish when alternatives exist', () => {
  const wishes = [item('a'), item('b'), item('c')];
  let history = { ids: [] };
  for (let i = 0; i < 3; i++) {
    const result = chooseNextWish(wishes, history, () => 0);
    assert.ok(result.wish);
    assert.ok(!history.ids.includes(result.wish.id));
    history = result.history;
  }
  assert.deepEqual(history.ids, ['a', 'b', 'c']);
});

test('avoids immediately repeating the last wish when the pool is exhausted', () => {
  const result = chooseNextWish([item('a'), item('b')], { ids: ['a', 'b'] }, () => 0);
  assert.equal(result.wish.id, 'a');
});

test('clamps unusual random values', () => {
  assert.equal(chooseNextWish([item('a'), item('b')], undefined, () => Number.NaN).wish.id, 'a');
  assert.equal(chooseNextWish([item('a'), item('b')], undefined, () => 1).wish.id, 'b');
});

test('rejects malformed remote entries', () => {
  const items = validateWishCatalogue([item('ok'), { id: 3, text: 'bad' }, item('ok', 'duplicate id')]);
  assert.deepEqual(items.map(x => x.id), ['ok']);
});
