import { test, expect } from "vitest";
import assert from "node:assert";
import { parseORU_R01 } from "./ORU_R01_Parser";
import { createORU_R01 } from "../../builders/v2.5.1/ORU_R01";
import { OBX } from "../../segments/v2.5.1/OBX";
import { OBR } from "../../segments/v2.5.1/OBR";
import { ORC } from "../../segments/v2.5.1/ORC";

/**
 * Tests for parsing, modifying, and re-encoding ORU_R01 messages
 * Validates the developer experience for message manipulation
 */

const sampleMessage = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20231115140500||ORU^R01|MSG001|P|2.5|||AL||
PID|1||123456789^^^MRN||DOE^JOHN^A||19750225|M
ORC|RE|ORD123|LAB456|||||||||123^SMITH^JANE^A^MD^^MD|
OBR|1|ORD123|LAB456|CBC^Complete Blood Count^L|||20231115120000
OBX|1|NM|6690-2^WBC^LN|1|7.5|10*3/uL|4.0-11.0|N|||F
OBX|2|NM|789-8^RBC^LN|1|4.8|10*6/uL|4.5-5.9|N|||F
ORC|RE|ORD456|LAB789|||||||||456^JONES^BOB^B^MD^^MD|
OBR|2|ORD456|LAB789|GLU^Glucose^L|||20231115130000
OBX|1|NM|2345-7^Glucose^LN|1|95|mg/dL|70-100|N|||F`;

test("Parse and modify - Add OBX to beginning of order", () => {
  const parseResult = parseORU_R01(sampleMessage);
  expect(parseResult.ok).toBe(true);
  expect(parseResult.val).toBeTruthy();

  const patientResult = parseResult.val!.patientResults[0];
  const originalObxCount = patientResult.orderObservations[0].obxList.length;

  // Add OBX to beginning
  const newObx = new OBX()
    .setId("1")
    .valueType("NM")
    .observationIdentifier("718-7", "Hemoglobin", "LN")
    .observationSubId("1")
    .observationValue("14.5")
    .units("g/dL")
    .referenceRange("13.5-17.5")
    .abnormalFlags("N")
    .observationResultStatus("F");

  patientResult.orderObservations[0].obxList.unshift(newObx);

  // Verify modification
  expect(patientResult.orderObservations[0].obxList.length, ).toBe(originalObxCount + 1);

  // Re-encode and verify
  const rebuilt = createORU_R01(parseResult.val!.msh, [patientResult]);
  const reencoded = rebuilt.encode();

  const reParseResult = parseORU_R01(reencoded);
  expect(reParseResult.ok).toBe(true);
  expect(reParseResult.val).toBeTruthy();
  expect(reParseResult.val!.patientResults[0].orderObservations[0].obxList.length, ).toBe(originalObxCount + 1);
});

test("Parse and modify - Add OBX to middle of order", () => {
  const parseResult = parseORU_R01(sampleMessage);
  expect(parseResult.ok).toBe(true);
  expect(parseResult.val).toBeTruthy();

  const patientResult = parseResult.val!.patientResults[0];
  const originalObxCount = patientResult.orderObservations[0].obxList.length;

  // Add OBX to middle (after first item)
  const newObx = new OBX()
    .setId("2")
    .valueType("NM")
    .observationIdentifier("4544-3", "Hematocrit", "LN")
    .observationSubId("1")
    .observationValue("43.2")
    .units("%")
    .referenceRange("38.8-50.0")
    .abnormalFlags("N")
    .observationResultStatus("F");

  patientResult.orderObservations[0].obxList.splice(1, 0, newObx);

  // Verify modification
  expect(patientResult.orderObservations[0].obxList.length, ).toBe(originalObxCount + 1);

  // Re-encode and verify
  const rebuilt = createORU_R01(parseResult.val!.msh, [patientResult]);
  const reencoded = rebuilt.encode();

  const reParseResult = parseORU_R01(reencoded);
  expect(reParseResult.ok).toBe(true);
  expect(reParseResult.val).toBeTruthy();
  expect(reParseResult.val!.patientResults[0].orderObservations[0].obxList.length, ).toBe(originalObxCount + 1);
});

test("Parse and modify - Add OBX to end of order", () => {
  const parseResult = parseORU_R01(sampleMessage);
  expect(parseResult.ok).toBe(true);
  expect(parseResult.val).toBeTruthy();

  const patientResult = parseResult.val!.patientResults[0];
  const originalObxCount = patientResult.orderObservations[0].obxList.length;

  // Add OBX to end
  const newObx = new OBX()
    .setId("3")
    .valueType("NM")
    .observationIdentifier("777-3", "Platelets", "LN")
    .observationSubId("1")
    .observationValue("250")
    .units("10*3/uL")
    .referenceRange("150-400")
    .abnormalFlags("N")
    .observationResultStatus("F");

  patientResult.orderObservations[0].obxList.push(newObx);

  // Verify modification
  expect(patientResult.orderObservations[0].obxList.length, ).toBe(originalObxCount + 1);

  // Re-encode and verify
  const rebuilt = createORU_R01(parseResult.val!.msh, [patientResult]);
  const reencoded = rebuilt.encode();

  const reParseResult = parseORU_R01(reencoded);
  expect(reParseResult.ok).toBe(true);
  expect(reParseResult.val).toBeTruthy();
  expect(reParseResult.val!.patientResults[0].orderObservations[0].obxList.length, ).toBe(originalObxCount + 1);
});

test("Parse and modify - Add OBR to beginning", () => {
  const parseResult = parseORU_R01(sampleMessage);
  expect(parseResult.ok).toBe(true);
  expect(parseResult.val).toBeTruthy();

  const patientResult = parseResult.val!.patientResults[0];
  const originalOrderCount = patientResult.orderObservations.length;

  // Add new OBR/OBX to beginning
  const newObr = new OBR()
    .setId("1")
    .placerOrderNumber("ORD001")
    .fillerOrderNumber("LAB001")
    .universalServiceIdentifier("NA", "Sodium", "L")
    .observationDateTime("20231115110000")
    .resultStatus("F");

  const newObx = new OBX()
    .setId("1")
    .valueType("NM")
    .observationIdentifier("2951-2", "Sodium", "LN")
    .observationSubId("1")
    .observationValue("140")
    .units("mmol/L")
    .referenceRange("136-145")
    .abnormalFlags("N")
    .observationResultStatus("F");

  patientResult.orderObservations.unshift({
    obr: newObr,
    obxList: [newObx],
  });

  // Verify modification
  expect(patientResult.orderObservations.length, ).toBe(originalOrderCount + 1);

  // Re-encode and verify
  const rebuilt = createORU_R01(parseResult.val!.msh, [patientResult]);
  const reencoded = rebuilt.encode();

  const reParseResult = parseORU_R01(reencoded);
  expect(reParseResult.ok).toBe(true);
  expect(reParseResult.val).toBeTruthy();
  expect(reParseResult.val!.patientResults[0].orderObservations.length, ).toBe(originalOrderCount + 1);
});

test("Parse and modify - Add OBR to middle", () => {
  const parseResult = parseORU_R01(sampleMessage);
  expect(parseResult.ok).toBe(true);
  expect(parseResult.val).toBeTruthy();

  const patientResult = parseResult.val!.patientResults[0];
  const originalOrderCount = patientResult.orderObservations.length;

  // Add new OBR/OBX to middle (between CBC and Glucose)
  const newObr = new OBR()
    .setId("2")
    .placerOrderNumber("ORD002")
    .fillerOrderNumber("LAB002")
    .universalServiceIdentifier("K", "Potassium", "L")
    .observationDateTime("20231115115000")
    .resultStatus("F");

  const newObx = new OBX()
    .setId("1")
    .valueType("NM")
    .observationIdentifier("2823-3", "Potassium", "LN")
    .observationSubId("1")
    .observationValue("4.2")
    .units("mmol/L")
    .referenceRange("3.5-5.1")
    .abnormalFlags("N")
    .observationResultStatus("F");

  patientResult.orderObservations.splice(1, 0, {
    obr: newObr,
    obxList: [newObx],
  });

  // Verify modification
  expect(patientResult.orderObservations.length, ).toBe(originalOrderCount + 1);

  // Re-encode and verify
  const rebuilt = createORU_R01(parseResult.val!.msh, [patientResult]);
  const reencoded = rebuilt.encode();

  const reParseResult = parseORU_R01(reencoded);
  expect(reParseResult.ok).toBe(true);
  expect(reParseResult.val).toBeTruthy();
  expect(reParseResult.val!.patientResults[0].orderObservations.length, ).toBe(originalOrderCount + 1);
});

test("Parse and modify - Add OBR to end", () => {
  const parseResult = parseORU_R01(sampleMessage);
  expect(parseResult.ok).toBe(true);
  expect(parseResult.val).toBeTruthy();

  const patientResult = parseResult.val!.patientResults[0];
  const originalOrderCount = patientResult.orderObservations.length;

  // Add new OBR/OBX to end
  const newObr = new OBR()
    .setId("3")
    .placerOrderNumber("ORD999")
    .fillerOrderNumber("LAB999")
    .universalServiceIdentifier("CREAT", "Creatinine", "L")
    .observationDateTime("20231115150000")
    .resultStatus("F");

  const newObx = new OBX()
    .setId("1")
    .valueType("NM")
    .observationIdentifier("2160-0", "Creatinine", "LN")
    .observationSubId("1")
    .observationValue("1.1")
    .units("mg/dL")
    .referenceRange("0.7-1.3")
    .abnormalFlags("N")
    .observationResultStatus("F");

  patientResult.orderObservations.push({
    obr: newObr,
    obxList: [newObx],
  });

  // Verify modification
  expect(patientResult.orderObservations.length, ).toBe(originalOrderCount + 1);

  // Re-encode and verify
  const rebuilt = createORU_R01(parseResult.val!.msh, [patientResult]);
  const reencoded = rebuilt.encode();

  const reParseResult = parseORU_R01(reencoded);
  expect(reParseResult.ok).toBe(true);
  expect(reParseResult.val).toBeTruthy();
  expect(reParseResult.val!.patientResults[0].orderObservations.length, ).toBe(originalOrderCount + 1);
});

test("Parse and modify - Add OBR with ORC", () => {
  const parseResult = parseORU_R01(sampleMessage);
  expect(parseResult.ok).toBe(true);
  expect(parseResult.val).toBeTruthy();

  const patientResult = parseResult.val!.patientResults[0];

  // Add new ORC/OBR/OBX
  const newOrc = new ORC()
    .orderControl("NW")
    .placerOrderNumber("NEW001")
    .fillerOrderNumber("LABNEW")
    .orderingProvider("999", "TEST", "DOCTOR");

  const newObr = new OBR()
    .setId("4")
    .placerOrderNumber("NEW001")
    .fillerOrderNumber("LABNEW")
    .universalServiceIdentifier("ALT", "ALT", "L")
    .observationDateTime("20231115160000")
    .resultStatus("F");

  const newObx = new OBX()
    .setId("1")
    .valueType("NM")
    .observationIdentifier("1742-6", "ALT", "LN")
    .observationSubId("1")
    .observationValue("35")
    .units("U/L")
    .referenceRange("7-56")
    .abnormalFlags("N")
    .observationResultStatus("F");

  patientResult.orderObservations.push({
    orc: newOrc,
    obr: newObr,
    obxList: [newObx],
  });

  // Re-encode and verify ORC is preserved
  const rebuilt = createORU_R01(parseResult.val!.msh, [patientResult]);
  const reencoded = rebuilt.encode();

  const reParseResult = parseORU_R01(reencoded);
  expect(reParseResult.ok).toBe(true);
  expect(reParseResult.val).toBeTruthy();

  const lastOrder =
    reParseResult.val!.patientResults[0].orderObservations[
      reParseResult.val!.patientResults[0].orderObservations.length - 1
    ];
  expect(lastOrder.orc, "ORC should be preserved").toBeTruthy();
});

test("Parse and modify - Multiple operations", () => {
  const parseResult = parseORU_R01(sampleMessage);
  expect(parseResult.ok).toBe(true);
  expect(parseResult.val).toBeTruthy();

  const patientResult = parseResult.val!.patientResults[0];

  // Track original counts
  const originalOrderCount = patientResult.orderObservations.length;
  const originalCbcObxCount = patientResult.orderObservations[0].obxList.length;

  // 1. Add OBX to existing CBC order
  const hgbObx = new OBX()
    .setId("3")
    .valueType("NM")
    .observationIdentifier("718-7", "Hemoglobin", "LN")
    .observationSubId("1")
    .observationValue("14.5")
    .units("g/dL")
    .referenceRange("13.5-17.5")
    .abnormalFlags("N")
    .observationResultStatus("F");

  patientResult.orderObservations[0].obxList.push(hgbObx);

  // 2. Add new order at beginning
  const naObr = new OBR()
    .setId("1")
    .placerOrderNumber("NA001")
    .fillerOrderNumber("LABNA")
    .universalServiceIdentifier("NA", "Sodium", "L")
    .observationDateTime("20231115105000")
    .resultStatus("F");

  const naObx = new OBX()
    .setId("1")
    .valueType("NM")
    .observationIdentifier("2951-2", "Sodium", "LN")
    .observationSubId("1")
    .observationValue("138")
    .units("mmol/L")
    .referenceRange("136-145")
    .abnormalFlags("N")
    .observationResultStatus("F");

  patientResult.orderObservations.unshift({
    obr: naObr,
    obxList: [naObx],
  });

  // 3. Add new order at end
  const kObr = new OBR()
    .setId("4")
    .placerOrderNumber("K001")
    .fillerOrderNumber("LABK")
    .universalServiceIdentifier("K", "Potassium", "L")
    .observationDateTime("20231115155000")
    .resultStatus("F");

  const kObx = new OBX()
    .setId("1")
    .valueType("NM")
    .observationIdentifier("2823-3", "Potassium", "LN")
    .observationSubId("1")
    .observationValue("4.0")
    .units("mmol/L")
    .referenceRange("3.5-5.1")
    .abnormalFlags("N")
    .observationResultStatus("F");

  patientResult.orderObservations.push({
    obr: kObr,
    obxList: [kObx],
  });

  // Verify all modifications
  expect(patientResult.orderObservations.length, "Should have 2 more orders").toBe(originalOrderCount + 2);
  expect(patientResult.orderObservations[1].obxList.length, "CBC should have 1 more OBX").toBe(originalCbcObxCount + 1);

  // Re-encode and verify
  const rebuilt = createORU_R01(parseResult.val!.msh, [patientResult]);
  const reencoded = rebuilt.encode();

  const reParseResult = parseORU_R01(reencoded);
  expect(reParseResult.ok).toBe(true);
  expect(reParseResult.val).toBeTruthy();
  expect(reParseResult.val!.patientResults[0].orderObservations.length, ).toBe(originalOrderCount + 2);
  expect(reParseResult.val!.patientResults[0].orderObservations[1].obxList.length, ).toBe(originalCbcObxCount + 1);
});

test("Parse and modify - Preserve all ORCs in round-trip", () => {
  const parseResult = parseORU_R01(sampleMessage);
  expect(parseResult.ok).toBe(true);
  expect(parseResult.val).toBeTruthy();

  // Verify original ORCs are present
  expect(parseResult.val!.patientResults[0].orderObservations[0].orc).toBeTruthy();
  expect(parseResult.val!.patientResults[0].orderObservations[1].orc).toBeTruthy();

  // Re-encode
  const rebuilt = createORU_R01(
    parseResult.val!.msh,
    parseResult.val!.patientResults,
  );
  const reencoded = rebuilt.encode();

  // Re-parse and verify ORCs preserved
  const reParseResult = parseORU_R01(reencoded);
  expect(reParseResult.ok).toBe(true);
  expect(reParseResult.val).toBeTruthy();
  expect(reParseResult.val!.patientResults[0].orderObservations[0].orc, "First ORC should be preserved").toBeTruthy();
  expect(reParseResult.val!.patientResults[0].orderObservations[1].orc, "Second ORC should be preserved").toBeTruthy();
});
