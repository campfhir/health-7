/**
 * Parser for ADT^A43 messages (HL7 v2.3).
 *
 * @module
 */
import type { Result } from "../../types/result.ts";
import {
  ADT_A34_Parser,
  type ParsedADT_A34,
} from "./ADT_A34_Parser.ts";

/** Structured result of parsing an HL7 ADT^A43 (v2.3) message. */
export type ParsedADT_A43 = ParsedADT_A34;

/** Parser for HL7 ADT^A43 (v2.3) messages. */
export class ADT_A43_Parser extends ADT_A34_Parser {
  /** The message name value. */
  protected override readonly messageName: string = "ADT_A43";
}

/** Parses an HL7 ADT^A43 (v2.3) message string into a structured result. */
export function parseADT_A43(messageString: string): Result<ParsedADT_A43> {
  return new ADT_A43_Parser().parse(messageString);
}
