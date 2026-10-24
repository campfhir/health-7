import { MessageSchema } from "../../../src/types/schema";
import { ADT_A24_SCHEMA as A24_V23 } from "../v2.3/ADT_A24";

/**
 * ADT^A24 - Link Patient Information (HL7 v2.5.1). Same as v2.3 apart from the optional
 * [{SFT}] after MSH, which the v2.5.1 ADT messages in this library do not model yet.
 * Source: https://hl7-definition.caristix.com/v2/HL7v2.5.1/TriggerEvents/ADT_A24
 */
export const ADT_A24_SCHEMA: MessageSchema = { ...A24_V23, version: "2.5.1" };
