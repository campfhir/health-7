import { MSH, PID, PV1, OBR, OBX } from "../src/segments/v2.5.1/index.ts";
import { createORU_R01, type PatientResult } from "../src/builders/v2.5.1/ORU_R01.ts";

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

const obx3 = new OBX()
  .setId("3")
  .valueType("NM")
  .observationIdentifier({ identifier: "6690-2", text: "WBC", nameOfCodingSystem: "LN" })
  .observationSubId("1")
  .observationValue("7.8")
  .units({ identifier: "10*3/uL", text: "thousand per microliter", nameOfCodingSystem: "UCUM" })
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
