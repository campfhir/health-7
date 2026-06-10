import type { Result } from "../../types/result.ts";
import {
  ADT_A34_Parser,
  type ParsedADT_A34,
} from "./ADT_A34_Parser.ts";

export type ParsedADT_A45 = ParsedADT_A34;

export class ADT_A45_Parser extends ADT_A34_Parser {
  protected override readonly messageName: string = "ADT_A45";
}

export function parseADT_A45(messageString: string): Result<ParsedADT_A45> {
  return new ADT_A45_Parser().parse(messageString);
}
