import { MessageSchema } from "../../../src/types/schema";

/**
 * ACK - General Acknowledgment (HL7 v2.3, chapter 2 section 2.13.1).
 * Has no trigger event of its own: MSH-9 echoes the event of the message being acknowledged.
 */
export const ACK_SCHEMA: MessageSchema = {
  messageType: "ACK",
  version: "2.3",
  structure: [
    { name: "MSH", required: true, repeating: false },
    { name: "MSA", required: true, repeating: false },
    { name: "ERR", required: false, repeating: false },
  ],
};
