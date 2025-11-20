import { test } from "node:test";
import assert from "node:assert";
import { MSHParser } from "./MSHParser";
import { ParserUtils } from "../../types/parser";

test("MSHParser parses valid MSH segment", () => {
  const parser = new MSHParser();
  const mshString =
    "MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01|MSG001|P|2.5.1";

  const result = parser.parse(mshString);

  assert.strictEqual(result.success, true);
  assert.ok(result.data);
  assert.strictEqual(result.data.name, "MSH");
});

test("MSHParser extracts sending application", () => {
  const parser = new MSHParser();
  const mshString =
    "MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01|MSG001|P|2.5.1";

  const result = parser.parse(mshString);

  assert.ok(result.data);
  const sendingApp = ParserUtils.getComponent(result.data.fields[1], 0);
  assert.strictEqual(sendingApp, "LAB");
});

test("MSHParser extracts message type components", () => {
  const parser = new MSHParser();
  const mshString =
    "MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01^ORU_R01|MSG001|P|2.5.1";

  const result = parser.parse(mshString);

  assert.ok(result.data);
  const msgType = ParserUtils.getComponent(result.data.fields[7], 0);
  const triggerEvent = ParserUtils.getComponent(result.data.fields[7], 1);
  const msgStructure = ParserUtils.getComponent(result.data.fields[7], 2);

  assert.strictEqual(msgType, "ORU");
  assert.strictEqual(triggerEvent, "R01");
  assert.strictEqual(msgStructure, "ORU_R01");
});

test("MSHParser extracts version", () => {
  const parser = new MSHParser();
  const mshString =
    "MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01|MSG001|P|2.5.1";

  const result = parser.parse(mshString);

  assert.ok(result.data);
  const version = ParserUtils.getComponent(result.data.fields[10], 0);
  assert.strictEqual(version, "2.5.1");
});

test("MSHParser fails on non-MSH segment", () => {
  const parser = new MSHParser();
  const pidString = "PID|1||12345";

  const result = parser.parse(pidString);

  assert.strictEqual(result.success, false);
  assert.ok(result.error);
  assert.ok(result.error.includes("Not a valid MSH segment"));
});

test("MSHParser round-trip consistency", () => {
  const parser = new MSHParser();
  const original =
    "MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01|MSG001|P|2.5.1";

  const parseResult = parser.parse(original);
  assert.ok(parseResult.data);

  const reEncoded = parseResult.data.encode();
  assert.strictEqual(reEncoded, original);
});

test("MSHParser handles empty fields", () => {
  const parser = new MSHParser();
  const mshString =
    "MSH|^~\\&|LAB||EMR||20250119120000||ORU^R01|MSG001|P|2.5.1";

  const result = parser.parse(mshString);

  assert.ok(result.data);
  const sendingFacility = ParserUtils.getComponent(result.data.fields[2], 0);
  const receivingFacility = ParserUtils.getComponent(result.data.fields[4], 0);

  assert.strictEqual(sendingFacility, "");
  assert.strictEqual(receivingFacility, "");
});

test("MSHParser extracts all standard fields", () => {
  const parser = new MSHParser();
  const mshString =
    "MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000|SEC|ORU^R01|MSG001|P|2.5.1|123|PTR|AL|ER|US";

  const result = parser.parse(mshString);

  assert.ok(result.data);
  assert.ok(result.data.fields.length >= 15);

  const security = ParserUtils.getComponent(result.data.fields[6], 0);
  const countryCode = ParserUtils.getComponent(result.data.fields[15], 0);

  assert.strictEqual(security, "SEC");
  assert.strictEqual(countryCode, "US");
});
