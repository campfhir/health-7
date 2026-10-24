import { MessageSchema } from "../../../src/types/schema";

/**
 * ACK - Standard Acknowledgement (HL7 v2.5.1, chapter 2 section 2.14.1): MSH, [{SFT}], MSA, [{ERR}].
 * Identical to v2.5.
 */
export const ACK_SCHEMA: MessageSchema = {
  messageType: "ACK",
  version: "2.5.1",
  structure: [
    { name: "MSH", required: true, repeating: false },
    { name: "SFT", required: false, repeating: true },
    { name: "MSA", required: true, repeating: false },
    { name: "ERR", required: false, repeating: true },
  ],
};
