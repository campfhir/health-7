/**
 * Parser for ADT^A40 messages (HL7 v2.3).
 *
 * @module
 */
import type { Result } from "../../types/result.ts";
import {
  ADT_A34_Parser,
  type ParsedADT_A34,
} from "./ADT_A34_Parser.ts";

/** Structured result of parsing an HL7 ADT^A40 (v2.3) message. */
export type ParsedADT_A40 = ParsedADT_A34;

/** Parser for HL7 ADT^A40 (v2.3) messages. */
export class ADT_A40_Parser extends ADT_A34_Parser {
  /** The message name value. */
  protected override readonly messageName: string = "ADT_A40";
}

/** Parses an HL7 ADT^A40 (v2.3) message string into a structured result. */
export function parseADT_A40(messageString: string): Result<ParsedADT_A40> {
  return new ADT_A40_Parser().parse(messageString);
}
