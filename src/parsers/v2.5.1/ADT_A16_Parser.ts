import type { Result } from "../../types/result.ts";
import {
  ADT_A01_Parser,
  type ParsedADT_A01,
  type ParsedProcedure,
  type ParsedInsuranceGroup,
} from "./ADT_A01_Parser.ts";

export type { ParsedProcedure, ParsedInsuranceGroup };
export type ParsedADT_A16 = ParsedADT_A01;

export class ADT_A16_Parser extends ADT_A01_Parser {
  protected override readonly messageName: string = "ADT_A16";
}

export function parseADT_A16(messageString: string): Result<ParsedADT_A16> {
  return new ADT_A16_Parser().parse(messageString);
}
