import { parseORU_R01 } from "../src/parsers/v2.5.1/ORU_R01_Parser.ts";
import { createORU_R01 } from "../src/builders/v2.5.1/ORU_R01.ts";
import { OBX, OBR, MSH, PID } from "../src/segments/v2.5.1/index.ts";

/**
 * Example: Parse an HL7 message, modify it, and re-encode
 *
 * This demonstrates:
 * 1. Parsing an existing HL7 ORU_R01 message
 * 2. Adding OBX results to existing tests (beginning, middle, end)
 * 3. Adding new OBR tests (beginning, middle, end)
 * 4. Re-encoding the modified message
 */

// Sample ORU_R01 message with 1 patient, 2 orders (CBC and Glucose)
const originalMessage = `MSH|^~\\&|LAB|Hospital|EMR|Clinic|20231115140500||ORU^R01|MSG001|P|2.5|||AL||
PID|1||123456789^^^MRN||DOE^JOHN^A||19750225|M
ORC|RE|ORD123|LAB456|||||||||123^SMITH^JANE^A^MD^^MD|
OBR|1|ORD123|LAB456|CBC^Complete Blood Count^L|||20231115120000
OBX|1|NM|6690-2^WBC^LN|1|7.5|10*3/uL|4.0-11.0|N|||F
OBX|2|NM|789-8^RBC^LN|1|4.8|10*6/uL|4.5-5.9|N|||F
ORC|RE|ORD456|LAB789|||||||||456^JONES^BOB^B^MD^^MD|
OBR|2|ORD456|LAB789|GLU^Glucose^L|||20231115130000
OBX|1|NM|2345-7^Glucose^LN|1|95|mg/dL|70-100|N|||F`;

console.log("=== Original Message ===");
console.log(originalMessage);
console.log("\n");

// Parse the message
const parseResult = parseORU_R01(originalMessage);

if (!parseResult.ok || !parseResult.val) {
  console.error("Failed to parse message:", parseResult.err);
  process.exit(1);
}

console.log("=== Parsed Structure ===");
console.log(`Number of patients: ${parseResult.val.patientResults.length}`);
console.log(
  `Number of orders for patient 1: ${parseResult.val.patientResults[0].orderObservations.length}`,
);
console.log("\n");

// Extract the data for modification
const msh = parseResult.val.msh;
const patientResult = parseResult.val.patientResults[0]; // First (and only) patient

// ============================================
// SCENARIO 1: Add OBX to existing test
// ============================================
console.log("=== SCENARIO 1: Adding OBX results to existing tests ===\n");

// Add OBX to BEGINNING of first order (CBC)
const hgbObx = new OBX()
  .setId("1")
  .valueType("NM")
  .observationIdentifier({ identifier: "718-7", text: "Hemoglobin", nameOfCodingSystem: "LN" })
  .observationSubId("1")
  .observationValue("14.5")
  .units({ identifier: "g/dL" })
  .referenceRange("13.5-17.5")
  .abnormalFlags("N")
  .observationResultStatus("F");

patientResult.orderObservations[0].obxList.unshift(hgbObx); // Add to beginning
console.log("✓ Added Hemoglobin OBX to BEGINNING of CBC order");

// Add OBX to MIDDLE of first order (CBC) - after first item
const hctObx = new OBX()
  .setId("2")
  .valueType("NM")
  .observationIdentifier({ identifier: "4544-3", text: "Hematocrit", nameOfCodingSystem: "LN" })
  .observationSubId("1")
  .observationValue("43.2")
  .units({ identifier: "%" })
  .referenceRange("38.8-50.0")
  .abnormalFlags("N")
  .observationResultStatus("F");

patientResult.orderObservations[0].obxList.splice(2, 0, hctObx); // Insert at position 2
console.log("✓ Added Hematocrit OBX to MIDDLE of CBC order");

// Add OBX to END of first order (CBC)
const pltObx = new OBX()
  .setId("5")
  .valueType("NM")
  .observationIdentifier({ identifier: "777-3", text: "Platelets", nameOfCodingSystem: "LN" })
  .observationSubId("1")
  .observationValue("250")
  .units({ identifier: "10*3/uL" })
  .referenceRange("150-400")
  .abnormalFlags("N")
  .observationResultStatus("F");

patientResult.orderObservations[0].obxList.push(pltObx); // Add to end
console.log("✓ Added Platelets OBX to END of CBC order");
console.log(
  `  CBC now has ${patientResult.orderObservations[0].obxList.length} OBX segments`,
);
console.log("\n");

// ============================================
// SCENARIO 2: Add new OBR/OBX orders
// ============================================
console.log("=== SCENARIO 2: Adding new OBR tests ===\n");

