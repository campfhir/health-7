import { test, expect } from "vitest";
import assert from 'node:assert';
import { ValueExtractor, extractValue } from './ValueExtractor';
import { DEFAULT_ENCODING } from '../types/encoding';

const sampleMessage = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01^ORU_R01|MSG001|P|2.5.1
PID|1||12345^^^MRN^MR||Doe^John^Q^Jr^Dr||19800115|M|||123 Main St^Apt 4^Springfield^IL^62701^USA||555-1234|555-5678
PV1|1|I|ICU^101^A^Main||||1234^Smith^Jane
OBR|1|ORD123|LAB456|CBC^Complete Blood Count^LN|||20250119120000
OBX|1|NM|718-7^Hemoglobin^LN|1|15.5|g/dL||||||F
OBX|2|NM|789-8^RBC^LN|1|5.2|10*6/uL||||||F`;

test('ValueExtractor extracts entire segment', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('MSH', sampleMessage);

  expect(typeof result === 'string').toBeTruthy();
  expect(typeof result === 'string' && result.startsWith('MSH|')).toBeTruthy();
});

test('ValueExtractor extracts field from segment', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('PID-5', sampleMessage);

  expect(result).toBe('Doe^John^Q^Jr^Dr');
});

test('ValueExtractor extracts component from field', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('PID-5.1', sampleMessage);

  expect(result).toBe('Doe');
});

test('ValueExtractor extracts second component', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('PID-5.2', sampleMessage);

  expect(result).toBe('John');
});

test('ValueExtractor extracts subcomponent', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('PID-3.1.1', sampleMessage);

  expect(result).toBe('12345');
});

test('ValueExtractor handles MSH field indexing correctly', () => {
  const extractor = new ValueExtractor();

  // MSH-3 should be the sending application (field 3 in the spec)
  const result = extractor.get('MSH-3', sampleMessage);
  expect(result).toBe('LAB');
});

test('ValueExtractor extracts message type from MSH', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('MSH-9.1', sampleMessage);

  expect(result).toBe('ORU');
});

test('ValueExtractor extracts version from MSH', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('MSH-12', sampleMessage);

  expect(result).toBe('2.5.1');
});

test('ValueExtractor returns array for repeating segments', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('OBX', sampleMessage);

  expect(Array.isArray(result)).toBeTruthy();
  expect(result!.length).toBe(2);
});

test('ValueExtractor extracts from first repeating segment', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('OBX-3.2', sampleMessage);

  expect(Array.isArray(result)).toBeTruthy();
  expect(result![0]).toBe('Hemoglobin');
  expect(result![1]).toBe('RBC');
});

test('ValueExtractor extracts observation values', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('OBX-5', sampleMessage);

  expect(Array.isArray(result)).toBeTruthy();
  expect(result![0]).toBe('15.5');
  expect(result![1]).toBe('5.2');
});

test('ValueExtractor returns null for invalid segment', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('NTE', sampleMessage);

  expect(result).toBe(null);
});

test('ValueExtractor returns null for invalid field index', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('PID-999', sampleMessage);

  expect(result).toBe(null);
});

test('ValueExtractor returns null for invalid component index', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('PID-5.99', sampleMessage);

  expect(result).toBe(null);
});

test('ValueExtractor returns null for invalid path format', () => {
  const extractor = new ValueExtractor();

  expect(extractor.get('', sampleMessage)).toBe(null);
  expect(extractor.get('PID-', sampleMessage)).toBe(null);
  expect(extractor.get('PID-abc', sampleMessage)).toBe(null);
  expect(extractor.get('INVALID', sampleMessage)).toBe(null);
});

test('ValueExtractor handles zero field index', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('PID-0', sampleMessage);

  expect(result).toBe(null);
});

test('ValueExtractor handles negative field index', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('PID--1', sampleMessage);

  expect(result).toBe(null);
});

test('ValueExtractor extracts address components', () => {
  const extractor = new ValueExtractor();

  const street = extractor.get('PID-11.1', sampleMessage);
  const apt = extractor.get('PID-11.2', sampleMessage);
  const city = extractor.get('PID-11.3', sampleMessage);
  const state = extractor.get('PID-11.4', sampleMessage);
  const zip = extractor.get('PID-11.5', sampleMessage);

  expect(street).toBe('123 Main St');
  expect(apt).toBe('Apt 4');
  expect(city).toBe('Springfield');
  expect(state).toBe('IL');
  expect(zip).toBe('62701');
});

test('ValueExtractor extracts patient identifier type', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('PID-3.5', sampleMessage);

  expect(result).toBe('MR');
});

test('ValueExtractor case-insensitive segment names', () => {
  const extractor = new ValueExtractor();

  const result1 = extractor.get('pid-5.1', sampleMessage);
  const result2 = extractor.get('PID-5.1', sampleMessage);

  expect(result1).toBe(result2);
  expect(result1).toBe('Doe');
});

test('extractValue convenience function works', () => {
  const result = extractValue('PID-5.1', sampleMessage);
  expect(result).toBe('Doe');
});

test('ValueExtractor with custom encoding', () => {
  const customMessage = 'MSH|^~\\&|LAB|Hospital';
  const extractor = ValueExtractor.withEncoding(DEFAULT_ENCODING);

  const result = extractor.get('MSH-3', customMessage);
  expect(result).toBe('LAB');
});

test('ValueExtractor handles empty components', () => {
  const messageWithEmpty = 'MSH|^~\\&|LAB|Hospital\rPID|1|||12345||Doe^John';
  const extractor = new ValueExtractor();

  const result = extractor.get('PID-2', messageWithEmpty);
  expect(result).toBe('');
});

test('ValueExtractor extracts phone numbers', () => {
  const extractor = new ValueExtractor();

  const home = extractor.get('PID-13', sampleMessage);
  const work = extractor.get('PID-14', sampleMessage);

  expect(home).toBe('555-1234');
  expect(work).toBe('555-5678');
});

test('ValueExtractor extracts date of birth', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('PID-7', sampleMessage);

  expect(result).toBe('19800115');
});

test('ValueExtractor extracts administrative sex', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('PID-8', sampleMessage);

  expect(result).toBe('M');
});

test('ValueExtractor extracts order number', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('OBR-2', sampleMessage);

  expect(result).toBe('ORD123');
});

test('ValueExtractor extracts observation identifier', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('OBX-3.1', sampleMessage);

  expect(Array.isArray(result)).toBeTruthy();
  expect(result![0]).toBe('718-7');
  expect(result![1]).toBe('789-8');
});

test('ValueExtractor handles segment with no matching path', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('PV1-99', sampleMessage);

  expect(result).toBe(null);
});

test('ValueExtractor path parser validates segment names', () => {
  const extractor = new ValueExtractor();

  expect(extractor.get('P-1', sampleMessage)).toBe(null); // Too short
  expect(extractor.get('ABCD-1', sampleMessage)).toBe(null); // Too long
  expect(extractor.get('12-1', sampleMessage)).toBe(null); // Numbers
});
