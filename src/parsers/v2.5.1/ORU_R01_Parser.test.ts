import { test } from "node:test";
import assert from "node:assert";
import { parseORU_R01, ORU_R01_Parser } from "./ORU_R01_Parser";
import { DEFAULT_ENCODING } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";

const validORUMessage = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01^ORU_R01|MSG001|P|2.5.1
PID|1||12345^^^MRN^MR||Doe^John^Q||19800115|M
PV1|1|I|ICU^101^A^Main||||1234^Smith^Jane
OBR|1|ORD123|LAB456|CBC^Complete Blood Count^LN|||20250119120000
OBX|1|NM|718-7^Hemoglobin^LN|1|15.5|g/dL||||||F|||20250119120000
OBX|2|NM|789-8^RBC^LN|1|5.2|10*6/uL||||||F|||20250119120000`;

test("parseORU_R01 parses valid message", () => {
  const result = parseORU_R01(validORUMessage);

  if (!result.success) {
    console.log("Parse error:", result.error);
  }
  assert.strictEqual(result.success, true);
  assert.ok(result.data);
});

test("parseORU_R01 extracts MSH segment", () => {
  const result = parseORU_R01(validORUMessage);

  assert.ok(result.data);
  assert.strictEqual(result.data.msh.name, "MSH");

  const sendingApp = ParserUtils.getComponent(result.data.msh.fields[1], 0);
  assert.strictEqual(sendingApp, "LAB");
});

test("parseORU_R01 extracts patient results", () => {
  const result = parseORU_R01(validORUMessage);

  assert.ok(result.data);
  assert.strictEqual(result.data.patientResults.length, 1);
});

test("parseORU_R01 extracts PID from patient result", () => {
  const result = parseORU_R01(validORUMessage);

  assert.ok(result.data);
  const patientResult = result.data.patientResults[0];
  assert.ok(patientResult.pid);

  const familyName = ParserUtils.getComponent(patientResult.pid.fields[4], 0);
  assert.strictEqual(familyName, "Doe");
});

test("parseORU_R01 extracts PV1 from patient result", () => {
  const result = parseORU_R01(validORUMessage);

  assert.ok(result.data);
  const patientResult = result.data.patientResults[0];
  assert.ok(patientResult.pv1);

  const patientClass = ParserUtils.getComponent(patientResult.pv1.fields[1], 0);
  assert.strictEqual(patientClass, "I");
});

test("parseORU_R01 extracts order observations", () => {
  const result = parseORU_R01(validORUMessage);

  assert.ok(result.data);
  const patientResult = result.data.patientResults[0];
  assert.strictEqual(patientResult.orderObservations.length, 1);
});

test("parseORU_R01 extracts OBR from order observation", () => {
  const result = parseORU_R01(validORUMessage);

  assert.ok(result.data);
  const orderObs = result.data.patientResults[0].orderObservations[0];
  assert.ok(orderObs.obr);

  const placerOrder = ParserUtils.getComponent(orderObs.obr.fields[1], 0);
  assert.strictEqual(placerOrder, "ORD123");
});

test("parseORU_R01 extracts OBX list", () => {
  const result = parseORU_R01(validORUMessage);

  assert.ok(result.data);
  const orderObs = result.data.patientResults[0].orderObservations[0];
  assert.strictEqual(orderObs.obxList.length, 2);
});

test("parseORU_R01 extracts OBX values correctly", () => {
  const result = parseORU_R01(validORUMessage);

  assert.ok(result.data);
  const obxList = result.data.patientResults[0].orderObservations[0].obxList;

  const value1 = ParserUtils.getComponent(obxList[0].fields[4], 0);
  const value2 = ParserUtils.getComponent(obxList[1].fields[4], 0);

  assert.strictEqual(value1, "15.5");
  assert.strictEqual(value2, "5.2");
});

test("parseORU_R01 fails on empty message", () => {
  const result = parseORU_R01("");

  assert.strictEqual(result.success, false);
  assert.ok(result.error);
  assert.ok(result.error.includes("Empty message"));
});

test("parseORU_R01 fails when not starting with MSH", () => {
  const invalidMessage = "PID|1||12345";
  const result = parseORU_R01(invalidMessage);

  assert.strictEqual(result.success, false);
  assert.ok(result.error);
  assert.ok(result.error.includes("must start with MSH"));
});

test("parseORU_R01 fails on OBX without OBR", () => {
  const invalidMessage = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01|MSG001|P|2.5.1
PID|1||12345||Doe^John||19800115|M
OBX|1|NM|718-7^Hemoglobin^LN|1|15.5|g/dL||||||F`;

  const result = parseORU_R01(invalidMessage);

  assert.strictEqual(result.success, false);
  assert.ok(result.error);
  assert.ok(result.error.includes("without preceding OBR"));
});

