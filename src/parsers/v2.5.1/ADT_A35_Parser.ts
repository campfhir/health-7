import { Result } from "../../types/result";
import {
  ADT_A34_Parser,
  ParsedADT_A34,
} from "./ADT_A34_Parser";

export type ParsedADT_A35 = ParsedADT_A34;

export class ADT_A35_Parser extends ADT_A34_Parser {
  protected override readonly messageName: string = "ADT_A35";
}

export function parseADT_A35(messageString: string): Result<ParsedADT_A35> {
  return new ADT_A35_Parser().parse(messageString);
}
