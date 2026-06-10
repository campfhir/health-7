import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { MSH } from "../../segments/v2.5.1/MSH.ts";
import { EVN } from "../../segments/v2.5.1/EVN.ts";
import { PID } from "../../segments/v2.5.1/PID.ts";
import { PD1 } from "../../segments/v2.5.1/PD1.ts";
import { MRG } from "../../segments/v2.5.1/MRG.ts";
import { PV1 } from "../../segments/v2.5.1/PV1.ts";
import {
  ADT_A34_Parser as ADT_A34_Parser_base,
  type ParsedADT_A34,
} from "../v2.3/ADT_A34_Parser.ts";

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
