import { MessageSchema } from "../../../src/types/schema";

/**
 * ADT^A17 - Swap Patients (HL7 v2.3)
 *
 * MSH EVN PID [PD1] PV1 [PV2] [{DB1}] [{OBX}] PID [PD1] PV1 [PV2] [{DB1}] [{OBX}]
 *
 * The spec lists the patient segments flat, twice (once per patient swapping beds);
 * they are modelled here as one group that occurs exactly twice.
 * Source: https://hl7-definition.caristix.com/v2/HL7v2.3/TriggerEvents/ADT_A17
 */
export const ADT_A17_SCHEMA: MessageSchema = {
  messageType: "ADT",
  triggerEvent: "A17",
  version: "2.3",
  structure: [
    { name: "MSH", required: true, repeating: false },
    { name: "EVN", required: true, repeating: false },
    {
      name: "PATIENT",
      required: true,
      repeating: true,
      maxOccurrences: 2,
      exportTypeName: "ParsedSwapPatient",
      segments: [
        { name: "PID", required: true, repeating: false },
        { name: "PD1", required: false, repeating: false },
        { name: "PV1", required: true, repeating: false },
        { name: "PV2", required: false, repeating: false },
        { name: "DB1", required: false, repeating: true },
        { name: "OBX", required: false, repeating: true },
      ],
    },
  ],
};
