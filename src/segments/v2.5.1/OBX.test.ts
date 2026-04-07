import { test, expect } from "vitest";
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
  expect(obx.name).toBe("OBX");
  expect(obx.fields.length > 0).toBeTruthy();
});

test("OBX encodes observation identifier", () => {
  const obx = new OBX().observationIdentifier("718-7", "Hemoglobin", "LN");
  const encoded = obx.encode();
  expect(encoded.includes("718-7^Hemoglobin^LN")).toBeTruthy();
});

test("OBX encodes numeric value", () => {
  const obx = new OBX().valueType("NM").observationValue("15.5");
  const encoded = obx.encode();
  expect(encoded.includes("NM")).toBeTruthy();
  expect(encoded.includes("15.5")).toBeTruthy();
});

test("OBX encodes units", () => {
  const obx = new OBX().units("g/dL", "grams per deciliter", "UCUM");
  const encoded = obx.encode();
  expect(encoded.includes("g/dL^grams per deciliter^UCUM")).toBeTruthy();
});

test("OBX encodes reference range", () => {
  const obx = new OBX().referenceRange("13.5-17.5");
  const encoded = obx.encode();
  expect(encoded.includes("13.5-17.5")).toBeTruthy();
});

test("OBX encodes result status", () => {
  const obx = new OBX().observationResultStatus("F");
  const encoded = obx.encode();
  expect(encoded.includes("F")).toBeTruthy();
});

test("OBX encodes observation date time", () => {
  const obx = new OBX().dateTimeOfObservation("20250119120000");
  const encoded = obx.encode();
  expect(encoded.includes("20250119120000")).toBeTruthy();
});

test("OBX encodes responsible observer", () => {
  const obx = new OBX().responsibleObserver("1234", "Smith", "John");
  const encoded = obx.encode();
  expect(encoded.includes("1234^Smith^John")).toBeTruthy();
});

test("OBX encodes observation method", () => {
  const obx = new OBX().observationMethod("AUTO", "Automated", "L");
  const encoded = obx.encode();
  expect(encoded.includes("AUTO^Automated^L")).toBeTruthy();
});

test("OBX builder fluent interface", () => {
  const result = new OBX().setId("1").valueType("NM").observationValue("100");

  expect(result).toBeTruthy();
  expect(result.name).toBe("OBX");
  expect(result.fields.length >= 0).toBeTruthy();
});

test("OBX with abnormal flags", () => {
  const obx = new OBX().abnormalFlags("H");
  const encoded = obx.encode();
  expect(encoded.includes("H")).toBeTruthy();
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

  expect(encoded.includes("OBX")).toBeTruthy();
  expect(encoded.includes("NM")).toBeTruthy();
  expect(encoded.includes("789-8^RBC^LN")).toBeTruthy();
  expect(encoded.includes("5.2")).toBeTruthy();
  expect(encoded.includes("4.5-5.9")).toBeTruthy();
  expect(encoded.includes("F")).toBeTruthy();
});
