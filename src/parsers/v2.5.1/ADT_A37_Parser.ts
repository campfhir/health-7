/**
 * Parser for ADT^A37 messages (HL7 v2.5.1).
 *
 * @module
 */
import type { Result } from "../../types/result.ts";
import {
  ADT_A34_Parser,
  type ParsedADT_A34,
} from "./ADT_A34_Parser.ts";

/** Structured result of parsing an HL7 ADT^A37 (v2.5.1) message. */
export type ParsedADT_A37 = ParsedADT_A34;

/** Parser for HL7 ADT^A37 (v2.5.1) messages. */
export class ADT_A37_Parser extends ADT_A34_Parser {
  /** The message name value. */
  protected override readonly messageName: string = "ADT_A37";
}

/** Parses an HL7 ADT^A37 (v2.5.1) message string into a structured result. */
export function parseADT_A37(messageString: string): Result<ParsedADT_A37> {
  return new ADT_A37_Parser().parse(messageString);
}
