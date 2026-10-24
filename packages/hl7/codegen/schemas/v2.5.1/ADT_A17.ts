import { MessageSchema } from "../../../src/types/schema";
import { ADT_A17_SCHEMA as A17_V23 } from "../v2.3/ADT_A17";

/**
 * ADT^A17 - Swap Patients (HL7 v2.5.1). Same as v2.3 apart from the optional [{SFT}]
 * after MSH, which the v2.5.1 ADT messages in this library do not model yet.
 * Source: https://hl7-definition.caristix.com/v2/HL7v2.5.1/TriggerEvents/ADT_A17
 */
export const ADT_A17_SCHEMA: MessageSchema = { ...A17_V23, version: "2.5.1" };
