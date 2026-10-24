import { MessageSchema } from "../../../src/types/schema";

/**
 * VXU^V04 - Unsolicited Vaccination Update (HL7 v2.5.1, identical to v2.5). Compared with v2.4:
 * [{SFT}] is new, ORC is required, and ORC is followed by an optional TIMING group.
 */
export const VXU_V04_SCHEMA: MessageSchema = {
  messageType: "VXU",
  triggerEvent: "V04",
  version: "2.5.1",
  structure: [
    { name: "MSH", required: true, repeating: false },
    { name: "SFT", required: false, repeating: true },
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
        { name: "ORC", required: true, repeating: false },
        {
          name: "TIMING",
          required: false,
          repeating: true,
          segments: [
            { name: "TQ1", required: true, repeating: false },
            { name: "TQ2", required: false, repeating: true },
          ],
        },
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
