/**
 * Parser for ADT^A38 messages (HL7 v2.3).
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
/** Structured result of parsing an HL7 ADT^A38 (v2.3) message. */
export type ParsedADT_A38 = ParsedADT_A01;

/** Parser for HL7 ADT^A38 (v2.3) messages. */
export class ADT_A38_Parser extends ADT_A01_Parser {
  /** The message name value. */
  protected override readonly messageName: string = "ADT_A38";
}

/** Parses an HL7 ADT^A38 (v2.3) message string into a structured result. */
export function parseADT_A38(messageString: string): Result<ParsedADT_A38> {
  return new ADT_A38_Parser().parse(messageString);
}
