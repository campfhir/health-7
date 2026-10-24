/**
 * Parser for ADT^A36 messages (HL7 v2.3).
 *
 * @module
 */
import type { Result } from "../../types/result.ts";
import {
  ADT_A34_Parser,
  type ParsedADT_A34,
} from "./ADT_A34_Parser.ts";

/** Structured result of parsing an HL7 ADT^A36 (v2.3) message. */
export type ParsedADT_A36 = ParsedADT_A34;

/** Parser for HL7 ADT^A36 (v2.3) messages. */
export class ADT_A36_Parser extends ADT_A34_Parser {
  /** The message name value. */
  protected override readonly messageName: string = "ADT_A36";
}

/** Parses an HL7 ADT^A36 (v2.3) message string into a structured result. */
export function parseADT_A36(messageString: string): Result<ParsedADT_A36> {
  return new ADT_A36_Parser().parse(messageString);
}
