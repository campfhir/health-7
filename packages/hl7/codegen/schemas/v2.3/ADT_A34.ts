import { MessageSchema } from "../../../src/types/schema";

/**
 * ADT^A34 - Merge Patient Information – Patient ID Only (HL7 v2.3)
 * Base schema for merge/link/move messages that require a MRG segment.
 */
export const ADT_A34_SCHEMA: MessageSchema = {
  messageType: "ADT",
  triggerEvent: "A34",
  version: "2.3",
  structure: [
    { name: "MSH", required: true,  repeating: false },
    { name: "EVN", required: true,  repeating: false },
    { name: "PID", required: true,  repeating: false },
    { name: "PD1", required: false, repeating: false },
    { name: "MRG", required: true,  repeating: false },
    { name: "PV1", required: false, repeating: false },
  ],
};

export const ADT_A18_SCHEMA: MessageSchema = { ...ADT_A34_SCHEMA, triggerEvent: "A18", baseMessage: "ADT_A34" };
export const ADT_A30_SCHEMA: MessageSchema = { ...ADT_A34_SCHEMA, triggerEvent: "A30", baseMessage: "ADT_A34" };
export const ADT_A35_SCHEMA: MessageSchema = { ...ADT_A34_SCHEMA, triggerEvent: "A35", baseMessage: "ADT_A34" };
export const ADT_A36_SCHEMA: MessageSchema = { ...ADT_A34_SCHEMA, triggerEvent: "A36", baseMessage: "ADT_A34" };
export const ADT_A37_SCHEMA: MessageSchema = { ...ADT_A34_SCHEMA, triggerEvent: "A37", baseMessage: "ADT_A34" };
export const ADT_A39_SCHEMA: MessageSchema = { ...ADT_A34_SCHEMA, triggerEvent: "A39", baseMessage: "ADT_A34" };
export const ADT_A40_SCHEMA: MessageSchema = { ...ADT_A34_SCHEMA, triggerEvent: "A40", baseMessage: "ADT_A34" };
export const ADT_A41_SCHEMA: MessageSchema = { ...ADT_A34_SCHEMA, triggerEvent: "A41", baseMessage: "ADT_A34" };
export const ADT_A42_SCHEMA: MessageSchema = { ...ADT_A34_SCHEMA, triggerEvent: "A42", baseMessage: "ADT_A34" };
export const ADT_A43_SCHEMA: MessageSchema = { ...ADT_A34_SCHEMA, triggerEvent: "A43", baseMessage: "ADT_A34" };
export const ADT_A44_SCHEMA: MessageSchema = { ...ADT_A34_SCHEMA, triggerEvent: "A44", baseMessage: "ADT_A34" };
export const ADT_A45_SCHEMA: MessageSchema = { ...ADT_A34_SCHEMA, triggerEvent: "A45", baseMessage: "ADT_A34" };
export const ADT_A46_SCHEMA: MessageSchema = { ...ADT_A34_SCHEMA, triggerEvent: "A46", baseMessage: "ADT_A34" };
export const ADT_A47_SCHEMA: MessageSchema = { ...ADT_A34_SCHEMA, triggerEvent: "A47", baseMessage: "ADT_A34" };
export const ADT_A48_SCHEMA: MessageSchema = { ...ADT_A34_SCHEMA, triggerEvent: "A48", baseMessage: "ADT_A34" };
export const ADT_A49_SCHEMA: MessageSchema = { ...ADT_A34_SCHEMA, triggerEvent: "A49", baseMessage: "ADT_A34" };
// A50/A51 (change visit number / alternate visit ID) require PV1: MSH EVN PID [PD1] MRG PV1
// (hl7-definition.caristix.com, v2.3 ADT_A50/ADT_A51). Like A18 they reuse the A34 builder,
// which accepts PV1 as an option.
export const ADT_A50_SCHEMA: MessageSchema = { ...ADT_A34_SCHEMA, triggerEvent: "A50", baseMessage: "ADT_A34" };
export const ADT_A51_SCHEMA: MessageSchema = { ...ADT_A34_SCHEMA, triggerEvent: "A51", baseMessage: "ADT_A34" };
