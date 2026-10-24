import { Result } from "../../types/result.ts";
import {
  ADT_A34_Parser,
  ParsedADT_A34,
} from "./ADT_A34_Parser.ts";

/** Structured result of parsing an HL7 ADT^A48 (v2.5.1) message. */
export type ParsedADT_A48 = ParsedADT_A34;

/** Parser for HL7 ADT^A48 (v2.5.1) messages. */
export class ADT_A48_Parser extends ADT_A34_Parser {
  protected override readonly messageName: string = "ADT_A48";
}

/** Parses an HL7 ADT^A48 (v2.5.1) message string into a structured result. */
export function parseADT_A48(messageString: string): Result<ParsedADT_A48> {
  return new ADT_A48_Parser().parse(messageString);
}
