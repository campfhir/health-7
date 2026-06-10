import type { Result } from "../../types/result.ts";
import {
  ADT_A34_Parser,
  type ParsedADT_A34,
} from "./ADT_A34_Parser.ts";

export type ParsedADT_A39 = ParsedADT_A34;

export class ADT_A39_Parser extends ADT_A34_Parser {
  protected override readonly messageName: string = "ADT_A39";
}

export function parseADT_A39(messageString: string): Result<ParsedADT_A39> {
  return new ADT_A39_Parser().parse(messageString);
}
