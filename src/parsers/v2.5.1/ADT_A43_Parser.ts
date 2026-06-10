import type { Result } from "../../types/result.ts";
import {
  ADT_A34_Parser,
  type ParsedADT_A34,
} from "./ADT_A34_Parser.ts";

export type ParsedADT_A43 = ParsedADT_A34;

export class ADT_A43_Parser extends ADT_A34_Parser {
  protected override readonly messageName: string = "ADT_A43";
}

export function parseADT_A43(messageString: string): Result<ParsedADT_A43> {
  return new ADT_A43_Parser().parse(messageString);
}
