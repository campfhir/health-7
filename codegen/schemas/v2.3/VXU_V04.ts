import { MessageSchema } from "../../../src/types/schema";

/**
 * VXU^V04 - Unsolicited Vaccination Record Update (HL7 v2.3, chapter 4 section 4.12.4).
 * v2.3.1 is identical; v2.4 adds [{GT1}] after the visit group.
 */
export const VXU_V04_SCHEMA: MessageSchema = {
  messageType: "VXU",
  triggerEvent: "V04",
  version: "2.3",
  structure: [
    { name: "MSH", required: true, repeating: false },
    { name: "PID", required: true, repeating: false },
    { name: "PD1", required: false, repeating: false },
    { name: "NK1", required: false, repeating: true },
    {
      name: "PATIENT",
      exportTypeName: "ParsedVisit",
      required: false,
      repeating: false,
      segments: [
        { name: "PV1", required: true, repeating: false },
        { name: "PV2", required: false, repeating: false },
      ],
    },
    { name: "GT1", required: false, repeating: true },
    {
      name: "INSURANCE",
      exportTypeName: "ParsedInsurance",
      required: false,
      repeating: true,
      segments: [
        { name: "IN1", required: true, repeating: false },
        { name: "IN2", required: false, repeating: false },
        { name: "IN3", required: false, repeating: false },
      ],
    },
    {
      name: "ORDER",
      exportTypeName: "ParsedVaccination",
      required: false,
      repeating: true,
      segments: [
        { name: "ORC", required: false, repeating: false },
        { name: "RXA", required: true, repeating: false },
        { name: "RXR", required: false, repeating: false },
        {
          name: "OBSERVATION",
          required: false,
          repeating: true,
          segments: [
            { name: "OBX", required: true, repeating: false },
            { name: "NTE", required: false, repeating: true },
          ],
        },
      ],
    },
  ],
};
