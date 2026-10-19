import { MessageSchema } from "../../../src/types/schema";

/**
 * ORR^O02 - General Order Response (HL7 v2.3, chapter 4 section 4.2.2).
 *
 * The order detail slot is a choice of OBR, RQD, RQ1, RXO, ODS or ODT; the schema lists
 * all six as optional so codegen wires up a parse method for each.
 */
export const ORR_O02_SCHEMA: MessageSchema = {
  messageType: "ORR",
  triggerEvent: "O02",
  version: "2.3",
  structure: [
    { name: "MSH", required: true, repeating: false },
    { name: "MSA", required: true, repeating: false },
    { name: "ERR", required: false, repeating: false },
    { name: "NTE", required: false, repeating: true },
    {
      name: "RESPONSE",
      required: false,
      repeating: false,
      segments: [
        { name: "PID", required: false, repeating: false },
        { name: "NTE", required: false, repeating: true },
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
                { name: "CTI", required: false, repeating: true },
              ],
            },
          ],
        },
      ],
    },
  ],
};
