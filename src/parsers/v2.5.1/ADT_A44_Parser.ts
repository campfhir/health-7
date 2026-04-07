import { Result } from "../../types/result";
import {
  ADT_A34_Parser,
  ParsedADT_A34,
} from "./ADT_A34_Parser";

export type ParsedADT_A44 = ParsedADT_A34;

export class ADT_A44_Parser extends ADT_A34_Parser {
  protected override readonly messageName: string = "ADT_A44";
}

export function parseADT_A44(messageString: string): Result<ParsedADT_A44> {
  return new ADT_A44_Parser().parse(messageString);
}
