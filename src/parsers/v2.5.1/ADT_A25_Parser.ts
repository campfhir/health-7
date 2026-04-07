import { Result } from "../../types/result";
import {
  ADT_A01_Parser,
  ParsedADT_A01,
  ParsedProcedure,
  ParsedInsuranceGroup,
} from "./ADT_A01_Parser";

export type { ParsedProcedure, ParsedInsuranceGroup };
export type ParsedADT_A25 = ParsedADT_A01;

export class ADT_A25_Parser extends ADT_A01_Parser {
  protected override readonly messageName: string = "ADT_A25";
}

export function parseADT_A25(messageString: string): Result<ParsedADT_A25> {
  return new ADT_A25_Parser().parse(messageString);
}
