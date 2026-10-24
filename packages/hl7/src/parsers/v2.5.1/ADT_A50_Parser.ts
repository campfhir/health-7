import { Result } from "../../types/result.ts";
import {
  ADT_A34_Parser,
  ParsedADT_A34,
} from "./ADT_A34_Parser.ts";

/** Structured result of parsing an HL7 ADT^A50 (v2.5.1) message. */
export type ParsedADT_A50 = ParsedADT_A34;

/** Parser for HL7 ADT^A50 (v2.5.1) messages. */
export class ADT_A50_Parser extends ADT_A34_Parser {
  protected override readonly messageName: string = "ADT_A50";
}

/** Parses an HL7 ADT^A50 (v2.5.1) message string into a structured result. */
export function parseADT_A50(messageString: string): Result<ParsedADT_A50> {
  return new ADT_A50_Parser().parse(messageString);
}
