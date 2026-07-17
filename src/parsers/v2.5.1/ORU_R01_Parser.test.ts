import { describe, test, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parseORU_R01 } from "./ORU_R01_Parser.ts";
import { createORU_R01 } from "../../builders/v2.5.1/ORU_R01.ts";
import { OBX } from "../../segments/v2.5.1/OBX.ts";
import { OBR } from "../../segments/v2.5.1/OBR.ts";
import { ParserUtils } from "../../types/parser.ts";

const validORUMessage = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01^ORU_R01|MSG001|P|2.5.1
PID|1||12345^^^MRN^MR||Doe^John^Q||19800115|M
PV1|1|I|ICU^101^A^Main||||1234^Smith^Jane
OBR|1|ORD123|LAB456|CBC^Complete Blood Count^LN|||20250119120000
OBX|1|NM|718-7^Hemoglobin^LN|1|15.5|g/dL||||||F|||20250119120000
OBX|2|NM|789-8^RBC^LN|1|5.2|10*6/uL||||||F|||20250119120000`;

test("parseORU_R01 parses valid message", () => {
  const result = parseORU_R01(validORUMessage);

  if (!result.ok) {
    console.log("Parse error:", result.err.message);
  }
  expect(result.ok).toBe(true);
  expect(result.val).toBeTruthy();
});

test("parseORU_R01 extracts MSH segment", () => {
  const result = parseORU_R01(validORUMessage);

  expect(result.val).toBeTruthy();
  expect(result.val!.msh.name).toBe("MSH");

  const sendingApp = ParserUtils.getComponent(result.val!.msh.fields[1], 0);
  expect(sendingApp).toBe("LAB");
});

test("parseORU_R01 extracts patient results", () => {
  const result = parseORU_R01(validORUMessage);

  expect(result.val).toBeTruthy();
  expect(result.val!.patientResults.length).toBe(1);
});

test("parseORU_R01 extracts PID from patient result", () => {
  const result = parseORU_R01(validORUMessage);

  expect(result.val).toBeTruthy();
  const patientResult = result.val!.patientResults[0];
  expect(patientResult.pid).toBeTruthy();

  const familyName = ParserUtils.getComponent(patientResult.pid!.fields[4], 0);
  expect(familyName).toBe("Doe");
});

test("parseORU_R01 extracts PV1 from patient result", () => {
  const result = parseORU_R01(validORUMessage);

  expect(result.val).toBeTruthy();
  const patientResult = result.val!.patientResults[0];
  expect(patientResult.pv1).toBeTruthy();

  const patientClass = ParserUtils.getComponent(
    patientResult.pv1!.fields[1],
    0,
  );
  expect(patientClass).toBe("I");
});

test("parseORU_R01 extracts order observations", () => {
  const result = parseORU_R01(validORUMessage);

  expect(result.val).toBeTruthy();
  const patientResult = result.val!.patientResults[0];
  expect(patientResult.orderObservations.length).toBe(1);
});

test("parseORU_R01 extracts OBR from order observation", () => {
  const result = parseORU_R01(validORUMessage);

  expect(result.val).toBeTruthy();
  const orderObs = result.val!.patientResults[0].orderObservations[0];
  expect(orderObs.obr).toBeTruthy();

  const placerOrder = ParserUtils.getComponent(orderObs.obr.fields[1], 0);
  expect(placerOrder).toBe("ORD123");
});

test("parseORU_R01 extracts OBX list", () => {
  const result = parseORU_R01(validORUMessage);

  expect(result.val).toBeTruthy();
  const orderObs = result.val!.patientResults[0].orderObservations[0];
  expect(orderObs.obxList.length).toBe(2);
});

test("parseORU_R01 extracts OBX values correctly", () => {
  const result = parseORU_R01(validORUMessage);

  expect(result.val).toBeTruthy();
  const obxList = result.val!.patientResults[0].orderObservations[0].obxList;

  const value1 = ParserUtils.getComponent(obxList[0].fields[4], 0);
  const value2 = ParserUtils.getComponent(obxList[1].fields[4], 0);

  expect(value1).toBe("15.5");
  expect(value2).toBe("5.2");
});

test("parseORU_R01 fails on empty message", () => {
  const result = parseORU_R01("");

  expect(result.ok).toBe(false);
  expect(result.err!.message).toBeTruthy();
  expect(result.err!.message.includes("Empty message")).toBeTruthy();
});

test("parseORU_R01 fails when not starting with MSH", () => {
  const invalidMessage = "PID|1||12345";
  const result = parseORU_R01(invalidMessage);

  expect(result.ok).toBe(false);
  expect(result.err!.message).toBeTruthy();
  expect(result.err!.message.includes("must start with MSH")).toBeTruthy();
});

test("parseORU_R01 fails on OBX without OBR", () => {
  const invalidMessage = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01|MSG001|P|2.5.1
PID|1||12345||Doe^John||19800115|M
OBX|1|NM|718-7^Hemoglobin^LN|1|15.5|g/dL||||||F`;

  const result = parseORU_R01(invalidMessage);

  expect(result.ok).toBe(false);
  expect(result.err!.message).toBeTruthy();
  expect(result.err!.message.includes("without preceding OBR")).toBeTruthy();
});

