import { test } from "node:test";
import assert from "node:assert";
import { MSH } from "./MSH";
import { DEFAULT_ENCODING } from "../../types/encoding";

test("MSH builder creates valid segment", () => {
  const msh = new MSH()
    .sendingApplication("LAB")
    .sendingFacility("Hospital")
    .receivingApplication("EMR")
    .receivingFacility("Clinic")
    .dateTimeOfMessage("20250119120000")
    .messageType("ORU", "R01", "ORU_R01")
    .messageControlId("MSG001")
    .processingId("P")
    .versionId("2.5.1");
  assert.strictEqual(msh.name, "MSH");
  assert.ok(msh.fields.length >= 11);
});

test("MSH encodes correctly with all fields", () => {
  const msh = new MSH()
    .sendingApplication("LAB")
    .sendingFacility("Hospital")
    .receivingApplication("EMR")
    .receivingFacility("Clinic")
    .dateTimeOfMessage("20250119120000")
    .messageType("ORU", "R01", "ORU_R01")
    .messageControlId("MSG001")
    .processingId("P")
    .versionId("2.5.1");
  const encoded = msh.encode();

  assert.ok(encoded.startsWith("MSH|^~\\&|"));
  assert.ok(encoded.includes("LAB"));
  assert.ok(encoded.includes("Hospital"));
  assert.ok(encoded.includes("EMR"));
  assert.ok(encoded.includes("Clinic"));
  assert.ok(encoded.includes("ORU^R01^ORU_R01"));
  assert.ok(encoded.includes("MSG001"));
  assert.ok(encoded.includes("2.5.1"));
});

test("MSH messageType with two components", () => {
  const msh = new MSH().sendingApplication("APP").messageType("ADT", "A01");
  const encoded = msh.encode();
  assert.ok(encoded.includes("ADT^A01"));
});

test("MSH messageType with three components", () => {
  const msh = new MSH()
    .sendingApplication("APP")
    .messageType("ORU", "R01", "ORU_R01");
  const encoded = msh.encode();
  assert.ok(encoded.includes("ORU^R01^ORU_R01"));
});

test("MSH builder fluent interface", () => {
  const result = new MSH()
    .sendingApplication("APP")
    .receivingApplication("SYS");

  assert.ok(result);
  assert.strictEqual(result.name, "MSH");
  assert.ok(result.fields.length > 0);
});

test("MSH encoding characters placement", () => {
  const msh = new MSH().sendingApplication("LAB");
  const encoded = msh.encode();
  const parts = encoded.split("|");

  assert.strictEqual(parts[0], "MSH");
  assert.strictEqual(parts[1], "^~\\&");
});

test("MSH security field", () => {
  const msh = new MSH().sendingApplication("APP").security("SECRET");
  const encoded = msh.encode();
  assert.ok(encoded.includes("SECRET"));
});

test("MSH sequence number", () => {
  const msh = new MSH().sendingApplication("APP").sequenceNumber("5");
  const encoded = msh.encode();
  assert.ok(encoded.includes("5"));
});

test("MSH accepts empty fields", () => {
  const msh = new MSH().sendingApplication("").receivingApplication("APP");
  const encoded = msh.encode();
  const parts = encoded.split("|");

  assert.strictEqual(parts[2], "");
});
