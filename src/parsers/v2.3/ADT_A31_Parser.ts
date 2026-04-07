import { Result } from "../../types/result";
import {
  ADT_A01_Parser,
  ParsedADT_A01,
  ParsedProcedure,
  ParsedInsuranceGroup,
} from "./ADT_A01_Parser";

export type { ParsedProcedure, ParsedInsuranceGroup };
export type ParsedADT_A31 = ParsedADT_A01;

export class ADT_A31_Parser extends ADT_A01_Parser {
  protected override readonly messageName: string = "ADT_A31";
}

export function parseADT_A31(messageString: string): Result<ParsedADT_A31> {
  return new ADT_A31_Parser().parse(messageString);
}