test("parseORU_R01 round-trip consistency", () => {
  const result = parseORU_R01(validORUMessage);

  expect(result.val).toBeTruthy();
  const reEncoded = result.val!.message.encode();

  const secondParse = parseORU_R01(reEncoded);
  expect(secondParse.ok).toBe(true);
});

test("parseORU_R01 handles message without PID", () => {
  const messageWithoutPID = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01|MSG001|P|2.5.1
OBR|1|ORD123|LAB456|CBC^Complete Blood Count^LN
OBX|1|NM|718-7^Hemoglobin^LN|1|15.5|g/dL||||||F`;

  const result = parseORU_R01(messageWithoutPID);

  expect(result.ok).toBe(true);
  expect(result.val).toBeTruthy();
  expect(result.val!.patientResults[0].pid).toBe(undefined);
});

test("parseORU_R01 handles message without PV1", () => {
  const messageWithoutPV1 = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01|MSG001|P|2.5.1
PID|1||12345||Doe^John||19800115|M
OBR|1|ORD123|LAB456|CBC^Complete Blood Count^LN
OBX|1|NM|718-7^Hemoglobin^LN|1|15.5|g/dL||||||F`;

  const result = parseORU_R01(messageWithoutPV1);

  expect(result.ok).toBe(true);
  expect(result.val).toBeTruthy();
  expect(result.val!.patientResults[0].pv1).toBe(undefined);
});

test("parseORU_R01 handles multiple order observations", () => {
  const multipleOrders = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01|MSG001|P|2.5.1
PID|1||12345||Doe^John||19800115|M
OBR|1|ORD123|LAB456|CBC^Complete Blood Count^LN
OBX|1|NM|718-7^Hemoglobin^LN|1|15.5|g/dL||||||F
OBR|2|ORD124|LAB457|CMP^Comprehensive Metabolic Panel^LN
OBX|1|NM|2345-7^Glucose^LN|1|95|mg/dL||||||F`;

  const result = parseORU_R01(multipleOrders);

  expect(result.val).toBeTruthy();
  expect(result.val!.patientResults[0].orderObservations.length).toBe(2);
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

  expect(result.val).toBeTruthy();
  expect(result.val!.patientResults.length).toBe(2);
});

test("parseORU_R01 parses NTE (patient notes) segment", () => {
  const messageWithNTE = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20250119120000||ORU^R01|MSG001|P|2.5.1
PID|1||12345||Doe^John||19800115|M
NTE|1||Patient has difficulty providing samples
OBR|1|ORD123|LAB456|CBC^Complete Blood Count^LN
OBX|1|NM|718-7^Hemoglobin^LN|1|15.5|g/dL||||||F`;

  const result = parseORU_R01(messageWithNTE);

  // Parser should succeed and parse the NTE segment
  if (!result.ok) {
    console.log("Parse error:", result.err.message);
  }
  expect(result.ok).toBe(true);
  expect(result.val).toBeTruthy();
  expect(result.val!.patientResults.length).toBe(1);

  // Verify NTE was parsed as patient note
  const patientResult = result.val!.patientResults[0];
  expect(patientResult.nteList).toBeTruthy();
  expect(patientResult.nteList!.length).toBe(1);
  expect(patientResult.nteList![0].getComment()).toBe(
    "Patient has difficulty providing samples",
  );
});

// ---------------------------------------------------------------------------
// Integration tests — parse validated example .hl7 files
// ---------------------------------------------------------------------------

