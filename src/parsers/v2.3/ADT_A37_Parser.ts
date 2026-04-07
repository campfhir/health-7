import { Result } from "../../types/result";
import {
  ADT_A34_Parser,
  ParsedADT_A34,
} from "./ADT_A34_Parser";

export type ParsedADT_A37 = ParsedADT_A34;

export class ADT_A37_Parser extends ADT_A34_Parser {
  protected override readonly messageName: string = "ADT_A37";
}

export function parseADT_A37(messageString: string): Result<ParsedADT_A37> {
  return new ADT_A37_Parser().parse(messageString);
}
