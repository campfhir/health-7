/**
 * Parser for ADT^A22 messages (HL7 v2.5.1).
 *
 * @module
 */
import type { Result } from "../../types/result.ts";
import {
  ADT_A01_Parser,
  type ParsedADT_A01,
  type ParsedProcedure,
  type ParsedInsuranceGroup,
} from "./ADT_A01_Parser.ts";

export type { ParsedProcedure, ParsedInsuranceGroup };
/** Structured result of parsing an HL7 ADT^A22 (v2.5.1) message. */
export type ParsedADT_A22 = ParsedADT_A01;

/** Parser for HL7 ADT^A22 (v2.5.1) messages. */
export class ADT_A22_Parser extends ADT_A01_Parser {
  /** The message name value. */
  protected override readonly messageName: string = "ADT_A22";
}

/** Parses an HL7 ADT^A22 (v2.5.1) message string into a structured result. */
export function parseADT_A22(messageString: string): Result<ParsedADT_A22> {
  return new ADT_A22_Parser().parse(messageString);
}
