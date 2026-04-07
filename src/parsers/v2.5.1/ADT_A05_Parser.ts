import { Result } from "../../types/result";
import {
  ADT_A01_Parser,
  ParsedADT_A01,
  ParsedProcedure,
  ParsedInsuranceGroup,
} from "./ADT_A01_Parser";

export type { ParsedProcedure, ParsedInsuranceGroup };
export type ParsedADT_A05 = ParsedADT_A01;

export class ADT_A05_Parser extends ADT_A01_Parser {
  protected override readonly messageName: string = "ADT_A05";
}

export function parseADT_A05(messageString: string): Result<ParsedADT_A05> {
  return new ADT_A05_Parser().parse(messageString);
}
