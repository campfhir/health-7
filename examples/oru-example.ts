import { MSH, PID, PV1, OBR, OBX, createORU_R01, PatientResult } from "../src";

function formatDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

const now = new Date();
const messageDateTime = formatDateTime(now);

const msh = new MSH()
  .sendingApplication("LAB")
  .sendingFacility("General Hospital")
  .receivingApplication("EMR")
  .receivingFacility("Main Campus")
  .dateTimeOfMessage(messageDateTime)
  .messageType("ORU", "R01", "ORU_R01")
  .messageControlId("MSG00001")
  .processingId("P")
  .versionId("2.5.1");

const pid = new PID()
  .setId("1")
  .patientIdentifierList("12345", "", "", "MRN", "MR")
  .patientName("Doe", "John", "Q")
  .dateTimeOfBirth("19800115")
  .administrativeSex("M")
  .patientAddress("123 Main St", "", "Springfield", "IL", "62701", "USA")
  .phoneNumberHome("555-1234");

const pv1 = new PV1()
  .setId("1")
  .patientClass("I")
  .assignedPatientLocation("ICU", "101", "A", "Main")
  .attendingDoctor("1234", "Smith", "Jane")
  .admitDateTime(messageDateTime);

const obr = new OBR()
  .setId("1")
  .placerOrderNumber("ORD123456")
  .fillerOrderNumber("LAB987654")
  .universalServiceIdentifier("CBC", "Complete Blood Count", "LN")
  .observationDateTime(messageDateTime)
  .orderingProvider("1234", "Smith", "Jane")
  .resultStatus("F");

const obx1 = new OBX()
  .setId("1")
  .valueType("NM")
  .observationIdentifier("718-7", "Hemoglobin", "LN")
  .observationSubId("1")
  .observationValue("15.5")
  .units("g/dL", "grams per deciliter", "UCUM")
  .referenceRange("13.5-17.5")
  .observationResultStatus("F")
  .dateTimeOfObservation(messageDateTime);

const obx2 = new OBX()
  .setId("2")
  .valueType("NM")
  .observationIdentifier("789-8", "RBC", "LN")
  .observationSubId("1")
  .observationValue("5.2")
  .units("10*6/uL", "million per microliter", "UCUM")
  .referenceRange("4.5-5.9")
  .observationResultStatus("F")
  .dateTimeOfObservation(messageDateTime);

const obx3 = new OBX()
  .setId("3")
  .valueType("NM")
  .observationIdentifier("6690-2", "WBC", "LN")
  .observationSubId("1")
  .observationValue("7.8")
  .units("10*3/uL", "thousand per microliter", "UCUM")
  .referenceRange("4.5-11.0")
  .observationResultStatus("F")
  .dateTimeOfObservation(messageDateTime);

const patientResult: PatientResult = {
  pid,
  pv1,
  orderObservations: [
    {
      obr,
      obxList: [obx1, obx2, obx3],
    },
  ],
};

const message = createORU_R01(msh, [patientResult]);

const encodedMessage = message.encode();

console.log("HL7 ORU_R01 Message:");
console.log("====================");
console.log(encodedMessage);
console.log("\n\nSegments:");
console.log("=========");
encodedMessage.split("\r").forEach((segment, index) => {
  console.log(`${index + 1}. ${segment}`);
});
