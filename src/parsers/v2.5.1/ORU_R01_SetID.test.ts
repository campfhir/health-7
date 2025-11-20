import { describe, test } from "node:test";
import assert from "node:assert";
import { parseORU_R01 } from "./ORU_R01_Parser";
import { createORU_R01 } from "../../builders/v2.5.1/ORU_R01";
import { OBX, OBR } from "../../segments/v2.5.1";

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
    assert.ok(parseResult.success);
    assert.ok(parseResult.data);

    const patient = parseResult.data.patientResults[0];

    // Add new OBR at beginning with wrong Set ID
    const newObr = new OBR()
      .setId("99") // Wrong ID
      .placerOrderNumber("NEWORDER")
      .fillerOrderNumber("NEWLAB")
      .universalServiceIdentifier("NA", "Sodium", "L")
      .observationDateTime("20231115110000");

    const newObx = new OBX()
      .setId("99") // Wrong ID
      .valueType("NM")
      .observationIdentifier("2951-2", "Sodium", "LN")
      .observationSubId("1")
      .observationValue("140")
      .units("mmol/L");

    patient.orderObservations.unshift({
      obr: newObr,
      obxList: [newObx],
    });

    // Add OBX with wrong Set ID to middle of first order
    const anotherObx = new OBX()
      .setId("77") // Wrong ID
      .valueType("NM")
      .observationIdentifier("2823-3", "Potassium", "LN")
      .observationSubId("1")
      .observationValue("4.2")
      .units("mmol/L");

    patient.orderObservations[1].obxList.splice(1, 0, anotherObx);

    // Encode WITH renumberSetIds option
    const rebuilt = createORU_R01(parseResult.data.msh, [patient]);
    const reencoded = rebuilt.encode({ renumberSetIds: true });

    // Re-parse
    const reParseResult = parseORU_R01(reencoded);
    assert.ok(reParseResult.success);
    assert.ok(reParseResult.data);

    const rePatient = reParseResult.data.patientResults[0];

    // Verify Set IDs were automatically renumbered to 1, 2, 3
    assert.strictEqual(
      rePatient.orderObservations[0].obr.fields[0]?.components[0]
        ?.subComponents[0],
      "1",
      "First OBR should be renumbered to 1",
    );
    assert.strictEqual(
      rePatient.orderObservations[1].obr.fields[0]?.components[0]
        ?.subComponents[0],
      "2",
      "Second OBR should be renumbered to 2",
    );
    assert.strictEqual(
      rePatient.orderObservations[2].obr.fields[0]?.components[0]
        ?.subComponents[0],
      "3",
      "Third OBR should be renumbered to 3",
    );

    // Verify OBX Set IDs were also renumbered within their orders
    assert.strictEqual(
      rePatient.orderObservations[1].obxList[0].fields[0]?.components[0]
        ?.subComponents[0],
      "1",
      "First OBX in second order should be 1",
    );
    assert.strictEqual(
      rePatient.orderObservations[1].obxList[1].fields[0]?.components[0]
        ?.subComponents[0],
      "2",
      "Second OBX in second order should be 2",
    );
    assert.strictEqual(
      rePatient.orderObservations[1].obxList[2].fields[0]?.components[0]
        ?.subComponents[0],
      "3",
      "Third OBX in second order should be 3",
    );
  });

  test("Set IDs are NOT automatically renumbered during encoding", () => {
    const originalMessage = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20231115140500||ORU^R01|MSG001|P|2.5|||AL||
PID|1||123456789^^^MRN||DOE^JOHN^A||19750225|M
OBR|1|ORD123|LAB456|CBC^Complete Blood Count^L|||20231115120000
OBX|1|NM|6690-2^WBC^LN|1|7.5|10*3/uL|4.0-11.0|N|||F
OBX|2|NM|789-8^RBC^LN|1|4.8|10*6/uL|4.5-5.9|N|||F
OBR|2|ORD456|LAB789|GLU^Glucose^L|||20231115130000
OBX|1|NM|2345-7^Glucose^LN|1|95|mg/dL|70-100|N|||F`;

    // Parse original message
    const parseResult = parseORU_R01(originalMessage);
    assert.ok(parseResult.success);
    assert.ok(parseResult.data);

    const patient = parseResult.data.patientResults[0];

    // Verify original Set IDs
    assert.strictEqual(
      patient.orderObservations[0].obr.fields[0]?.components[0]
        ?.subComponents[0],
      "1",
    );
    assert.strictEqual(
      patient.orderObservations[1].obr.fields[0]?.components[0]
        ?.subComponents[0],
      "2",
    );

    // Add new OBR at beginning with intentionally wrong Set ID
    const newObr = new OBR()
      .setId("99") // Should ideally be 1, but won't be auto-corrected
      .placerOrderNumber("NEWORDER")
      .fillerOrderNumber("NEWLAB")
      .universalServiceIdentifier("NA", "Sodium", "L")
      .observationDateTime("20231115110000");

    const newObx = new OBX()
      .setId("99")
      .valueType("NM")
      .observationIdentifier("2951-2", "Sodium", "LN")
      .observationSubId("1")
      .observationValue("140")
      .units("mmol/L");

    patient.orderObservations.unshift({
      obr: newObr,
      obxList: [newObx],
    });

    // Re-encode
    const rebuilt = createORU_R01(parseResult.data.msh, [patient]);
    const reencoded = rebuilt.encode();

    // Re-parse
    const reParseResult = parseORU_R01(reencoded);
    assert.ok(reParseResult.success);
    assert.ok(reParseResult.data);

    const rePatient = reParseResult.data.patientResults[0];

    // Verify Set IDs were preserved, NOT renumbered
    assert.strictEqual(
      rePatient.orderObservations[0].obr.fields[0]?.components[0]
        ?.subComponents[0],
      "99", // Still 99, not renumbered to 1
      "OBR Set ID should be preserved as-is (99), not auto-renumbered",
    );

    assert.strictEqual(
      rePatient.orderObservations[1].obr.fields[0]?.components[0]
        ?.subComponents[0],
      "1", // Still 1, not renumbered to 2
      "Second OBR Set ID should be preserved as-is (1)",
    );

    assert.strictEqual(
      rePatient.orderObservations[2].obr.fields[0]?.components[0]
        ?.subComponents[0],
      "2", // Still 2, not renumbered to 3
      "Third OBR Set ID should be preserved as-is (2)",
    );
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
    assert.ok(parseResult.success);
    assert.ok(parseResult.data);

    const patient = parseResult.data.patientResults[0];
    const firstOrder = patient.orderObservations[0];

    // Original has OBX with Set IDs: 1, 2
    assert.strictEqual(firstOrder.obxList.length, 2);
    assert.strictEqual(
      firstOrder.obxList[0].fields[0]?.components[0]?.subComponents[0],
      "1",
    );
    assert.strictEqual(
      firstOrder.obxList[1].fields[0]?.components[0]?.subComponents[0],
      "2",
    );

    // Insert OBX with Set ID 77 in the middle
    const newObx = new OBX()
      .setId("77") // Should ideally be 2, pushing others forward
      .valueType("NM")
      .observationIdentifier("2823-3", "Potassium", "LN")
      .observationSubId("1")
      .observationValue("4.2")
      .units("mmol/L");

    firstOrder.obxList.splice(1, 0, newObx);

    // Re-encode and re-parse
    const rebuilt = createORU_R01(parseResult.data.msh, [patient]);
    const reencoded = rebuilt.encode();
    const reParseResult = parseORU_R01(reencoded);
    assert.ok(reParseResult.success);
    assert.ok(reParseResult.data);

    const rePatient = reParseResult.data.patientResults[0];
    const reOrder = rePatient.orderObservations[0];

    // Verify Set IDs: should be 1, 77, 2 (preserved, not renumbered to 1, 2, 3)
    assert.strictEqual(reOrder.obxList.length, 3);
    assert.strictEqual(
      reOrder.obxList[0].fields[0]?.components[0]?.subComponents[0],
      "1",
      "First OBX should remain Set ID 1",
    );
    assert.strictEqual(
      reOrder.obxList[1].fields[0]?.components[0]?.subComponents[0],
      "77",
      "Inserted OBX should keep Set ID 77, not be renumbered to 2",
    );
    assert.strictEqual(
      reOrder.obxList[2].fields[0]?.components[0]?.subComponents[0],
      "2",
      "Last OBX should remain Set ID 2, not be renumbered to 3",
    );
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
    assert.ok(parseResult.success);
    assert.ok(parseResult.data);

    const patient = parseResult.data.patientResults[0];

    // Add new OBR at beginning, manually setting correct Set ID
    const newObr = new OBR()
      .setId("1") // Manually set to 1
      .placerOrderNumber("NEWORDER")
      .fillerOrderNumber("NEWLAB")
      .universalServiceIdentifier("NA", "Sodium", "L")
      .observationDateTime("20231115110000");

    const newObx = new OBX()
      .setId("1")
      .valueType("NM")
      .observationIdentifier("2951-2", "Sodium", "LN")
      .observationSubId("1")
      .observationValue("140")
      .units("mmol/L");

    // Manually renumber existing OBRs
    patient.orderObservations[0].obr.setId("2"); // Was 1, now 2
    patient.orderObservations[1].obr.setId("3"); // Was 2, now 3

    // Insert at beginning
    patient.orderObservations.unshift({
      obr: newObr,
      obxList: [newObx],
    });

    // Re-encode and re-parse
    const rebuilt = createORU_R01(parseResult.data.msh, [patient]);
    const reencoded = rebuilt.encode();
    const reParseResult = parseORU_R01(reencoded);
    assert.ok(reParseResult.success);
    assert.ok(reParseResult.data);

    const rePatient = reParseResult.data.patientResults[0];

    // Verify proper sequential Set IDs: 1, 2, 3
    assert.strictEqual(
      rePatient.orderObservations[0].obr.fields[0]?.components[0]
        ?.subComponents[0],
      "1",
    );
    assert.strictEqual(
      rePatient.orderObservations[1].obr.fields[0]?.components[0]
        ?.subComponents[0],
      "2",
    );
    assert.strictEqual(
      rePatient.orderObservations[2].obr.fields[0]?.components[0]
        ?.subComponents[0],
      "3",
    );
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
    assert.ok(parseResult.success);
    assert.ok(parseResult.data);

    const patient = parseResult.data.patientResults[0];
    const firstOrder = patient.orderObservations[0];

    // Insert new OBX at position 1 with correct Set ID
    const newObx = new OBX()
      .setId("2") // Will be position 1 (middle)
      .valueType("NM")
      .observationIdentifier("2823-3", "Potassium", "LN")
      .observationSubId("1")
      .observationValue("4.2")
      .units("mmol/L");

    // Manually renumber existing OBX that will shift
    firstOrder.obxList[1].setId("3"); // Was 2, now 3

    // Insert at position 1
    firstOrder.obxList.splice(1, 0, newObx);

    // Re-encode and re-parse
    const rebuilt = createORU_R01(parseResult.data.msh, [patient]);
    const reencoded = rebuilt.encode();
    const reParseResult = parseORU_R01(reencoded);
    assert.ok(reParseResult.success);
    assert.ok(reParseResult.data);

    const rePatient = reParseResult.data.patientResults[0];
    const reOrder = rePatient.orderObservations[0];

    // Verify proper sequential Set IDs: 1, 2, 3
    assert.strictEqual(
      reOrder.obxList[0].fields[0]?.components[0]?.subComponents[0],
      "1",
    );
    assert.strictEqual(
      reOrder.obxList[1].fields[0]?.components[0]?.subComponents[0],
      "2",
    );
    assert.strictEqual(
      reOrder.obxList[2].fields[0]?.components[0]?.subComponents[0],
      "3",
    );
  });
});
