import { test, expect } from "vitest";
import { MSH } from "./MSH";
import { DEFAULT_ENCODING } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";

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
  expect(msh.name).toBe("MSH");
  expect(msh.fields.length >= 11).toBeTruthy();
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

  expect(encoded.startsWith("MSH|^~\\&|")).toBeTruthy();
  expect(encoded.includes("LAB")).toBeTruthy();
  expect(encoded.includes("Hospital")).toBeTruthy();
  expect(encoded.includes("EMR")).toBeTruthy();
  expect(encoded.includes("Clinic")).toBeTruthy();
  expect(encoded.includes("ORU^R01^ORU_R01")).toBeTruthy();
  expect(encoded.includes("MSG001")).toBeTruthy();
  expect(encoded.includes("2.5.1")).toBeTruthy();
});

test("MSH messageType with two components", () => {
  const msh = new MSH().sendingApplication("APP").messageType("ADT", "A01");
  const encoded = msh.encode();
  expect(encoded.includes("ADT^A01")).toBeTruthy();
});

test("MSH messageType with three components", () => {
  const msh = new MSH()
    .sendingApplication("APP")
    .messageType("ORU", "R01", "ORU_R01");
  const encoded = msh.encode();
  expect(encoded.includes("ORU^R01^ORU_R01")).toBeTruthy();
});

test("MSH builder fluent interface", () => {
  const result = new MSH()
    .sendingApplication("APP")
    .receivingApplication("SYS");

  expect(result).toBeTruthy();
  expect(result.name).toBe("MSH");
  expect(result.fields.length > 0).toBeTruthy();
});

test("MSH encoding characters placement", () => {
  const msh = new MSH().sendingApplication("LAB");
  const encoded = msh.encode();
  const parts = encoded.split("|");

  expect(parts[0]).toBe("MSH");
  expect(parts[1]).toBe("^~\\&");
});

test("MSH security field", () => {
  const msh = new MSH().sendingApplication("APP").security("SECRET");
  const encoded = msh.encode();
  expect(encoded.includes("SECRET")).toBeTruthy();
});

test("MSH sequence number", () => {
  const msh = new MSH().sendingApplication("APP").sequenceNumber("5");
  const encoded = msh.encode();
  expect(encoded.includes("5")).toBeTruthy();
});

test("MSH accepts empty fields", () => {
  const msh = new MSH().sendingApplication("").receivingApplication("APP");
  const encoded = msh.encode();
  const parts = encoded.split("|");

  expect(parts[2]).toBe("");
});

// ---------------------------------------------------------------------------
// MSH.parse
// ---------------------------------------------------------------------------

test("MSH.parse parses valid MSH segment", () => {
  const result = MSH.parse("MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01|MSG001|P|2.5.1");
  expect(result.ok).toBe(true);
  expect(result.val).toBeTruthy();
  expect(result.val!.name).toBe("MSH");
});

test("MSH.parse extracts sending application", () => {
  const result = MSH.parse("MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01|MSG001|P|2.5.1");
  expect(result.val).toBeTruthy();
  expect(ParserUtils.getComponent(result.val!.fields[1], 0)).toBe("LAB");
});

test("MSH.parse extracts message type components", () => {
  const result = MSH.parse("MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01^ORU_R01|MSG001|P|2.5.1");
  expect(result.val).toBeTruthy();
  expect(ParserUtils.getComponent(result.val!.fields[7], 0)).toBe("ORU");
  expect(ParserUtils.getComponent(result.val!.fields[7], 1)).toBe("R01");
  expect(ParserUtils.getComponent(result.val!.fields[7], 2)).toBe("ORU_R01");
});

test("MSH.parse extracts version", () => {
  const result = MSH.parse("MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01|MSG001|P|2.5.1");
  expect(result.val).toBeTruthy();
  expect(ParserUtils.getComponent(result.val!.fields[10], 0)).toBe("2.5.1");
});

test("MSH.parse fails on non-MSH segment", () => {
  const result = MSH.parse("PID|1||12345");
  expect(result.ok).toBe(false);
  expect(result.err!.message.includes("Not a valid MSH segment")).toBeTruthy();
});

test("MSH.parse round-trip consistency", () => {
  const original = "MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01|MSG001|P|2.5.1";
  const parseResult = MSH.parse(original);
  expect(parseResult.val).toBeTruthy();
  expect(parseResult.val!.encode()).toBe(original);
});

test("MSH.parse handles empty fields", () => {
  const result = MSH.parse("MSH|^~\\&|LAB||EMR||20250119120000||ORU^R01|MSG001|P|2.5.1");
  expect(result.val).toBeTruthy();
  expect(ParserUtils.getComponent(result.val!.fields[2], 0)).toBe("");
  expect(ParserUtils.getComponent(result.val!.fields[4], 0)).toBe("");
});

test("MSH.parse extracts all standard fields", () => {
  const result = MSH.parse("MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000|SEC|ORU^R01|MSG001|P|2.5.1|123|PTR|AL|ER|US");
  expect(result.val).toBeTruthy();
  expect(result.val!.fields.length >= 15).toBeTruthy();
  expect(ParserUtils.getComponent(result.val!.fields[6], 0)).toBe("SEC");
  expect(ParserUtils.getComponent(result.val!.fields[15], 0)).toBe("US");
});
