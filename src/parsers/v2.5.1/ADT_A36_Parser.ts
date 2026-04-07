import { Result } from "../../types/result";
import {
  ADT_A34_Parser,
  ParsedADT_A34,
} from "./ADT_A34_Parser";

export type ParsedADT_A36 = ParsedADT_A34;

export class ADT_A36_Parser extends ADT_A34_Parser {
  protected override readonly messageName: string = "ADT_A36";
}

export function parseADT_A36(messageString: string): Result<ParsedADT_A36> {
  return new ADT_A36_Parser().parse(messageString);
}
