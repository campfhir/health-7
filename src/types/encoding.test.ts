import { test, expect } from "vitest";
import assert from 'node:assert';
import { DEFAULT_ENCODING, EncodingCharacters } from './encoding';

test('DEFAULT_ENCODING has correct values', () => {
  expect(DEFAULT_ENCODING.fieldSeparator).toBe('|');
  expect(DEFAULT_ENCODING.componentSeparator).toBe('^');
  expect(DEFAULT_ENCODING.repetitionSeparator).toBe('~');
  expect(DEFAULT_ENCODING.escapeCharacter).toBe('\\');
  expect(DEFAULT_ENCODING.subComponentSeparator).toBe('&');
});

test('EncodingCharacters interface can be customized', () => {
  const customEncoding: EncodingCharacters = {
    fieldSeparator: '|',
    componentSeparator: '^',
    repetitionSeparator: '~',
    escapeCharacter: '/',
    subComponentSeparator: '&',
  };

  expect(customEncoding.escapeCharacter).toBe('/');
  expect(customEncoding.fieldSeparator).toBe('|');
});