const testDataDir = join(__dirname, "..", "testdata", "ORU_R01");
const testFiles = readdirSync(testDataDir).filter((f) => f.endsWith(".hl7"));

describe("ORU_R01 Integration Tests - Parse validated example messages", () => {
  for (const testFile of testFiles) {
    it(`Parse ${testFile}`, () => {
      const messageContent = readFileSync(join(testDataDir, testFile), "utf-8");
      const result = parseORU_R01(messageContent);

      expect(
        result.ok,
        `Failed to parse ${testFile}: ${result.err?.message}`,
      ).toBe(true);
      expect(result.val, `No data returned for ${testFile}`).toBeTruthy();
      expect(result.val!.msh, `No MSH segment in ${testFile}`).toBeTruthy();
      expect(
        result.val!.patientResults.length > 0,
        `No patient results in ${testFile}`,
      ).toBeTruthy();

      for (const patientResult of result.val!.patientResults) {
        expect(
          patientResult.orderObservations.length > 0,
          `No order observations in patient result for ${testFile}`,
        ).toBeTruthy();
      }
    });
  }
});

describe("ORU_R01 Integration Tests - Specific message validations", () => {
  it("CBC message has expected OBX count", () => {
    const result = parseORU_R01(
      readFileSync(
        join(testDataDir, "01_cbc_complete_blood_count.hl7"),
        "utf-8",
      ),
    );
    expect(result.ok).toBe(true);
    const obxCount =
      result.val!.patientResults[0].orderObservations[0].obxList.length;
    expect(
      obxCount >= 20,
      `Expected at least 20 OBX segments, got ${obxCount}`,
    ).toBeTruthy();
  });

  it("Microbiology message has specimen information", () => {
    const result = parseORU_R01(
      readFileSync(
        join(testDataDir, "04_wound_culture_microbiology.hl7"),
        "utf-8",
      ),
    );
    expect(result.ok).toBe(true);
    const obxCount =
      result.val!.patientResults[0].orderObservations[0].obxList.length;
    expect(
      obxCount >= 25,
      `Expected at least 25 OBX segments for microbiology, got ${obxCount}`,
    ).toBeTruthy();
  });

  it("Multiple patients message has 2 patient results", () => {
    const result = parseORU_R01(
      readFileSync(join(testDataDir, "13_multiple_patients.hl7"), "utf-8"),
    );
    expect(result.ok).toBe(true);
    expect(
      result.val!.patientResults.length,
      "Expected 2 patient results",
    ).toBe(2);
  });

  it("Multiple orders message has 2 order observations", () => {
    const result = parseORU_R01(
      readFileSync(
        join(testDataDir, "14_multiple_orders_single_patient.hl7"),
        "utf-8",
      ),
    );
    expect(result.ok).toBe(true);
    expect(
      result.val!.patientResults[0].orderObservations.length,
      "Expected 2 order observations",
    ).toBe(2);
  });

  it("Critical value message has abnormal flag", () => {
    const result = parseORU_R01(
      readFileSync(
        join(testDataDir, "15_critical_value_notification.hl7"),
        "utf-8",
      ),
    );
    expect(result.ok).toBe(true);
    const obxList = result.val!.patientResults[0].orderObservations[0].obxList;
    const hasCriticalValues = obxList.some((obx) => {
      const flags = obx.getAbnormalFlags();
      return flags.includes("HH") || flags.includes("LL");
    });
    expect(hasCriticalValues, "Expected critical value flags").toBeTruthy();
  });
});

describe("ORU_R01 Integration Tests - Round-trip encoding", () => {
  for (const testFile of testFiles) {
    it(`Round-trip encode/decode ${testFile}`, () => {
      const messageContent = readFileSync(join(testDataDir, testFile), "utf-8");
      const result = parseORU_R01(messageContent);
      expect(result.ok).toBe(true);

      const result2 = parseORU_R01(result.val!.message.encode());
      expect(
        result2.ok,
        `Round-trip failed for ${testFile}: ${result2.err?.message}`,
      ).toBe(true);
      expect(
        result2.val!.patientResults.length,
        `Patient result count mismatch in round-trip for ${testFile}`,
      ).toBe(result.val!.patientResults.length);
    });
  }
});

// ---------------------------------------------------------------------------
// Set ID behaviour
// ---------------------------------------------------------------------------

