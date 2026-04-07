import { Result } from "../../types/result";
import {
  ADT_A01_Parser,
  ParsedADT_A01,
  ParsedProcedure,
  ParsedInsuranceGroup,
} from "./ADT_A01_Parser";

export type { ParsedProcedure, ParsedInsuranceGroup };
export type ParsedADT_A22 = ParsedADT_A01;

export class ADT_A22_Parser extends ADT_A01_Parser {
  protected override readonly messageName: string = "ADT_A22";
}

export function parseADT_A22(messageString: string): Result<ParsedADT_A22> {
  return new ADT_A22_Parser().parse(messageString);
}
