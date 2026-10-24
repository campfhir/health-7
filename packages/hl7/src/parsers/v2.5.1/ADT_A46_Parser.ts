import { Result } from "../../types/result.ts";
import {
  ADT_A34_Parser,
  ParsedADT_A34,
} from "./ADT_A34_Parser.ts";

/** Structured result of parsing an HL7 ADT^A46 (v2.5.1) message. */
export type ParsedADT_A46 = ParsedADT_A34;

/** Parser for HL7 ADT^A46 (v2.5.1) messages. */
export class ADT_A46_Parser extends ADT_A34_Parser {
  protected override readonly messageName: string = "ADT_A46";
}

/** Parses an HL7 ADT^A46 (v2.5.1) message string into a structured result. */
export function parseADT_A46(messageString: string): Result<ParsedADT_A46> {
  return new ADT_A46_Parser().parse(messageString);
}
