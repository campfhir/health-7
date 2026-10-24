import { MessageSchema } from "../../../src/types/schema";
import { ADT_A28_SCHEMA } from "./ADT_A28";

/**
 * ADT^A01 - Admit/Visit Notification (HL7 v2.3)
 * Same structure as A28; trigger event is the distinguishing factor.
 */
export const ADT_A01_SCHEMA: MessageSchema = {
  ...ADT_A28_SCHEMA,
  triggerEvent: "A01",
};

export const ADT_A02_SCHEMA: MessageSchema = { ...ADT_A01_SCHEMA, triggerEvent: "A02", baseMessage: "ADT_A01" };
export const ADT_A03_SCHEMA: MessageSchema = { ...ADT_A01_SCHEMA, triggerEvent: "A03", baseMessage: "ADT_A01" };
export const ADT_A04_SCHEMA: MessageSchema = { ...ADT_A01_SCHEMA, triggerEvent: "A04", baseMessage: "ADT_A01" };
export const ADT_A05_SCHEMA: MessageSchema = { ...ADT_A01_SCHEMA, triggerEvent: "A05", baseMessage: "ADT_A01" };
export const ADT_A06_SCHEMA: MessageSchema = { ...ADT_A01_SCHEMA, triggerEvent: "A06", baseMessage: "ADT_A01" };
export const ADT_A07_SCHEMA: MessageSchema = { ...ADT_A01_SCHEMA, triggerEvent: "A07", baseMessage: "ADT_A01" };
export const ADT_A08_SCHEMA: MessageSchema = { ...ADT_A01_SCHEMA, triggerEvent: "A08", baseMessage: "ADT_A01" };
export const ADT_A09_SCHEMA: MessageSchema = { ...ADT_A01_SCHEMA, triggerEvent: "A09", baseMessage: "ADT_A01" };
export const ADT_A10_SCHEMA: MessageSchema = { ...ADT_A01_SCHEMA, triggerEvent: "A10", baseMessage: "ADT_A01" };
export const ADT_A11_SCHEMA: MessageSchema = { ...ADT_A01_SCHEMA, triggerEvent: "A11", baseMessage: "ADT_A01" };
export const ADT_A12_SCHEMA: MessageSchema = { ...ADT_A01_SCHEMA, triggerEvent: "A12", baseMessage: "ADT_A01" };
export const ADT_A13_SCHEMA: MessageSchema = { ...ADT_A01_SCHEMA, triggerEvent: "A13", baseMessage: "ADT_A01" };
export const ADT_A14_SCHEMA: MessageSchema = { ...ADT_A01_SCHEMA, triggerEvent: "A14", baseMessage: "ADT_A01" };
export const ADT_A15_SCHEMA: MessageSchema = { ...ADT_A01_SCHEMA, triggerEvent: "A15", baseMessage: "ADT_A01" };
export const ADT_A16_SCHEMA: MessageSchema = { ...ADT_A01_SCHEMA, triggerEvent: "A16", baseMessage: "ADT_A01" };
export const ADT_A21_SCHEMA: MessageSchema = { ...ADT_A01_SCHEMA, triggerEvent: "A21", baseMessage: "ADT_A01" };
export const ADT_A22_SCHEMA: MessageSchema = { ...ADT_A01_SCHEMA, triggerEvent: "A22", baseMessage: "ADT_A01" };
export const ADT_A23_SCHEMA: MessageSchema = { ...ADT_A01_SCHEMA, triggerEvent: "A23", baseMessage: "ADT_A01" };
export const ADT_A25_SCHEMA: MessageSchema = { ...ADT_A01_SCHEMA, triggerEvent: "A25", baseMessage: "ADT_A01" };
export const ADT_A26_SCHEMA: MessageSchema = { ...ADT_A01_SCHEMA, triggerEvent: "A26", baseMessage: "ADT_A01" };
export const ADT_A27_SCHEMA: MessageSchema = { ...ADT_A01_SCHEMA, triggerEvent: "A27", baseMessage: "ADT_A01" };
export const ADT_A29_SCHEMA: MessageSchema = { ...ADT_A01_SCHEMA, triggerEvent: "A29", baseMessage: "ADT_A01" };
export const ADT_A31_SCHEMA: MessageSchema = { ...ADT_A01_SCHEMA, triggerEvent: "A31", baseMessage: "ADT_A01" };
export const ADT_A38_SCHEMA: MessageSchema = { ...ADT_A01_SCHEMA, triggerEvent: "A38", baseMessage: "ADT_A01" };
