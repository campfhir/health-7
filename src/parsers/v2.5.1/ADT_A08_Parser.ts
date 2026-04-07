import { Result } from "../../types/result";
import {
  ADT_A01_Parser,
  ParsedADT_A01,
  ParsedProcedure,
  ParsedInsuranceGroup,
} from "./ADT_A01_Parser";

export type { ParsedProcedure, ParsedInsuranceGroup };
export type ParsedADT_A08 = ParsedADT_A01;

export class ADT_A08_Parser extends ADT_A01_Parser {
  protected override readonly messageName: string = "ADT_A08";
}

export function parseADT_A08(messageString: string): Result<ParsedADT_A08> {
  return new ADT_A08_Parser().parse(messageString);
}
