import { MessageSchema } from "../../../src/types/schema";

/**
 * SIU^S12 - Notification of New Appointment Booking (HL7 v2.3)
 * S13: Rescheduling  S14: Modification  S15: Cancellation
 * S16: Discontinuation  S17: Deletion  S26: Patient No-Show
 *
 * All SIU trigger events share the same message structure.
 */
export const SIU_S12_SCHEMA: MessageSchema = {
  messageType: "SIU",
  triggerEvent: "S12",
  version: "2.3",
  structure: [
    { name: "MSH", required: true, repeating: false },
    { name: "SCH", required: true, repeating: false },
    { name: "NTE", required: false, repeating: true },
    {
      name: "PATIENT",
      required: false,
      repeating: true,
      exportTypeName: "ParsedSIUPatient",
      segments: [
        { name: "PID", required: true, repeating: false },
        { name: "PD1", required: false, repeating: false },
        { name: "PV1", required: false, repeating: false },
        { name: "PV2", required: false, repeating: false },
        { name: "OBX", required: false, repeating: true },
        { name: "DG1", required: false, repeating: true },
      ],
    },
    {
      name: "RESOURCES",
      required: true,
      repeating: true,
      exportTypeName: "ParsedSIUResources",
      segments: [
        { name: "RGS", required: true, repeating: false },
        {
          name: "SERVICE",
          required: false,
          repeating: true,
          exportTypeName: "ParsedSIUService",
          segments: [
            { name: "AIS", required: true, repeating: false },
            { name: "NTE", required: false, repeating: true },
          ],
        },
        {
          name: "GENERAL_RESOURCE",
          required: false,
          repeating: true,
          exportTypeName: "ParsedSIUGeneralResource",
          segments: [
            { name: "AIG", required: true, repeating: false },
            { name: "NTE", required: false, repeating: true },
          ],
        },
        {
          name: "LOCATION_RESOURCE",
          required: false,
          repeating: true,
          exportTypeName: "ParsedSIULocationResource",
          segments: [
            { name: "AIL", required: true, repeating: false },
            { name: "NTE", required: false, repeating: true },
          ],
        },
        {
          name: "PERSONNEL_RESOURCE",
          required: false,
          repeating: true,
          exportTypeName: "ParsedSIUPersonnelResource",
          segments: [
            { name: "AIP", required: true, repeating: false },
            { name: "NTE", required: false, repeating: true },
          ],
        },
      ],
    },
  ],
};

export const SIU_S13_SCHEMA: MessageSchema = { ...SIU_S12_SCHEMA, triggerEvent: "S13" };
export const SIU_S14_SCHEMA: MessageSchema = { ...SIU_S12_SCHEMA, triggerEvent: "S14" };
export const SIU_S15_SCHEMA: MessageSchema = { ...SIU_S12_SCHEMA, triggerEvent: "S15" };
export const SIU_S16_SCHEMA: MessageSchema = { ...SIU_S12_SCHEMA, triggerEvent: "S16" };
export const SIU_S17_SCHEMA: MessageSchema = { ...SIU_S12_SCHEMA, triggerEvent: "S17" };
export const SIU_S26_SCHEMA: MessageSchema = { ...SIU_S12_SCHEMA, triggerEvent: "S26" };
