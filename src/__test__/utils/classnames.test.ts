import { classNames } from 'utils/classnames';

test('keeps object keys with truthy values', () => {
  expect(classNames({
    a: true,
    b: false,
    c: 0,
    d: null,
    e: undefined,
    f: 1,
  })).toBe('a f');
});

test('joins arrays of class names and ignore falsy values', () => {
  expect(classNames('a', 0, null, undefined, true, 1, 'b')).toBe('a 1 b');
});

test('supports heterogenous arguments', () => {
  expect(classNames({a: true}, 'b', 0)).toBe('a b');
});

test('should be trimmed', () => {
  expect(classNames('', 'b', {}, '')).toBe('b');
});

test('returns an empty string for an empty configuration', () => {
  expect(classNames({})).toBe('');
});

test('supports an array of class names', () => {
  expect(classNames(['a', 'b'])).toBe('a b');
});

test('joins array arguments with string arguments', () => {
  expect(classNames(['a', 'b'], 'c')).toBe('a b c');
  expect(classNames('c', ['a', 'b'])).toBe('c a b');
});

test('handles multiple array arguments', () => {
  expect(classNames(['a', 'b'], ['c', 'd'])).toBe('a b c d');
});

test('handles arrays that include falsy and true values', () => {
  expect(classNames(['a', 0, null, undefined, false, true, 'b'])).toBe('a b');
});

test('handles arrays that include arrays', () => {
  expect(classNames(['a', ['b', 'c']])).toBe('a b c');
});

test('handles arrays that include objects', () => {
  expect(classNames(['a', {b: true, c: false}])).toBe('a b');
});

test('handles deep array recursion', () => {
  expect(classNames(['a', ['b', ['c', {d: true}]]])).toBe('a b c d');
});

test('handles arrays that are empty', () => {
  expect(classNames('a', [])).toBe('a');
});

test('handles nested arrays that have empty nested arrays', () => {
  expect(classNames('a', [[]])).toBe('a');
});

test('', () => {
  expect(classNames({
    // falsy:
    null: null,
    emptyString: '',
    noNumber: NaN,
    zero: 0,
    negativeZero: -0,
    false: false,
    undefined: undefined,

    // truthy (literally anything else):
    nonEmptyString: 'foobar',
    whitespace: ' ',
    function: Object.prototype.toString,
    emptyObject: {},
    nonEmptyObject: {a: 1, b: 2},
    emptyList: [],
    nonEmptyList: [1, 2, 3],
    greaterZero: 1,
  })).toBe('nonEmptyString whitespace function emptyObject nonEmptyObject emptyList nonEmptyList greaterZero');
});
