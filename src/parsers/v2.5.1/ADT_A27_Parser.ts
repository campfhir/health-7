import { Result } from "../../types/result";
import {
  ADT_A01_Parser,
  ParsedADT_A01,
  ParsedProcedure,
  ParsedInsuranceGroup,
} from "./ADT_A01_Parser";

export type { ParsedProcedure, ParsedInsuranceGroup };
export type ParsedADT_A27 = ParsedADT_A01;

export class ADT_A27_Parser extends ADT_A01_Parser {
  protected override readonly messageName: string = "ADT_A27";
}

export function parseADT_A27(messageString: string): Result<ParsedADT_A27> {
  return new ADT_A27_Parser().parse(messageString);
}
