import { MessageSchema } from "../../../src/types/schema";

/**
 * ADT^A24 - Link Patient Information (HL7 v2.3)
 *
 * MSH EVN PID [PD1] [PV1] [{DB1}] PID [PD1] [PV1] [{DB1}]
 *
 * The spec lists the patient segments flat, twice (the first PID is linked to the second);
 * they are modelled here as one group that occurs exactly twice.
 * Source: https://hl7-definition.caristix.com/v2/HL7v2.3/TriggerEvents/ADT_A24
 */
export const ADT_A24_SCHEMA: MessageSchema = {
  messageType: "ADT",
  triggerEvent: "A24",
  version: "2.3",
  structure: [
    { name: "MSH", required: true, repeating: false },
    { name: "EVN", required: true, repeating: false },
    {
      name: "PATIENT",
      required: true,
      repeating: true,
      maxOccurrences: 2,
      exportTypeName: "ParsedLinkedPatient",
      segments: [
        { name: "PID", required: true, repeating: false },
        { name: "PD1", required: false, repeating: false },
        { name: "PV1", required: false, repeating: false },
        { name: "DB1", required: false, repeating: true },
      ],
    },
  ],
};
