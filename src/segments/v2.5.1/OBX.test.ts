import { test } from "node:test";
import assert from "node:assert";
import { OBX } from "./OBX";

test("OBX builder creates valid segment", () => {
  const obx = new OBX()
    .setId("1")
    .valueType("NM")
    .observationIdentifier("718-7", "Hemoglobin", "LN")
    .observationValue("15.5")
    .units("g/dL", "grams per deciliter", "UCUM")
    .observationResultStatus("F");
  assert.strictEqual(obx.name, "OBX");
  assert.ok(obx.fields.length > 0);
});

test("OBX encodes observation identifier", () => {
  const obx = new OBX().observationIdentifier("718-7", "Hemoglobin", "LN");
  const encoded = obx.encode();
  assert.ok(encoded.includes("718-7^Hemoglobin^LN"));
});

test("OBX encodes numeric value", () => {
  const obx = new OBX().valueType("NM").observationValue("15.5");
  const encoded = obx.encode();
  assert.ok(encoded.includes("NM"));
  assert.ok(encoded.includes("15.5"));
});

test("OBX encodes units", () => {
  const obx = new OBX().units("g/dL", "grams per deciliter", "UCUM");
  const encoded = obx.encode();
  assert.ok(encoded.includes("g/dL^grams per deciliter^UCUM"));
});

test("OBX encodes reference range", () => {
  const obx = new OBX().referenceRange("13.5-17.5");
  const encoded = obx.encode();
  assert.ok(encoded.includes("13.5-17.5"));
});

test("OBX encodes result status", () => {
  const obx = new OBX().observationResultStatus("F");
  const encoded = obx.encode();
  assert.ok(encoded.includes("F"));
});

test("OBX encodes observation date time", () => {
  const obx = new OBX().dateTimeOfObservation("20250119120000");
  const encoded = obx.encode();
  assert.ok(encoded.includes("20250119120000"));
});

test("OBX encodes responsible observer", () => {
  const obx = new OBX().responsibleObserver("1234", "Smith", "John");
  const encoded = obx.encode();
  assert.ok(encoded.includes("1234^Smith^John"));
});

test("OBX encodes observation method", () => {
  const obx = new OBX().observationMethod("AUTO", "Automated", "L");
  const encoded = obx.encode();
  assert.ok(encoded.includes("AUTO^Automated^L"));
});

test("OBX builder fluent interface", () => {
  const result = new OBX().setId("1").valueType("NM").observationValue("100");

  assert.ok(result);
  assert.strictEqual(result.name, "OBX");
  assert.ok(result.fields.length >= 0);
});

test("OBX with abnormal flags", () => {
  const obx = new OBX().abnormalFlags("H");
  const encoded = obx.encode();
  assert.ok(encoded.includes("H"));
});

test("OBX with complete observation", () => {
  const obx = new OBX()
    .setId("1")
    .valueType("NM")
    .observationIdentifier("789-8", "RBC", "LN")
    .observationSubId("1")
    .observationValue("5.2")
    .units("10*6/uL", "million per microliter", "UCUM")
    .referenceRange("4.5-5.9")
    .abnormalFlags("N")
    .observationResultStatus("F")
    .dateTimeOfObservation("20250119120000");
  const encoded = obx.encode();

  assert.ok(encoded.includes("OBX"));
  assert.ok(encoded.includes("NM"));
  assert.ok(encoded.includes("789-8^RBC^LN"));
  assert.ok(encoded.includes("5.2"));
  assert.ok(encoded.includes("4.5-5.9"));
  assert.ok(encoded.includes("F"));
});
