import { Result } from "../../types/result";
import {
  ADT_A01_Parser,
  ParsedADT_A01,
  ParsedProcedure,
  ParsedInsuranceGroup,
} from "./ADT_A01_Parser";

export type { ParsedProcedure, ParsedInsuranceGroup };
export type ParsedADT_A07 = ParsedADT_A01;

export class ADT_A07_Parser extends ADT_A01_Parser {
  protected override readonly messageName: string = "ADT_A07";
}

export function parseADT_A07(messageString: string): Result<ParsedADT_A07> {
  return new ADT_A07_Parser().parse(messageString);
}