// Add OBR to BEGINNING - Sodium test
const sodiumObr = new OBR()
  .setId("1")
  .placerOrderNumber("ORD001")
  .fillerOrderNumber("LAB001")
  .universalServiceIdentifier({ identifier: "NA", text: "Sodium", nameOfCodingSystem: "L" })
  .observationDateTime("20231115110000")
  .resultStatus("F");

const sodiumObx = new OBX()
  .setId("1")
  .valueType("NM")
  .observationIdentifier({ identifier: "2951-2", text: "Sodium", nameOfCodingSystem: "LN" })
  .observationSubId("1")
  .observationValue("140")
  .units({ identifier: "mmol/L" })
  .referenceRange("136-145")
  .abnormalFlags("N")
  .observationResultStatus("F");

patientResult.orderObservations.unshift({
  obr: sodiumObr,
  obxList: [sodiumObx],
});
console.log("✓ Added Sodium test to BEGINNING");

// Add OBR to MIDDLE - Potassium test (after Sodium, before CBC)
const potassiumObr = new OBR()
  .setId("2")
  .placerOrderNumber("ORD002")
  .fillerOrderNumber("LAB002")
  .universalServiceIdentifier({ identifier: "K", text: "Potassium", nameOfCodingSystem: "L" })
  .observationDateTime("20231115115000")
  .resultStatus("F");

const potassiumObx = new OBX()
  .setId("1")
  .valueType("NM")
  .observationIdentifier({ identifier: "2823-3", text: "Potassium", nameOfCodingSystem: "LN" })
  .observationSubId("1")
  .observationValue("4.2")
  .units({ identifier: "mmol/L" })
  .referenceRange("3.5-5.1")
  .abnormalFlags("N")
  .observationResultStatus("F");

patientResult.orderObservations.splice(1, 0, {
  obr: potassiumObr,
  obxList: [potassiumObx],
});
console.log("✓ Added Potassium test to MIDDLE");

// Add OBR to END - Creatinine test
const creatinineObr = new OBR()
  .setId("5")
  .placerOrderNumber("ORD999")
  .fillerOrderNumber("LAB999")
  .universalServiceIdentifier({ identifier: "CREAT", text: "Creatinine", nameOfCodingSystem: "L" })
  .observationDateTime("20231115150000")
  .resultStatus("F");

const creatinineObx = new OBX()
  .setId("1")
  .valueType("NM")
  .observationIdentifier({ identifier: "2160-0", text: "Creatinine", nameOfCodingSystem: "LN" })
  .observationSubId("1")
  .observationValue("1.1")
  .units({ identifier: "mg/dL" })
  .referenceRange("0.7-1.3")
  .abnormalFlags("N")
  .observationResultStatus("F");

patientResult.orderObservations.push({
  obr: creatinineObr,
  obxList: [creatinineObx],
});
console.log("✓ Added Creatinine test to END");
console.log(
  `  Patient now has ${patientResult.orderObservations.length} orders total`,
);
console.log("\n");

// ============================================
// SCENARIO 3: Re-encode the modified message
// ============================================
console.log("=== SCENARIO 3: Re-encoding the modified message ===\n");

// Create a new ORU_R01 message with the modified data
const modifiedMessage = createORU_R01(msh, [patientResult]);

// Verify and encode
const verification = modifiedMessage.verify();
if (!verification.valid) {
  console.error("Validation errors:", verification.errors);
  process.exit(1);
}

const encodedMessage = modifiedMessage.encode();

console.log("=== Modified Message ===");
console.log(encodedMessage);
console.log("\n");

// ============================================
// SCENARIO 4: Verify round-trip
// ============================================
console.log("=== SCENARIO 4: Verify round-trip parsing ===\n");

const reParseResult = parseORU_R01(encodedMessage);

if (!reParseResult.ok || !reParseResult.val) {
  console.error("Failed to re-parse modified message:", reParseResult.err);
  process.exit(1);
}

console.log("✓ Re-parsed successfully!");
console.log(
  `  Patients: ${reParseResult.val.patientResults.length}`,
);
console.log(
  `  Orders: ${reParseResult.val.patientResults[0].orderObservations.length}`,
);
console.log(
  `  CBC OBX count: ${reParseResult.val.patientResults[0].orderObservations[2].obxList.length}`,
);
console.log("\n");

// ============================================
// Summary
// ============================================
console.log("=== Summary ===");
console.log("Original message:");
console.log("  - 2 orders (CBC with 2 OBX, Glucose with 1 OBX)");
console.log("\nModified message:");
console.log("  - 5 orders:");
console.log("    1. Sodium (new, at beginning)");
console.log("    2. Potassium (new, in middle)");
console.log("    3. CBC (modified, now has 5 OBX instead of 2)");
console.log("    4. Glucose (unchanged)");
console.log("    5. Creatinine (new, at end)");
console.log("\n✓ All operations successful!");
console.log("✓ Message can be parsed, modified, and re-encoded properly!");
