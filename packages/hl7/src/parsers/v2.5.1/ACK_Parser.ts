import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { MSH } from "../../segments/v2.5.1/MSH";
import { SFT } from "../../segments/v2.5.1/SFT";
import { MSA } from "../../segments/v2.5.1/MSA";
import { ERR } from "../../segments/v2.5.1/ERR";
import {
  ACK_Parser as ACK_Parser_base,
  ParsedACK,
} from "../v2.5/ACK_Parser";

export type { ParsedACK };

export class ACK_Parser extends ACK_Parser_base {
  protected override parseMSH(s: string): Result<MSH> {
    return MSH.parse(s);
  }

  protected override parseSFT(s: string, e: EncodingCharacters): Result<SFT> {
    return SFT.parse(s, e);
  }

  protected override parseMSA(s: string, e: EncodingCharacters): Result<MSA> {
    return MSA.parse(s, e);
  }

  protected override parseERR(s: string, e: EncodingCharacters): Result<ERR> {
    return ERR.parse(s, e);
  }
}

export function parseACK(messageString: string): Result<ParsedACK> {
  return new ACK_Parser().parse(messageString);
}
