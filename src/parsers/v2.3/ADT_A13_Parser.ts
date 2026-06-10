import type { Result } from "../../types/result.ts";
import {
  ADT_A01_Parser,
  type ParsedADT_A01,
  type ParsedProcedure,
  type ParsedInsuranceGroup,
} from "./ADT_A01_Parser.ts";

export type { ParsedProcedure, ParsedInsuranceGroup };
export type ParsedADT_A13 = ParsedADT_A01;

export class ADT_A13_Parser extends ADT_A01_Parser {
  protected override readonly messageName: string = "ADT_A13";
}

export function parseADT_A13(messageString: string): Result<ParsedADT_A13> {
  return new ADT_A13_Parser().parse(messageString);
}
