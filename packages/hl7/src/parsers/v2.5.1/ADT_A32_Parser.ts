import { Result } from "../../types/result.ts";
import {
  ADT_A01_Parser,
  ParsedADT_A01,
  ParsedProcedure,
  ParsedInsuranceGroup,
} from "./ADT_A01_Parser.ts";

export type { ParsedProcedure, ParsedInsuranceGroup };
/** Structured result of parsing an HL7 ADT^A32 (v2.5.1) message. */
export type ParsedADT_A32 = ParsedADT_A01;

/** Parser for HL7 ADT^A32 (v2.5.1) messages. */
export class ADT_A32_Parser extends ADT_A01_Parser {
  protected override readonly messageName: string = "ADT_A32";
}

/** Parses an HL7 ADT^A32 (v2.5.1) message string into a structured result. */
export function parseADT_A32(messageString: string): Result<ParsedADT_A32> {
  return new ADT_A32_Parser().parse(messageString);
}
