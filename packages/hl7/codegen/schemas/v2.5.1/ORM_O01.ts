import { MessageSchema } from "../../../src/types/schema";

/**
 * ORM^O01 - General Order Message (HL7 v2.5.1, chapter 4 section 4.4.1). Identical to v2.5:
 * compared with v2.3 it adds [CTD] to the order detail and [{FT1}] to the order, and IN3 repeats.
 */
export const ORM_O01_SCHEMA: MessageSchema = {
  messageType: "ORM",
  triggerEvent: "O01",
  version: "2.5.1",
  structure: [
    { name: "MSH", required: true, repeating: false },
    { name: "NTE", required: false, repeating: true },
    {
      name: "PATIENT",
      exportTypeName: "ParsedOrderPatient",
      required: false,
      repeating: false,
      segments: [
        { name: "PID", required: true, repeating: false },
        { name: "PD1", required: false, repeating: false },
        { name: "NTE", required: false, repeating: true },
        {
          name: "PATIENT_VISIT",
          exportTypeName: "ParsedVisit",
          required: false,
          repeating: false,
          segments: [
            { name: "PV1", required: true, repeating: false },
            { name: "PV2", required: false, repeating: false },
          ],
        },
        {
          name: "INSURANCE",
          exportTypeName: "ParsedInsurance",
          required: false,
          repeating: true,
          segments: [
            { name: "IN1", required: true, repeating: false },
            { name: "IN2", required: false, repeating: false },
            { name: "IN3", required: false, repeating: true },
          ],
        },
        { name: "GT1", required: false, repeating: false },
        { name: "AL1", required: false, repeating: true },
      ],
    },
    {
      name: "ORDER",
      required: true,
      repeating: true,
      segments: [
        { name: "ORC", required: true, repeating: false },
        {
          name: "ORDER_DETAIL",
          required: false,
          repeating: false,
          segments: [
            { name: "OBR", required: false, repeating: false },
            { name: "RQD", required: false, repeating: false },
            { name: "RQ1", required: false, repeating: false },
            { name: "RXO", required: false, repeating: false },
            { name: "ODS", required: false, repeating: false },
            { name: "ODT", required: false, repeating: false },
            { name: "NTE", required: false, repeating: true },
            { name: "CTD", required: false, repeating: false },
            { name: "DG1", required: false, repeating: true },
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
        { name: "FT1", required: false, repeating: true },
        { name: "CTI", required: false, repeating: true },
        { name: "BLG", required: false, repeating: false },
      ],
    },
  ],
};
