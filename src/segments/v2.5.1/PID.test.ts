import { test } from "node:test";
import assert from "node:assert";
import { PID } from "./PID";

test("PID builder creates valid segment", () => {
  const pid = new PID()
    .setId("1")
    .patientIdentifierList("12345", "", "", "MRN", "MR")
    .patientName("Doe", "John")
    .dateTimeOfBirth("19800115")
    .administrativeSex("M");
  assert.strictEqual(pid.name, "PID");
  assert.ok(pid.fields.length > 0);
});

test("PID encodes patient name correctly", () => {
  const pid = new PID().patientName("Smith", "Jane", "Marie", "Jr", "Dr");
  const encoded = pid.encode();
  assert.ok(encoded.includes("Smith^Jane^Marie^Jr^Dr"));
});

test("PID encodes patient name with minimal fields", () => {
  const pid = new PID().patientName("Doe");
  const encoded = pid.encode();
  assert.ok(encoded.includes("Doe"));
});

test("PID encodes patient identifier list", () => {
  const pid = new PID().patientIdentifierList("12345", "1", "M10", "MRN", "MR");
  const encoded = pid.encode();
  assert.ok(encoded.includes("12345^1^M10^MRN^MR"));
});

test("PID encodes address correctly", () => {
  const pid = new PID().patientAddress(
    "123 Main St",
    "Apt 4",
    "Springfield",
    "IL",
    "62701",
    "USA",
  );
  const encoded = pid.encode();
  assert.ok(encoded.includes("123 Main St^Apt 4^Springfield^IL^62701^USA"));
});

test("PID encodes sex and DOB", () => {
  const pid = new PID().dateTimeOfBirth("19800115").administrativeSex("F");
  const encoded = pid.encode();
  assert.ok(encoded.includes("19800115"));
  assert.ok(encoded.includes("F"));
});

test("PID encodes phone numbers", () => {
  const pid = new PID()
    .phoneNumberHome("555-1234")
    .phoneNumberBusiness("555-5678");
  const encoded = pid.encode();
  assert.ok(encoded.includes("555-1234"));
  assert.ok(encoded.includes("555-5678"));
});

test("PID encodes mothers maiden name", () => {
  const pid = new PID().mothersMaidenName("Johnson", "Mary");
  const encoded = pid.encode();
  assert.ok(encoded.includes("Johnson^Mary"));
});

test("PID builder fluent interface", () => {
  const result = new PID()
    .setId("1")
    .patientName("Doe", "John")
    .administrativeSex("M");

  assert.ok(result);
  assert.strictEqual(result.name, "PID");
  assert.ok(result.fields.length >= 0);
});

test("PID with SSN", () => {
  const pid = new PID().ssn("123-45-6789");
  const encoded = pid.encode();
  assert.ok(encoded.includes("123-45-6789"));
});

test("PID with race and religion", () => {
  const pid = new PID().race("2106-3").religion("CHR");
  const encoded = pid.encode();
  assert.ok(encoded.includes("2106-3"));
  assert.ok(encoded.includes("CHR"));
});

test("PID with marital status and language", () => {
  const pid = new PID().maritalStatus("M").primaryLanguage("en");
  const encoded = pid.encode();
  assert.ok(encoded.includes("M"));
  assert.ok(encoded.includes("en"));
});
