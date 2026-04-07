import { Result } from "../../types/result";
import {
  ADT_A01_Parser,
  ParsedADT_A01,
  ParsedProcedure,
  ParsedInsuranceGroup,
} from "./ADT_A01_Parser";

export type { ParsedProcedure, ParsedInsuranceGroup };
export type ParsedADT_A21 = ParsedADT_A01;

export class ADT_A21_Parser extends ADT_A01_Parser {
  protected override readonly messageName: string = "ADT_A21";
}

export function parseADT_A21(messageString: string): Result<ParsedADT_A21> {
  return new ADT_A21_Parser().parse(messageString);
}
