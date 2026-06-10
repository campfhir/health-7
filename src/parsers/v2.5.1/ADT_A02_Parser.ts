/**
 * Parser for ADT^A02 messages (HL7 v2.5.1).
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
/** Structured result of parsing an HL7 ADT^A02 (v2.5.1) message. */
export type ParsedADT_A02 = ParsedADT_A01;

/** Parser for HL7 ADT^A02 (v2.5.1) messages. */
export class ADT_A02_Parser extends ADT_A01_Parser {
  /** The message name value. */
  protected override readonly messageName: string = "ADT_A02";
}

/** Parses an HL7 ADT^A02 (v2.5.1) message string into a structured result. */
export function parseADT_A02(messageString: string): Result<ParsedADT_A02> {
  return new ADT_A02_Parser().parse(messageString);
}
