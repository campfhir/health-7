import { test } from 'node:test';
import assert from 'node:assert';
import { DEFAULT_ENCODING, EncodingCharacters } from './encoding';

test('DEFAULT_ENCODING has correct values', () => {
  assert.strictEqual(DEFAULT_ENCODING.fieldSeparator, '|');
  assert.strictEqual(DEFAULT_ENCODING.componentSeparator, '^');
  assert.strictEqual(DEFAULT_ENCODING.repetitionSeparator, '~');
  assert.strictEqual(DEFAULT_ENCODING.escapeCharacter, '\\');
  assert.strictEqual(DEFAULT_ENCODING.subComponentSeparator, '&');
});

test('EncodingCharacters interface can be customized', () => {
  const customEncoding: EncodingCharacters = {
    fieldSeparator: '|',
    componentSeparator: '^',
    repetitionSeparator: '~',
    escapeCharacter: '/',
    subComponentSeparator: '&',
  };

  assert.strictEqual(customEncoding.escapeCharacter, '/');
  assert.strictEqual(customEncoding.fieldSeparator, '|');
});
