import { test, expect } from "vitest";
import assert from 'node:assert';
import { ParserUtils } from './parser';
import { DEFAULT_ENCODING } from './encoding';

test('ParserUtils parseField with simple string', () => {
  const field = ParserUtils.parseField('simple value', DEFAULT_ENCODING);

  expect(field.components.length).toBe(1);
  expect(field.components[0].subComponents[0]).toBe('simple value');
});

test('ParserUtils parseField with components', () => {
  const field = ParserUtils.parseField('comp1^comp2^comp3', DEFAULT_ENCODING);

  expect(field.components.length).toBe(3);
  expect(field.components[0].subComponents[0]).toBe('comp1');
  expect(field.components[1].subComponents[0]).toBe('comp2');
  expect(field.components[2].subComponents[0]).toBe('comp3');
});

test('ParserUtils parseField with subcomponents', () => {
  const field = ParserUtils.parseField('sub1&sub2^sub3', DEFAULT_ENCODING);

  expect(field.components.length).toBe(2);
  expect(field.components[0].subComponents.length).toBe(2);
  expect(field.components[0].subComponents[0]).toBe('sub1');
  expect(field.components[0].subComponents[1]).toBe('sub2');
  expect(field.components[1].subComponents[0]).toBe('sub3');
});

test('ParserUtils parseField with empty string', () => {
  const field = ParserUtils.parseField('', DEFAULT_ENCODING);

  expect(field.components.length).toBe(1);
  expect(field.components[0].subComponents[0]).toBe('');
});

test('ParserUtils getFieldString', () => {
  const field = ParserUtils.parseField('comp1^comp2^comp3', DEFAULT_ENCODING);
  const fieldStr = ParserUtils.getFieldString(field, DEFAULT_ENCODING);

  expect(fieldStr).toBe('comp1^comp2^comp3');
});

test('ParserUtils getFieldString with subcomponents', () => {
  const field = ParserUtils.parseField('sub1&sub2^sub3', DEFAULT_ENCODING);
  const fieldStr = ParserUtils.getFieldString(field, DEFAULT_ENCODING);

  expect(fieldStr).toBe('sub1&sub2^sub3');
});

test('ParserUtils getComponent', () => {
  const field = ParserUtils.parseField('comp1^comp2^comp3', DEFAULT_ENCODING);

  expect(ParserUtils.getComponent(field, 0)).toBe('comp1');
  expect(ParserUtils.getComponent(field, 1)).toBe('comp2');
  expect(ParserUtils.getComponent(field, 2)).toBe('comp3');
});

test('ParserUtils getComponent with missing index', () => {
  const field = ParserUtils.parseField('comp1', DEFAULT_ENCODING);

  expect(ParserUtils.getComponent(field, 5)).toBe('');
});

test('ParserUtils getSubComponent', () => {
  const field = ParserUtils.parseField('sub1&sub2&sub3^comp2', DEFAULT_ENCODING);

  expect(ParserUtils.getSubComponent(field, 0, 0)).toBe('sub1');
  expect(ParserUtils.getSubComponent(field, 0, 1)).toBe('sub2');
  expect(ParserUtils.getSubComponent(field, 0, 2)).toBe('sub3');
  expect(ParserUtils.getSubComponent(field, 1, 0)).toBe('comp2');
});

test('ParserUtils getSubComponent with missing indices', () => {
  const field = ParserUtils.parseField('comp1', DEFAULT_ENCODING);

  expect(ParserUtils.getSubComponent(field, 5, 0)).toBe('');
  expect(ParserUtils.getSubComponent(field, 0, 5)).toBe('');
});

test('ParserUtils extractEncodingCharacters from valid MSH', () => {
  const msh = 'MSH|^~\\&|APP|FAC';
  const encoding = ParserUtils.extractEncodingCharacters(msh);

  expect(encoding.fieldSeparator).toBe('|');
  expect(encoding.componentSeparator).toBe('^');
  expect(encoding.repetitionSeparator).toBe('~');
  expect(encoding.escapeCharacter).toBe('\\');
  expect(encoding.subComponentSeparator).toBe('&');
});

test('ParserUtils extractEncodingCharacters throws on invalid segment', () => {
  expect(() => {
    ParserUtils.extractEncodingCharacters('PID|1|12345');
  }).toThrow(/Invalid MSH segment/);
});

test('ParserUtils extractEncodingCharacters with custom encoding', () => {
  const msh = 'MSH|^~#&|APP|FAC';
  const encoding = ParserUtils.extractEncodingCharacters(msh);

  expect(encoding.escapeCharacter).toBe('#');
});
