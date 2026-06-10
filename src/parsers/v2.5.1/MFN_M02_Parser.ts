import type { Result } from "../../types/result.ts";
import { MFI } from "../../segments/v2.5.1/MFI.ts";
import { MFE } from "../../segments/v2.5.1/MFE.ts";
import { STF } from "../../segments/v2.5.1/STF.ts";
import { PRA } from "../../segments/v2.5.1/PRA.ts";
;
import type { EncodingCharacters } from "../../types/encoding.ts";
import {
  MFN_M02_Parser as MFN_M02_Parser_v23,
  type ParsedStaffEntry,
  type ParsedMFN_M02,
} from "../v2.3/MFN_M02_Parser.ts";

export type { ParsedStaffEntry, ParsedMFN_M02 };

export class MFN_M02_Parser extends MFN_M02_Parser_v23 {
  protected override parseMFI(s: string, e: EncodingCharacters): Result<MFI> {
    return MFI.parse(s, e);
  }
  protected override parseMFE(s: string, e: EncodingCharacters): Result<MFE> {
    return MFE.parse(s, e);
  }
  protected override parseSTF(s: string, e: EncodingCharacters): Result<STF> {
    return STF.parse(s, e);
  }
  protected override parsePRA(s: string, e: EncodingCharacters): Result<PRA> {
    return PRA.parse(s, e);
  }
}

export function parseMFN_M02(messageString: string): Result<ParsedMFN_M02> {
  return new MFN_M02_Parser().parse(messageString);
}
