import { test } from 'node:test';
import assert from 'node:assert';
import { ParserUtils } from './parser';
import { DEFAULT_ENCODING } from './encoding';

test('ParserUtils parseField with simple string', () => {
  const field = ParserUtils.parseField('simple value', DEFAULT_ENCODING);

  assert.strictEqual(field.components.length, 1);
  assert.strictEqual(field.components[0].subComponents[0], 'simple value');
});

test('ParserUtils parseField with components', () => {
  const field = ParserUtils.parseField('comp1^comp2^comp3', DEFAULT_ENCODING);

  assert.strictEqual(field.components.length, 3);
  assert.strictEqual(field.components[0].subComponents[0], 'comp1');
  assert.strictEqual(field.components[1].subComponents[0], 'comp2');
  assert.strictEqual(field.components[2].subComponents[0], 'comp3');
});

test('ParserUtils parseField with subcomponents', () => {
  const field = ParserUtils.parseField('sub1&sub2^sub3', DEFAULT_ENCODING);

  assert.strictEqual(field.components.length, 2);
  assert.strictEqual(field.components[0].subComponents.length, 2);
  assert.strictEqual(field.components[0].subComponents[0], 'sub1');
  assert.strictEqual(field.components[0].subComponents[1], 'sub2');
  assert.strictEqual(field.components[1].subComponents[0], 'sub3');
});

test('ParserUtils parseField with empty string', () => {
  const field = ParserUtils.parseField('', DEFAULT_ENCODING);

  assert.strictEqual(field.components.length, 1);
  assert.strictEqual(field.components[0].subComponents[0], '');
});

test('ParserUtils getFieldString', () => {
  const field = ParserUtils.parseField('comp1^comp2^comp3', DEFAULT_ENCODING);
  const fieldStr = ParserUtils.getFieldString(field, DEFAULT_ENCODING);

  assert.strictEqual(fieldStr, 'comp1^comp2^comp3');
});

test('ParserUtils getFieldString with subcomponents', () => {
  const field = ParserUtils.parseField('sub1&sub2^sub3', DEFAULT_ENCODING);
  const fieldStr = ParserUtils.getFieldString(field, DEFAULT_ENCODING);

  assert.strictEqual(fieldStr, 'sub1&sub2^sub3');
});

test('ParserUtils getComponent', () => {
  const field = ParserUtils.parseField('comp1^comp2^comp3', DEFAULT_ENCODING);

  assert.strictEqual(ParserUtils.getComponent(field, 0), 'comp1');
  assert.strictEqual(ParserUtils.getComponent(field, 1), 'comp2');
  assert.strictEqual(ParserUtils.getComponent(field, 2), 'comp3');
});

test('ParserUtils getComponent with missing index', () => {
  const field = ParserUtils.parseField('comp1', DEFAULT_ENCODING);

  assert.strictEqual(ParserUtils.getComponent(field, 5), '');
});

test('ParserUtils getSubComponent', () => {
  const field = ParserUtils.parseField('sub1&sub2&sub3^comp2', DEFAULT_ENCODING);

  assert.strictEqual(ParserUtils.getSubComponent(field, 0, 0), 'sub1');
  assert.strictEqual(ParserUtils.getSubComponent(field, 0, 1), 'sub2');
  assert.strictEqual(ParserUtils.getSubComponent(field, 0, 2), 'sub3');
  assert.strictEqual(ParserUtils.getSubComponent(field, 1, 0), 'comp2');
});

test('ParserUtils getSubComponent with missing indices', () => {
  const field = ParserUtils.parseField('comp1', DEFAULT_ENCODING);

  assert.strictEqual(ParserUtils.getSubComponent(field, 5, 0), '');
  assert.strictEqual(ParserUtils.getSubComponent(field, 0, 5), '');
});

test('ParserUtils extractEncodingCharacters from valid MSH', () => {
  const msh = 'MSH|^~\\&|APP|FAC';
  const encoding = ParserUtils.extractEncodingCharacters(msh);

  assert.strictEqual(encoding.fieldSeparator, '|');
  assert.strictEqual(encoding.componentSeparator, '^');
  assert.strictEqual(encoding.repetitionSeparator, '~');
  assert.strictEqual(encoding.escapeCharacter, '\\');
  assert.strictEqual(encoding.subComponentSeparator, '&');
});

test('ParserUtils extractEncodingCharacters throws on invalid segment', () => {
  assert.throws(() => {
    ParserUtils.extractEncodingCharacters('PID|1|12345');
  }, /Invalid MSH segment/);
});

test('ParserUtils extractEncodingCharacters with custom encoding', () => {
  const msh = 'MSH|^~#&|APP|FAC';
  const encoding = ParserUtils.extractEncodingCharacters(msh);

  assert.strictEqual(encoding.escapeCharacter, '#');
});
