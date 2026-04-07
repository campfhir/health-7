import { Result } from "../../types/result";
import {
  ADT_A01_Parser,
  ParsedADT_A01,
  ParsedProcedure,
  ParsedInsuranceGroup,
} from "./ADT_A01_Parser";

export type { ParsedProcedure, ParsedInsuranceGroup };
export type ParsedADT_A38 = ParsedADT_A01;

export class ADT_A38_Parser extends ADT_A01_Parser {
  protected override readonly messageName: string = "ADT_A38";
}

export function parseADT_A38(messageString: string): Result<ParsedADT_A38> {
  return new ADT_A38_Parser().parse(messageString);
}
