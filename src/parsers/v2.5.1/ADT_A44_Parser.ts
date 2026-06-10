/**
 * Parser for ADT^A44 messages (HL7 v2.5.1).
 *
 * @module
 */
import type { Result } from "../../types/result.ts";
import {
  ADT_A34_Parser,
  type ParsedADT_A34,
} from "./ADT_A34_Parser.ts";

/** Structured result of parsing an HL7 ADT^A44 (v2.5.1) message. */
export type ParsedADT_A44 = ParsedADT_A34;

/** Parser for HL7 ADT^A44 (v2.5.1) messages. */
export class ADT_A44_Parser extends ADT_A34_Parser {
  /** The message name value. */
  protected override readonly messageName: string = "ADT_A44";
}

/** Parses an HL7 ADT^A44 (v2.5.1) message string into a structured result. */
export function parseADT_A44(messageString: string): Result<ParsedADT_A44> {
  return new ADT_A44_Parser().parse(messageString);
}
