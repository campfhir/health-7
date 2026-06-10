import type { Result } from "../../types/result.ts";
import {
  ADT_A34_Parser,
  type ParsedADT_A34,
} from "./ADT_A34_Parser.ts";

export type ParsedADT_A47 = ParsedADT_A34;

export class ADT_A47_Parser extends ADT_A34_Parser {
  protected override readonly messageName: string = "ADT_A47";
}

export function parseADT_A47(messageString: string): Result<ParsedADT_A47> {
  return new ADT_A47_Parser().parse(messageString);
}
