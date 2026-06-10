import type { Result } from "../../types/result.ts";
import {
  ADT_A34_Parser,
  type ParsedADT_A34,
} from "./ADT_A34_Parser.ts";

export type ParsedADT_A30 = ParsedADT_A34;

export class ADT_A30_Parser extends ADT_A34_Parser {
  protected override readonly messageName: string = "ADT_A30";
}

export function parseADT_A30(messageString: string): Result<ParsedADT_A30> {
  return new ADT_A30_Parser().parse(messageString);
}
