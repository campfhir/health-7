/**
 * Parser for ADT^A47 messages (HL7 v2.5.1).
 *
 * @module
 */
import type { Result } from "../../types/result.ts";
import {
  ADT_A34_Parser,
  type ParsedADT_A34,
} from "./ADT_A34_Parser.ts";

/** Structured result of parsing an HL7 ADT^A47 (v2.5.1) message. */
export type ParsedADT_A47 = ParsedADT_A34;

/** Parser for HL7 ADT^A47 (v2.5.1) messages. */
export class ADT_A47_Parser extends ADT_A34_Parser {
  /** The message name value. */
  protected override readonly messageName: string = "ADT_A47";
}

/** Parses an HL7 ADT^A47 (v2.5.1) message string into a structured result. */
export function parseADT_A47(messageString: string): Result<ParsedADT_A47> {
  return new ADT_A47_Parser().parse(messageString);
}
