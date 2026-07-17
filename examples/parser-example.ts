import { MSH, PID, PV1, OBR, OBX } from "../src/segments/v2.5.1/index.ts";
import { createORU_R01, type PatientResult } from "../src/builders/v2.5.1/ORU_R01.ts";
import { parseORU_R01 } from "../src/parsers/v2.5.1/index.ts";
import { ParserUtils } from "../src/index.ts";

function formatDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

console.log("=".repeat(80));
console.log("HL7v2 Parser Example - Round Trip Test");
console.log("=".repeat(80));

const now = new Date();
const messageDateTime = formatDateTime(now);

console.log("\n1. Building ORU_R01 Message");
console.log("-".repeat(80));

const msh = new MSH()
  .sendingApplication("LAB")
  .sendingFacility("General Hospital")
  .receivingApplication("EMR")
  .receivingFacility("Main Campus")
  .dateTimeOfMessage(messageDateTime)
  .messageType({ messageCode: "ORU", triggerEvent: "R01", messageStructure: "ORU_R01" })
  .messageControlId("MSG00001")
  .processingId("P")
  .versionId("2.5.1");

const pid = new PID()
  .setId("1")
  .patientIdentifierList({ id: "12345", checkDigit: "", checkDigitScheme: "", assigningAuthority: "MRN", identifierTypeCode: "MR" })
  .patientName({ familyName: "Doe", givenName: "John", middleName: "Q" })
  .dateTimeOfBirth("19800115")
  .administrativeSex("M")
  .patientAddress({ streetAddress: "123 Main St", otherDesignation: "", city: "Springfield", state: "IL", zip: "62701", country: "USA" })
  .phoneNumberHome("555-1234");

const pv1 = new PV1()
  .setId("1")
  .patientClass("I")
  .assignedPatientLocation({ pointOfCare: "ICU", room: "101", bed: "A", facility: "Main" })
  .attendingDoctor({ id: "1234", familyName: "Smith", givenName: "Jane" })
  .admitDateTime(messageDateTime);

const obr = new OBR()
  .setId("1")
  .placerOrderNumber("ORD123456")
  .fillerOrderNumber("LAB987654")
  .universalServiceIdentifier({ identifier: "CBC", text: "Complete Blood Count", nameOfCodingSystem: "LN" })
  .observationDateTime(messageDateTime)
  .orderingProvider({ id: "1234", familyName: "Smith", givenName: "Jane" })
  .resultStatus("F");

const obx1 = new OBX()
  .setId("1")
  .valueType("NM")
  .observationIdentifier({ identifier: "718-7", text: "Hemoglobin", nameOfCodingSystem: "LN" })
  .observationSubId("1")
  .observationValue("15.5")
  .units({ identifier: "g/dL", text: "grams per deciliter", nameOfCodingSystem: "UCUM" })
  .referenceRange("13.5-17.5")
  .observationResultStatus("F")
  .dateTimeOfObservation(messageDateTime);

const obx2 = new OBX()
  .setId("2")
  .valueType("NM")
  .observationIdentifier({ identifier: "789-8", text: "RBC", nameOfCodingSystem: "LN" })
  .observationSubId("1")
  .observationValue("5.2")
  .units({ identifier: "10*6/uL", text: "million per microliter", nameOfCodingSystem: "UCUM" })
  .referenceRange("4.5-5.9")
  .observationResultStatus("F")
  .dateTimeOfObservation(messageDateTime);

const patientResult: PatientResult = {
  pid,
  pv1,
  orderObservations: [
    {
      obr,
      obxList: [obx1, obx2],
    },
  ],
};

const message = createORU_R01(msh, [patientResult]);

const encodedMessage = message.encode();

console.log("Original HL7 Message:");
console.log(encodedMessage);
console.log("\nSegment Count:", encodedMessage.split("\r").length);

console.log("\n2. Parsing the Message");
console.log("-".repeat(80));

const parseResult = parseORU_R01(encodedMessage);

if (!parseResult.ok) {
  console.error("Failed to parse message:", parseResult.err);
  throw new Error("Parse failed");
}

