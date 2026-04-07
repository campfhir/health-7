import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { MSH } from "../../segments/v2.5.1/MSH";
import { EVN } from "../../segments/v2.5.1/EVN";
import { PID } from "../../segments/v2.5.1/PID";
import { PD1 } from "../../segments/v2.5.1/PD1";
import { MRG } from "../../segments/v2.5.1/MRG";
import { PV1 } from "../../segments/v2.5.1/PV1";
import {
  ADT_A34_Parser as ADT_A34_Parser_base,
  ParsedADT_A34,
} from "../v2.3/ADT_A34_Parser";

export type { ParsedADT_A34 };

export class ADT_A34_Parser extends ADT_A34_Parser_base {
  protected override parseMSH(s: string): Result<MSH> {
    return MSH.parse(s);
  }

  protected override parseEVN(s: string, e: EncodingCharacters): Result<EVN> {
    return EVN.parse(s, e);
  }

  protected override parsePID(s: string, e: EncodingCharacters): Result<PID> {
    return PID.parse(s, e);
  }

  protected override parsePD1(s: string, e: EncodingCharacters): Result<PD1> {
    return PD1.parse(s, e);
  }

  protected override parseMRG(s: string, e: EncodingCharacters): Result<MRG> {
    return MRG.parse(s, e);
  }

  protected override parsePV1(s: string, e: EncodingCharacters): Result<PV1> {
    return PV1.parse(s, e);
  }
}

export function parseADT_A34(messageString: string): Result<ParsedADT_A34> {
  return new ADT_A34_Parser().parse(messageString);
}