describe("ORU_R01 Set ID Behavior", () => {
  test("renumberSetIds option automatically corrects Set IDs", () => {
    const originalMessage = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20231115140500||ORU^R01|MSG001|P|2.5|||AL||
PID|1||123456789^^^MRN||DOE^JOHN^A||19750225|M
OBR|1|ORD123|LAB456|CBC^Complete Blood Count^L|||20231115120000
OBX|1|NM|6690-2^WBC^LN|1|7.5|10*3/uL|4.0-11.0|N|||F
OBX|2|NM|789-8^RBC^LN|1|4.8|10*6/uL|4.5-5.9|N|||F
OBR|2|ORD456|LAB789|GLU^Glucose^L|||20231115130000
OBX|1|NM|2345-7^Glucose^LN|1|95|mg/dL|70-100|N|||F`;

    const parseResult = parseORU_R01(originalMessage);
    expect(parseResult.ok).toBeTruthy();
    const patient = parseResult.val!.patientResults[0];

    const newObr = new OBR()
      .setId("99")
      .placerOrderNumber("NEWORDER")
      .fillerOrderNumber("NEWLAB")
      .universalServiceIdentifier({ identifier: "NA", text: "Sodium", nameOfCodingSystem: "L" })
      .observationDateTime("20231115110000");
    const newObx = new OBX()
      .setId("99")
      .valueType("NM")
      .observationIdentifier({ identifier: "2951-2", text: "Sodium", nameOfCodingSystem: "LN" })
      .observationSubId("1")
      .observationValue("140")
      .units({ identifier: "mmol/L" });
    patient.orderObservations.unshift({ obr: newObr, obxList: [newObx] });

    const anotherObx = new OBX()
      .setId("77")
      .valueType("NM")
      .observationIdentifier({ identifier: "2823-3", text: "Potassium", nameOfCodingSystem: "LN" })
      .observationSubId("1")
      .observationValue("4.2")
      .units({ identifier: "mmol/L" });
    patient.orderObservations[1].obxList.splice(1, 0, anotherObx);

    const reParseResult = parseORU_R01(
      createORU_R01(parseResult.val!.msh, [patient]).encode({
        renumberSetIds: true,
      }),
    );
    expect(reParseResult.ok).toBeTruthy();
    const rePatient = reParseResult.val!.patientResults[0];

    expect(
      rePatient.orderObservations[0].obr.fields[0]?.components[0]
        ?.subComponents[0],
      "First OBR should be renumbered to 1",
    ).toBe("1");
    expect(
      rePatient.orderObservations[1].obr.fields[0]?.components[0]
        ?.subComponents[0],
      "Second OBR should be renumbered to 2",
    ).toBe("2");
    expect(
      rePatient.orderObservations[2].obr.fields[0]?.components[0]
        ?.subComponents[0],
      "Third OBR should be renumbered to 3",
    ).toBe("3");
    expect(
      rePatient.orderObservations[1].obxList[0].fields[0]?.components[0]
        ?.subComponents[0],
      "First OBX in second order should be 1",
    ).toBe("1");
    expect(
      rePatient.orderObservations[1].obxList[1].fields[0]?.components[0]
        ?.subComponents[0],
      "Second OBX in second order should be 2",
    ).toBe("2");
    expect(
      rePatient.orderObservations[1].obxList[2].fields[0]?.components[0]
        ?.subComponents[0],
      "Third OBX in second order should be 3",
    ).toBe("3");
  });

  test("Set IDs are NOT automatically renumbered during encoding", () => {
    const originalMessage = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20231115140500||ORU^R01|MSG001|P|2.5|||AL||
PID|1||123456789^^^MRN||DOE^JOHN^A||19750225|M
OBR|1|ORD123|LAB456|CBC^Complete Blood Count^L|||20231115120000
OBX|1|NM|6690-2^WBC^LN|1|7.5|10*3/uL|4.0-11.0|N|||F
OBX|2|NM|789-8^RBC^LN|1|4.8|10*6/uL|4.5-5.9|N|||F
OBR|2|ORD456|LAB789|GLU^Glucose^L|||20231115130000
OBX|1|NM|2345-7^Glucose^LN|1|95|mg/dL|70-100|N|||F`;

    const parseResult = parseORU_R01(originalMessage);
    expect(parseResult.ok).toBeTruthy();
    const patient = parseResult.val!.patientResults[0];

    expect(
      patient.orderObservations[0].obr.fields[0]?.components[0]
        ?.subComponents[0],
    ).toBe("1");
    expect(
      patient.orderObservations[1].obr.fields[0]?.components[0]
        ?.subComponents[0],
    ).toBe("2");

    const newObr = new OBR()
      .setId("99")
      .placerOrderNumber("NEWORDER")
      .fillerOrderNumber("NEWLAB")
      .universalServiceIdentifier({ identifier: "NA", text: "Sodium", nameOfCodingSystem: "L" })
      .observationDateTime("20231115110000");
    const newObx = new OBX()
      .setId("99")
      .valueType("NM")
      .observationIdentifier({ identifier: "2951-2", text: "Sodium", nameOfCodingSystem: "LN" })
      .observationSubId("1")
      .observationValue("140")
      .units({ identifier: "mmol/L" });
    patient.orderObservations.unshift({ obr: newObr, obxList: [newObx] });

    const reParseResult = parseORU_R01(
      createORU_R01(parseResult.val!.msh, [patient]).encode(),
    );
    expect(reParseResult.ok).toBeTruthy();
    const rePatient = reParseResult.val!.patientResults[0];

    expect(
      rePatient.orderObservations[0].obr.fields[0]?.components[0]
        ?.subComponents[0],
    ).toBe("99");
    expect(
      rePatient.orderObservations[1].obr.fields[0]?.components[0]
        ?.subComponents[0],
    ).toBe("1");
    expect(
      rePatient.orderObservations[2].obr.fields[0]?.components[0]
        ?.subComponents[0],
    ).toBe("2");
  });

  test("OBX Set IDs are NOT automatically renumbered when adding to middle", () => {
    const originalMessage = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20231115140500||ORU^R01|MSG001|P|2.5|||AL||
PID|1||123456789^^^MRN||DOE^JOHN^A||19750225|M
OBR|1|ORD123|LAB456|CBC^Complete Blood Count^L|||20231115120000
OBX|1|NM|6690-2^WBC^LN|1|7.5|10*3/uL|4.0-11.0|N|||F
OBX|2|NM|789-8^RBC^LN|1|4.8|10*6/uL|4.5-5.9|N|||F
OBR|2|ORD456|LAB789|GLU^Glucose^L|||20231115130000
OBX|1|NM|2345-7^Glucose^LN|1|95|mg/dL|70-100|N|||F`;

    const parseResult = parseORU_R01(originalMessage);
    expect(parseResult.ok).toBeTruthy();
    const firstOrder = parseResult.val!.patientResults[0].orderObservations[0];

    expect(firstOrder.obxList.length).toBe(2);
    expect(
      firstOrder.obxList[0].fields[0]?.components[0]?.subComponents[0],
    ).toBe("1");
    expect(
      firstOrder.obxList[1].fields[0]?.components[0]?.subComponents[0],
    ).toBe("2");

    const newObx = new OBX()
      .setId("77")
      .valueType("NM")
      .observationIdentifier({ identifier: "2823-3", text: "Potassium", nameOfCodingSystem: "LN" })
      .observationSubId("1")
      .observationValue("4.2")
      .units({ identifier: "mmol/L" });
    firstOrder.obxList.splice(1, 0, newObx);

    const reParseResult = parseORU_R01(
      createORU_R01(parseResult.val!.msh, [
        parseResult.val!.patientResults[0],
      ]).encode(),
    );
    expect(reParseResult.ok).toBeTruthy();
    const reOrder = reParseResult.val!.patientResults[0].orderObservations[0];

    expect(reOrder.obxList.length).toBe(3);
    expect(
      reOrder.obxList[0].fields[0]?.components[0]?.subComponents[0],
      "First OBX should remain Set ID 1",
    ).toBe("1");
    expect(
      reOrder.obxList[1].fields[0]?.components[0]?.subComponents[0],
      "Inserted OBX should keep Set ID 77",
    ).toBe("77");
    expect(
      reOrder.obxList[2].fields[0]?.components[0]?.subComponents[0],
      "Last OBX should remain Set ID 2",
    ).toBe("2");
  });

  test("Developer must manually renumber Set IDs for proper sequential order", () => {
    const originalMessage = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20231115140500||ORU^R01|MSG001|P|2.5|||AL||
PID|1||123456789^^^MRN||DOE^JOHN^A||19750225|M
OBR|1|ORD123|LAB456|CBC^Complete Blood Count^L|||20231115120000
OBX|1|NM|6690-2^WBC^LN|1|7.5|10*3/uL|4.0-11.0|N|||F
OBX|2|NM|789-8^RBC^LN|1|4.8|10*6/uL|4.5-5.9|N|||F
OBR|2|ORD456|LAB789|GLU^Glucose^L|||20231115130000
OBX|1|NM|2345-7^Glucose^LN|1|95|mg/dL|70-100|N|||F`;

    const parseResult = parseORU_R01(originalMessage);
    expect(parseResult.ok).toBeTruthy();
    const patient = parseResult.val!.patientResults[0];

    const newObr = new OBR()
      .setId("1")
      .placerOrderNumber("NEWORDER")
      .fillerOrderNumber("NEWLAB")
      .universalServiceIdentifier({ identifier: "NA", text: "Sodium", nameOfCodingSystem: "L" })
      .observationDateTime("20231115110000");
    const newObx = new OBX()
      .setId("1")
      .valueType("NM")
      .observationIdentifier({ identifier: "2951-2", text: "Sodium", nameOfCodingSystem: "LN" })
      .observationSubId("1")
      .observationValue("140")
      .units({ identifier: "mmol/L" });

    patient.orderObservations[0].obr.setId("2");
    patient.orderObservations[1].obr.setId("3");
    patient.orderObservations.unshift({ obr: newObr, obxList: [newObx] });

    const reParseResult = parseORU_R01(
      createORU_R01(parseResult.val!.msh, [patient]).encode(),
    );
    expect(reParseResult.ok).toBeTruthy();
    const rePatient = reParseResult.val!.patientResults[0];

    expect(
      rePatient.orderObservations[0].obr.fields[0]?.components[0]
        ?.subComponents[0],
    ).toBe("1");
    expect(
      rePatient.orderObservations[1].obr.fields[0]?.components[0]
        ?.subComponents[0],
    ).toBe("2");
    expect(
      rePatient.orderObservations[2].obr.fields[0]?.components[0]
        ?.subComponents[0],
    ).toBe("3");
  });

  test("OBX Set IDs can be manually renumbered for proper sequential order", () => {
    const originalMessage = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20231115140500||ORU^R01|MSG001|P|2.5|||AL||
PID|1||123456789^^^MRN||DOE^JOHN^A||19750225|M
OBR|1|ORD123|LAB456|CBC^Complete Blood Count^L|||20231115120000
OBX|1|NM|6690-2^WBC^LN|1|7.5|10*3/uL|4.0-11.0|N|||F
OBX|2|NM|789-8^RBC^LN|1|4.8|10*6/uL|4.5-5.9|N|||F
OBR|2|ORD456|LAB789|GLU^Glucose^L|||20231115130000
OBX|1|NM|2345-7^Glucose^LN|1|95|mg/dL|70-100|N|||F`;

    const parseResult = parseORU_R01(originalMessage);
    expect(parseResult.ok).toBeTruthy();
    const firstOrder = parseResult.val!.patientResults[0].orderObservations[0];

    const newObx = new OBX()
      .setId("2")
      .valueType("NM")
      .observationIdentifier({ identifier: "2823-3", text: "Potassium", nameOfCodingSystem: "LN" })
      .observationSubId("1")
      .observationValue("4.2")
      .units({ identifier: "mmol/L" });
    firstOrder.obxList[1].setId("3");
    firstOrder.obxList.splice(1, 0, newObx);

    const reParseResult = parseORU_R01(
      createORU_R01(parseResult.val!.msh, [
        parseResult.val!.patientResults[0],
      ]).encode(),
    );
    expect(reParseResult.ok).toBeTruthy();
    const reOrder = reParseResult.val!.patientResults[0].orderObservations[0];

    expect(reOrder.obxList[0].fields[0]?.components[0]?.subComponents[0]).toBe(
      "1",
    );
    expect(reOrder.obxList[1].fields[0]?.components[0]?.subComponents[0]).toBe(
      "2",
    );
    expect(reOrder.obxList[2].fields[0]?.components[0]?.subComponents[0]).toBe(
      "3",
    );
  });
});
