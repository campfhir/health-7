import { Result } from "../../types/result";
import {
  ADT_A34_Parser,
  ParsedADT_A34,
} from "./ADT_A34_Parser";

export type ParsedADT_A41 = ParsedADT_A34;

export class ADT_A41_Parser extends ADT_A34_Parser {
  protected override readonly messageName: string = "ADT_A41";
}

export function parseADT_A41(messageString: string): Result<ParsedADT_A41> {
  return new ADT_A41_Parser().parse(messageString);
}
