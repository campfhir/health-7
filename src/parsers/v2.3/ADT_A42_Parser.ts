import type { Result } from "../../types/result.ts";
import {
  ADT_A34_Parser,
  type ParsedADT_A34,
} from "./ADT_A34_Parser.ts";

export type ParsedADT_A42 = ParsedADT_A34;

export class ADT_A42_Parser extends ADT_A34_Parser {
  protected override readonly messageName: string = "ADT_A42";
}

export function parseADT_A42(messageString: string): Result<ParsedADT_A42> {
  return new ADT_A42_Parser().parse(messageString);
}