const parsed = parseResult.val!;
console.log("Parse successful!");
console.log("Patient Results:", parsed.patientResults.length);
console.log(
  "Order Observations:",
  parsed.patientResults[0].orderObservations.length,
);
console.log(
  "Observations (OBX):",
  parsed.patientResults[0].orderObservations[0].obxList.length,
);

console.log("\n3. Extracting Data from Parsed Message");
console.log("-".repeat(80));

const mshFields = parsed.msh.fields;
console.log("MSH Data:");
console.log(
  "  Sending Application:",
  ParserUtils.getComponent(mshFields[1], 0),
);
console.log("  Sending Facility:", ParserUtils.getComponent(mshFields[2], 0));
console.log("  Message Type:", ParserUtils.getComponent(mshFields[7], 0));
console.log("  Trigger Event:", ParserUtils.getComponent(mshFields[7], 1));
console.log("  Message Control ID:", ParserUtils.getComponent(mshFields[8], 0));
console.log("  Version:", ParserUtils.getComponent(mshFields[10], 0));

const pidFields = parsed.patientResults[0].pid!.fields;
console.log("\nPID Data:");
console.log("  Patient ID:", ParserUtils.getComponent(pidFields[2], 0));
console.log("  ID Type:", ParserUtils.getComponent(pidFields[2], 4));
console.log("  Family Name:", ParserUtils.getComponent(pidFields[4], 0));
console.log("  Given Name:", ParserUtils.getComponent(pidFields[4], 1));
console.log("  DOB:", ParserUtils.getComponent(pidFields[6], 0));
console.log("  Sex:", ParserUtils.getComponent(pidFields[7], 0));

const obrFields = parsed.patientResults[0].orderObservations[0].obr.fields;
console.log("\nOBR Data:");
console.log(
  "  Placer Order Number:",
  ParserUtils.getComponent(obrFields[1], 0),
);
console.log(
  "  Filler Order Number:",
  ParserUtils.getComponent(obrFields[2], 0),
);
console.log("  Service ID:", ParserUtils.getComponent(obrFields[3], 0));
console.log("  Service Name:", ParserUtils.getComponent(obrFields[3], 1));

console.log("\nOBX Data:");
parsed.patientResults[0].orderObservations[0].obxList.forEach(
  (obx, idx) => {
    const obxFields = obx.fields;
    console.log(`  Observation ${idx + 1}:`);
    console.log("    Type:", ParserUtils.getComponent(obxFields[1], 0));
    console.log("    Identifier:", ParserUtils.getComponent(obxFields[2], 0));
    console.log("    Name:", ParserUtils.getComponent(obxFields[2], 1));
    console.log("    Value:", ParserUtils.getComponent(obxFields[4], 0));
    console.log("    Units:", ParserUtils.getComponent(obxFields[5], 0));
    console.log(
      "    Reference Range:",
      ParserUtils.getComponent(obxFields[6], 0),
    );
    console.log("    Status:", ParserUtils.getComponent(obxFields[10], 0));
  },
);

console.log("\n4. Re-encoding Parsed Message (Round Trip)");
console.log("-".repeat(80));

const reEncodedMessage = parsed.message.encode();
console.log("Re-encoded Message:");
console.log(reEncodedMessage);

console.log("\n5. Comparing Original and Re-encoded");
console.log("-".repeat(80));

if (encodedMessage === reEncodedMessage) {
  console.log("✓ SUCCESS: Original and re-encoded messages are identical!");
} else {
  console.log("✗ DIFFERENCE: Messages differ");
  console.log("\nOriginal segments:");
  encodedMessage
    .split("\r")
    .forEach((seg: string, i: number) => console.log(`  ${i + 1}. ${seg}`));
  console.log("\nRe-encoded segments:");
  reEncodedMessage
    .split("\r")
    .forEach((seg: string, i: number) => console.log(`  ${i + 1}. ${seg}`));
}

console.log("\n" + "=".repeat(80));
console.log("Test Complete");
console.log("=".repeat(80));
