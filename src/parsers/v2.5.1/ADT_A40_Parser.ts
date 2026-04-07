import { Result } from "../../types/result";
import {
  ADT_A34_Parser,
  ParsedADT_A34,
} from "./ADT_A34_Parser";

export type ParsedADT_A40 = ParsedADT_A34;

export class ADT_A40_Parser extends ADT_A34_Parser {
  protected override readonly messageName: string = "ADT_A40";
}

export function parseADT_A40(messageString: string): Result<ParsedADT_A40> {
  return new ADT_A40_Parser().parse(messageString);
}
