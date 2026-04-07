import { Result } from "../../types/result";
import {
  ADT_A01_Parser,
  ParsedADT_A01,
  ParsedProcedure,
  ParsedInsuranceGroup,
} from "./ADT_A01_Parser";

export type { ParsedProcedure, ParsedInsuranceGroup };
export type ParsedADT_A14 = ParsedADT_A01;

export class ADT_A14_Parser extends ADT_A01_Parser {
  protected override readonly messageName: string = "ADT_A14";
}

export function parseADT_A14(messageString: string): Result<ParsedADT_A14> {
  return new ADT_A14_Parser().parse(messageString);
}
