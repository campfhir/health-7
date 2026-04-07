import { MessageSchema } from "../../../src/types/schema";

/**
 * ADT^A28 - Add Person Information (HL7 v2.3)
 * Communicates demographic and visit information for a new person record.
 */
export const ADT_A28_SCHEMA: MessageSchema = {
  messageType: "ADT",
  triggerEvent: "A28",
  version: "2.3",
  structure: [
    { name: "MSH", required: true, repeating: false },
    { name: "EVN", required: true, repeating: false },
    { name: "PID", required: true, repeating: false },
    { name: "PD1", required: false, repeating: false },
    { name: "ROL", required: false, repeating: true },
    { name: "NK1", required: false, repeating: true },
    { name: "PV1", required: true, repeating: false },
    { name: "PV2", required: false, repeating: false },
    { name: "DB1", required: false, repeating: true },
    { name: "OBX", required: false, repeating: true },
    { name: "AL1", required: false, repeating: true },
    { name: "DG1", required: false, repeating: true },
    { name: "DRG", required: false, repeating: false },
    {
      name: "PROCEDURE",
      required: false,
      repeating: true,
      segments: [
        { name: "PR1", required: true, repeating: false },
        { name: "ROL", required: false, repeating: true },
      ],
    },
    { name: "GT1", required: false, repeating: true },
    {
      name: "INSURANCE",
      required: false,
      repeating: true,
      exportTypeName: "ParsedInsuranceGroup",
      segments: [
        { name: "IN1", required: true, repeating: false },
        { name: "IN2", required: false, repeating: false },
        { name: "IN3", required: false, repeating: true },
      ],
    },
    { name: "ACC", required: false, repeating: false },
    { name: "UB1", required: false, repeating: false },
    { name: "UB2", required: false, repeating: false },
  ],
};
