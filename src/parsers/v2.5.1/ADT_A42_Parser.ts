/**
 * Parser for ADT^A42 messages (HL7 v2.5.1).
 *
 * @module
 */
import type { Result } from "../../types/result.ts";
import {
  ADT_A34_Parser,
  type ParsedADT_A34,
} from "./ADT_A34_Parser.ts";

/** Structured result of parsing an HL7 ADT^A42 (v2.5.1) message. */
export type ParsedADT_A42 = ParsedADT_A34;

/** Parser for HL7 ADT^A42 (v2.5.1) messages. */
export class ADT_A42_Parser extends ADT_A34_Parser {
  /** The message name value. */
  protected override readonly messageName: string = "ADT_A42";
}

/** Parses an HL7 ADT^A42 (v2.5.1) message string into a structured result. */
export function parseADT_A42(messageString: string): Result<ParsedADT_A42> {
  return new ADT_A42_Parser().parse(messageString);
}
