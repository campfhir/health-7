import { MSH, PID, PV1, ORC, OBR, OBX } from "../src/segments/v2.5.1/index.ts";
import { createORU_R30, type PatientResultR30 } from "../src/builders/v2.5.1/ORU_R30.ts";

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
console.log("HL7 ORU^R30 Point-of-Care Message Example");
console.log("=".repeat(80));
console.log();

const now = new Date();
const messageDateTime = formatDateTime(now);

// Build MSH segment
const msh = new MSH()
  .sendingApplication("POC_DEVICE")
  .sendingFacility("Bedside Lab")
  .receivingApplication("LIS")
  .receivingFacility("Main Lab")
  .dateTimeOfMessage(messageDateTime)
  .messageType({ messageCode: "ORU", triggerEvent: "R30", messageStructure: "ORU_R30" })
  .messageControlId("POC00001")
  .processingId("P")
  .versionId("2.5.1");
// Build PID segment
const pid = new PID()
  .setId("1")
  .patientIdentifierList({ id: "98765", checkDigit: "", checkDigitScheme: "", assigningAuthority: "MRN", identifierTypeCode: "MR" })
  .patientName({ familyName: "Smith", givenName: "Jane", middleName: "M" })
  .dateTimeOfBirth("19750520")
  .administrativeSex("F")
  .patientAddress({ streetAddress: "456 Oak Ave", otherDesignation: "", city: "Boston", state: "MA", zip: "02101", country: "USA" })
  .phoneNumberHome("555-9876");
// Build PV1 segment
const pv1 = new PV1()
  .setId("1")
  .patientClass("E")
  .assignedPatientLocation({ pointOfCare: "ER", room: "5", bed: "B", facility: "Main" })
  .attendingDoctor({ id: "5678", familyName: "Johnson", givenName: "Robert" })
  .admitDateTime(messageDateTime);
// Build ORC segment (Common Order - required for R30)
const orc = new ORC()
  .orderControl("NW") // New order
  .placerOrderNumber("POC12345")
  .fillerOrderNumber("")
  .orderStatus("CM") // Order completed
  .dateTimeOfTransaction(messageDateTime)
  .orderingProvider({ id: "5678", familyName: "Johnson", givenName: "Robert" });
// Build OBR segment
const obr = new OBR()
  .setId("1")
  .placerOrderNumber("POC12345")
  .fillerOrderNumber("")
  .universalServiceIdentifier({ identifier: "GLUC", text: "Glucose", nameOfCodingSystem: "LN" })
  .observationDateTime(messageDateTime)
  .orderingProvider({ id: "5678", familyName: "Johnson", givenName: "Robert" })
  .resultStatus("F");
// Build OBX segments (Point-of-care glucose test)
const obx1 = new OBX()
  .setId("1")
  .valueType("NM")
  .observationIdentifier({ identifier: "2339-0", text: "Glucose POC", nameOfCodingSystem: "LN" })
  .observationSubId("1")
  .observationValue("185")
  .units({ identifier: "mg/dL", text: "milligrams per deciliter", nameOfCodingSystem: "UCUM" })
  .referenceRange("70-100")
  .abnormalFlags("H")
  .observationResultStatus("F")
  .dateTimeOfObservation(messageDateTime);
// Build the complete ORU^R30 message
const patientResult: PatientResultR30 = {
  pid,
  pv1,
  orderObservations: [
    {
      orc,
      obr,
      obxList: [obx1],
    },
  ],
};

const message = createORU_R30(msh, [
  {
    pid,
    pv1,
    orderObservations: [{ orc, obr, observations: [obx1] }],
  },
]);

const encodedMessage = message.encode();

console.log("HL7 ORU^R30 Point-of-Care Message:");
console.log("==================================");
console.log(encodedMessage);
console.log();
console.log("Segments:");
console.log("=========");
encodedMessage.split("\r").forEach((segment, index) => {
  console.log(`${index + 1}. ${segment}`);
});
console.log();

console.log("Message Details:");
console.log("================");
console.log("Message Type: ORU^R30 (Point-of-Care Observation)");
console.log("Patient: Smith, Jane M");
console.log("MRN: 98765");
console.log("Test: Glucose POC");
console.log("Result: 185 mg/dL (HIGH - Reference: 70-100)");
console.log("Location: ER, Room 5, Bed B");
console.log("Order Control: NW (New Order)");
console.log();

console.log("Use Case:");
console.log("=========");
console.log("This ORU^R30 message represents a point-of-care glucose test");
console.log("performed at the bedside in the Emergency Room. The result is");
console.log(
  "transmitted immediately to the Laboratory Information System (LIS)",
);
console.log("without a pre-existing order, instructing the system to create");
console.log("a new order for this observation.");
console.log();

console.log("=".repeat(80));
console.log("Example Complete");
console.log("=".repeat(80));
