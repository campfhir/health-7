import { Result } from "../../types/result";
import {
  ADT_A01_Parser,
  ParsedADT_A01,
  ParsedProcedure,
  ParsedInsuranceGroup,
} from "./ADT_A01_Parser";

export type { ParsedProcedure, ParsedInsuranceGroup };
export type ParsedADT_A09 = ParsedADT_A01;

export class ADT_A09_Parser extends ADT_A01_Parser {
  protected override readonly messageName: string = "ADT_A09";
}

export function parseADT_A09(messageString: string): Result<ParsedADT_A09> {
  return new ADT_A09_Parser().parse(messageString);
}
