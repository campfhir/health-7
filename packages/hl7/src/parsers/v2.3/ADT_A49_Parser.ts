import { Result } from "../../types/result.ts";
import {
  ADT_A34_Parser,
  ParsedADT_A34,
} from "./ADT_A34_Parser.ts";

/** Structured result of parsing an HL7 ADT^A49 (v2.3) message. */
export type ParsedADT_A49 = ParsedADT_A34;

/** Parser for HL7 ADT^A49 (v2.3) messages. */
export class ADT_A49_Parser extends ADT_A34_Parser {
  protected override readonly messageName: string = "ADT_A49";
}

/** Parses an HL7 ADT^A49 (v2.3) message string into a structured result. */
export function parseADT_A49(messageString: string): Result<ParsedADT_A49> {
  return new ADT_A49_Parser().parse(messageString);
}
