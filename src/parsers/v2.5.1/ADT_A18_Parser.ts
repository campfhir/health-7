import type { Result } from "../../types/result.ts";
import {
  ADT_A34_Parser,
  type ParsedADT_A34,
} from "./ADT_A34_Parser.ts";

export type ParsedADT_A18 = ParsedADT_A34;

export class ADT_A18_Parser extends ADT_A34_Parser {
  protected override readonly messageName: string = "ADT_A18";
}

export function parseADT_A18(messageString: string): Result<ParsedADT_A18> {
  return new ADT_A18_Parser().parse(messageString);
}