test("parseORU_R01 round-trip consistency", () => {
  const result = parseORU_R01(validORUMessage);

  assert.ok(result.data);
  const reEncoded = result.data.message.encode();

  const secondParse = parseORU_R01(reEncoded);
  assert.strictEqual(secondParse.success, true);
});

test("parseORU_R01 handles message without PID", () => {
  const messageWithoutPID = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01|MSG001|P|2.5.1
OBR|1|ORD123|LAB456|CBC^Complete Blood Count^LN
OBX|1|NM|718-7^Hemoglobin^LN|1|15.5|g/dL||||||F`;

  const result = parseORU_R01(messageWithoutPID);

  assert.strictEqual(result.success, true);
  assert.ok(result.data);
  assert.strictEqual(result.data.patientResults[0].pid, undefined);
});

test("parseORU_R01 handles message without PV1", () => {
  const messageWithoutPV1 = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01|MSG001|P|2.5.1
PID|1||12345||Doe^John||19800115|M
OBR|1|ORD123|LAB456|CBC^Complete Blood Count^LN
OBX|1|NM|718-7^Hemoglobin^LN|1|15.5|g/dL||||||F`;

  const result = parseORU_R01(messageWithoutPV1);

  assert.strictEqual(result.success, true);
  assert.ok(result.data);
  assert.strictEqual(result.data.patientResults[0].pv1, undefined);
});

test("parseORU_R01 handles multiple order observations", () => {
  const multipleOrders = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01|MSG001|P|2.5.1
PID|1||12345||Doe^John||19800115|M
OBR|1|ORD123|LAB456|CBC^Complete Blood Count^LN
OBX|1|NM|718-7^Hemoglobin^LN|1|15.5|g/dL||||||F
OBR|2|ORD124|LAB457|CMP^Comprehensive Metabolic Panel^LN
OBX|1|NM|2345-7^Glucose^LN|1|95|mg/dL||||||F`;

  const result = parseORU_R01(multipleOrders);

  assert.ok(result.data);
  assert.strictEqual(result.data.patientResults[0].orderObservations.length, 2);
});

test("parseORU_R01 handles multiple patient results", () => {
  const multiplePatients = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01|MSG001|P|2.5.1
PID|1||12345||Doe^John||19800115|M
OBR|1|ORD123|LAB456|CBC^Complete Blood Count^LN
OBX|1|NM|718-7^Hemoglobin^LN|1|15.5|g/dL||||||F
PID|2||67890||Smith^Jane||19900201|F
OBR|1|ORD124|LAB457|CMP^Comprehensive Metabolic Panel^LN
OBX|1|NM|2345-7^Glucose^LN|1|90|mg/dL||||||F`;

  const result = parseORU_R01(multiplePatients);

  assert.ok(result.data);
  assert.strictEqual(result.data.patientResults.length, 2);
});

test("parseORU_R01 parses NTE (patient notes) segment", () => {
  const messageWithNTE = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01|MSG001|P|2.5.1
PID|1||12345||Doe^John||19800115|M
NTE|1||Patient has difficulty providing samples
OBR|1|ORD123|LAB456|CBC^Complete Blood Count^LN
OBX|1|NM|718-7^Hemoglobin^LN|1|15.5|g/dL||||||F`;

  const result = parseORU_R01(messageWithNTE);

  // Parser should succeed and parse the NTE segment
  if (!result.success) {
    console.log("Parse error:", result.error);
  }
  assert.strictEqual(result.success, true);
  assert.ok(result.data);
  assert.strictEqual(result.data.patientResults.length, 1);

  // Verify NTE was parsed as patient note
  const patientResult = result.data.patientResults[0];
  assert.ok(patientResult.nteList);
  assert.strictEqual(patientResult.nteList.length, 1);
  assert.strictEqual(
    patientResult.nteList[0].getComment(),
    "Patient has difficulty providing samples",
  );
});
