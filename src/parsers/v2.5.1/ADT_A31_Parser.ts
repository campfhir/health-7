/**
 * Parser for ADT^A31 messages (HL7 v2.5.1).
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
/** Structured result of parsing an HL7 ADT^A31 (v2.5.1) message. */
export type ParsedADT_A31 = ParsedADT_A01;

/** Parser for HL7 ADT^A31 (v2.5.1) messages. */
export class ADT_A31_Parser extends ADT_A01_Parser {
  /** The message name value. */
  protected override readonly messageName: string = "ADT_A31";
}

/** Parses an HL7 ADT^A31 (v2.5.1) message string into a structured result. */
export function parseADT_A31(messageString: string): Result<ParsedADT_A31> {
  return new ADT_A31_Parser().parse(messageString);
}
