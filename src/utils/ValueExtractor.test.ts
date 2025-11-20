import { test } from 'node:test';
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

  assert.ok(typeof result === 'string');
  assert.ok(result.startsWith('MSH|'));
});

test('ValueExtractor extracts field from segment', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('PID-5', sampleMessage);

  assert.strictEqual(result, 'Doe^John^Q^Jr^Dr');
});

test('ValueExtractor extracts component from field', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('PID-5.1', sampleMessage);

  assert.strictEqual(result, 'Doe');
});

test('ValueExtractor extracts second component', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('PID-5.2', sampleMessage);

  assert.strictEqual(result, 'John');
});

test('ValueExtractor extracts subcomponent', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('PID-3.1.1', sampleMessage);

  assert.strictEqual(result, '12345');
});

test('ValueExtractor handles MSH field indexing correctly', () => {
  const extractor = new ValueExtractor();

  // MSH-3 should be the sending application (field 3 in the spec)
  const result = extractor.get('MSH-3', sampleMessage);
  assert.strictEqual(result, 'LAB');
});

test('ValueExtractor extracts message type from MSH', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('MSH-9.1', sampleMessage);

  assert.strictEqual(result, 'ORU');
});

test('ValueExtractor extracts version from MSH', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('MSH-12', sampleMessage);

  assert.strictEqual(result, '2.5.1');
});

test('ValueExtractor returns array for repeating segments', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('OBX', sampleMessage);

  assert.ok(Array.isArray(result));
  assert.strictEqual(result.length, 2);
});

test('ValueExtractor extracts from first repeating segment', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('OBX-3.2', sampleMessage);

  assert.ok(Array.isArray(result));
  assert.strictEqual(result[0], 'Hemoglobin');
  assert.strictEqual(result[1], 'RBC');
});

test('ValueExtractor extracts observation values', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('OBX-5', sampleMessage);

  assert.ok(Array.isArray(result));
  assert.strictEqual(result[0], '15.5');
  assert.strictEqual(result[1], '5.2');
});

test('ValueExtractor returns null for invalid segment', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('NTE', sampleMessage);

  assert.strictEqual(result, null);
});

test('ValueExtractor returns null for invalid field index', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('PID-999', sampleMessage);

  assert.strictEqual(result, null);
});

test('ValueExtractor returns null for invalid component index', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('PID-5.99', sampleMessage);

  assert.strictEqual(result, null);
});

test('ValueExtractor returns null for invalid path format', () => {
  const extractor = new ValueExtractor();

  assert.strictEqual(extractor.get('', sampleMessage), null);
  assert.strictEqual(extractor.get('PID-', sampleMessage), null);
  assert.strictEqual(extractor.get('PID-abc', sampleMessage), null);
  assert.strictEqual(extractor.get('INVALID', sampleMessage), null);
});

test('ValueExtractor handles zero field index', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('PID-0', sampleMessage);

  assert.strictEqual(result, null);
});

test('ValueExtractor handles negative field index', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('PID--1', sampleMessage);

  assert.strictEqual(result, null);
});

test('ValueExtractor extracts address components', () => {
  const extractor = new ValueExtractor();

  const street = extractor.get('PID-11.1', sampleMessage);
  const apt = extractor.get('PID-11.2', sampleMessage);
  const city = extractor.get('PID-11.3', sampleMessage);
  const state = extractor.get('PID-11.4', sampleMessage);
  const zip = extractor.get('PID-11.5', sampleMessage);

  assert.strictEqual(street, '123 Main St');
  assert.strictEqual(apt, 'Apt 4');
  assert.strictEqual(city, 'Springfield');
  assert.strictEqual(state, 'IL');
  assert.strictEqual(zip, '62701');
});

test('ValueExtractor extracts patient identifier type', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('PID-3.5', sampleMessage);

  assert.strictEqual(result, 'MR');
});

test('ValueExtractor case-insensitive segment names', () => {
  const extractor = new ValueExtractor();

  const result1 = extractor.get('pid-5.1', sampleMessage);
  const result2 = extractor.get('PID-5.1', sampleMessage);

  assert.strictEqual(result1, result2);
  assert.strictEqual(result1, 'Doe');
});

test('extractValue convenience function works', () => {
  const result = extractValue('PID-5.1', sampleMessage);
  assert.strictEqual(result, 'Doe');
});

test('ValueExtractor with custom encoding', () => {
  const customMessage = 'MSH|^~\\&|LAB|Hospital';
  const extractor = ValueExtractor.withEncoding(DEFAULT_ENCODING);

  const result = extractor.get('MSH-3', customMessage);
  assert.strictEqual(result, 'LAB');
});

test('ValueExtractor handles empty components', () => {
  const messageWithEmpty = 'MSH|^~\\&|LAB|Hospital\rPID|1|||12345||Doe^John';
  const extractor = new ValueExtractor();

  const result = extractor.get('PID-2', messageWithEmpty);
  assert.strictEqual(result, '');
});

test('ValueExtractor extracts phone numbers', () => {
  const extractor = new ValueExtractor();

  const home = extractor.get('PID-13', sampleMessage);
  const work = extractor.get('PID-14', sampleMessage);

  assert.strictEqual(home, '555-1234');
  assert.strictEqual(work, '555-5678');
});

test('ValueExtractor extracts date of birth', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('PID-7', sampleMessage);

  assert.strictEqual(result, '19800115');
});

test('ValueExtractor extracts administrative sex', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('PID-8', sampleMessage);

  assert.strictEqual(result, 'M');
});

test('ValueExtractor extracts order number', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('OBR-2', sampleMessage);

  assert.strictEqual(result, 'ORD123');
});

test('ValueExtractor extracts observation identifier', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('OBX-3.1', sampleMessage);

  assert.ok(Array.isArray(result));
  assert.strictEqual(result[0], '718-7');
  assert.strictEqual(result[1], '789-8');
});

test('ValueExtractor handles segment with no matching path', () => {
  const extractor = new ValueExtractor();
  const result = extractor.get('PV1-99', sampleMessage);

  assert.strictEqual(result, null);
});

test('ValueExtractor path parser validates segment names', () => {
  const extractor = new ValueExtractor();

  assert.strictEqual(extractor.get('P-1', sampleMessage), null); // Too short
  assert.strictEqual(extractor.get('ABCD-1', sampleMessage), null); // Too long
  assert.strictEqual(extractor.get('12-1', sampleMessage), null); // Numbers
});
