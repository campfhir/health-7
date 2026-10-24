import { MessageSchema } from "../../../src/types/schema";

/**
 * ORR^O02 - General Order Response (HL7 v2.5.1, chapter 4 section 4.4.2). Identical to v2.5:
 * ERR repeats, and each ORC is followed by one order detail segment (OBR, RQD, RQ1, RXO, ODS or ODT).
 */
export const ORR_O02_SCHEMA: MessageSchema = {
  messageType: "ORR",
  triggerEvent: "O02",
  version: "2.5.1",
  structure: [
    { name: "MSH", required: true, repeating: false },
    { name: "MSA", required: true, repeating: false },
    { name: "ERR", required: false, repeating: true },
    { name: "NTE", required: false, repeating: true },
    {
      name: "RESPONSE",
      required: false,
      repeating: false,
      segments: [
        {
          name: "PATIENT",
          exportTypeName: "ParsedResponsePatient",
          required: false,
          repeating: false,
          segments: [
            { name: "PID", required: true, repeating: false },
            { name: "NTE", required: false, repeating: true },
          ],
        },
        {
          name: "ORDER",
          exportTypeName: "ParsedResponseOrder",
          required: true,
          repeating: true,
          segments: [
            { name: "ORC", required: true, repeating: false },
            {
              name: "ORDER_DETAIL",
              exportTypeName: "ParsedResponseDetail",
              required: true,
              repeating: false,
              segments: [
                { name: "OBR", required: false, repeating: false },
                { name: "RQD", required: false, repeating: false },
                { name: "RQ1", required: false, repeating: false },
                { name: "RXO", required: false, repeating: false },
                { name: "ODS", required: false, repeating: false },
                { name: "ODT", required: false, repeating: false },
                { name: "NTE", required: false, repeating: true },
                { name: "CTI", required: false, repeating: true },
              ],
            },
          ],
        },
      ],
    },
  ],
};
