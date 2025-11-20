import { test } from "node:test";
import assert from "node:assert";
import { PIDParser } from "./PIDParser";
import { ParserUtils } from "../../types/parser";

test("PIDParser parses valid PID segment", () => {
  const parser = new PIDParser();
  const pidString = "PID|1||12345^^^MRN^MR||Doe^John^Q||19800115|M";

  const result = parser.parse(pidString);

  assert.strictEqual(result.success, true);
  assert.ok(result.data);
  assert.strictEqual(result.data.name, "PID");
});

test("PIDParser extracts patient name", () => {
  const parser = new PIDParser();
  const pidString = "PID|1||12345||Smith^Jane^Marie^Jr^Dr||19900101|F";

  const result = parser.parse(pidString);

  assert.ok(result.data);
  const familyName = ParserUtils.getComponent(result.data.fields[4], 0);
  const givenName = ParserUtils.getComponent(result.data.fields[4], 1);
  const middleName = ParserUtils.getComponent(result.data.fields[4], 2);
  const suffix = ParserUtils.getComponent(result.data.fields[4], 3);
  const prefix = ParserUtils.getComponent(result.data.fields[4], 4);

  assert.strictEqual(familyName, "Smith");
  assert.strictEqual(givenName, "Jane");
  assert.strictEqual(middleName, "Marie");
  assert.strictEqual(suffix, "Jr");
  assert.strictEqual(prefix, "Dr");
});

test("PIDParser extracts patient identifier", () => {
  const parser = new PIDParser();
  const pidString = "PID|1||12345^1^M10^MRN^MR||Doe^John||19800115|M";

  const result = parser.parse(pidString);

  assert.ok(result.data);
  const id = ParserUtils.getComponent(result.data.fields[2], 0);
  const checkDigit = ParserUtils.getComponent(result.data.fields[2], 1);
  const idType = ParserUtils.getComponent(result.data.fields[2], 4);

  assert.strictEqual(id, "12345");
  assert.strictEqual(checkDigit, "1");
  assert.strictEqual(idType, "MR");
});

test("PIDParser extracts date of birth and sex", () => {
  const parser = new PIDParser();
  const pidString = "PID|1||12345||Doe^John||19800115|M";

  const result = parser.parse(pidString);

  assert.ok(result.data);
  const dob = ParserUtils.getComponent(result.data.fields[6], 0);
  const sex = ParserUtils.getComponent(result.data.fields[7], 0);

  assert.strictEqual(dob, "19800115");
  assert.strictEqual(sex, "M");
});

test("PIDParser extracts address", () => {
  const parser = new PIDParser();
  const pidString =
    "PID|1||12345||Doe^John||19800115|M|||123 Main St^Apt 4^Springfield^IL^62701^USA";

  const result = parser.parse(pidString);

  assert.ok(result.data);
  const street = ParserUtils.getComponent(result.data.fields[10], 0);
  const other = ParserUtils.getComponent(result.data.fields[10], 1);
  const city = ParserUtils.getComponent(result.data.fields[10], 2);
  const state = ParserUtils.getComponent(result.data.fields[10], 3);
  const zip = ParserUtils.getComponent(result.data.fields[10], 4);
  const country = ParserUtils.getComponent(result.data.fields[10], 5);

  assert.strictEqual(street, "123 Main St");
  assert.strictEqual(other, "Apt 4");
  assert.strictEqual(city, "Springfield");
  assert.strictEqual(state, "IL");
  assert.strictEqual(zip, "62701");
  assert.strictEqual(country, "USA");
});

test("PIDParser fails on non-PID segment", () => {
  const parser = new PIDParser();
  const mshString = "MSH|^~\\&|LAB";

  const result = parser.parse(mshString);

  assert.strictEqual(result.success, false);
  assert.ok(result.error);
  assert.ok(result.error.includes("Not a valid PID segment"));
});

test("PIDParser round-trip consistency", () => {
  const parser = new PIDParser();
  const original =
    "PID|1||12345^^^MRN^MR||Doe^John^Q||19800115|M|||123 Main St^^Springfield^IL^62701^USA||555-1234";

  const parseResult = parser.parse(original);
  assert.ok(parseResult.data);

  const reEncoded = parseResult.data.encode();
  assert.strictEqual(reEncoded, original);
});

test("PIDParser handles empty fields", () => {
  const parser = new PIDParser();
  const pidString = "PID|1||||Doe^John||19800115|M";

  const result = parser.parse(pidString);

  assert.ok(result.data);
  const patientId = ParserUtils.getComponent(result.data.fields[1], 0);
  const altId = ParserUtils.getComponent(result.data.fields[3], 0);

  assert.strictEqual(patientId, "");
  assert.strictEqual(altId, "");
});

test("PIDParser extracts phone numbers", () => {
  const parser = new PIDParser();
  const pidString =
    "PID|1||12345||Doe^John||19800115|M|||||||555-1234|555-5678";

  const result = parser.parse(pidString);

  assert.ok(result.data);
  // PID-13 is home phone (fields[13] in 1-based HL7 indexing = fields[12] in 0-based array)
  // But the parser uses 1-based indexing after the segment name, so:
  // PID-13 (home phone) = fields[13] and PID-14 (business phone) = fields[14]
  // However, from the segment string we see phone numbers are at position 14 and 15 after splitting
  const homePhone = ParserUtils.getComponent(result.data.fields[14], 0);
  const workPhone = ParserUtils.getComponent(result.data.fields[15], 0);

  assert.strictEqual(homePhone, "555-1234");
  assert.strictEqual(workPhone, "555-5678");
});
