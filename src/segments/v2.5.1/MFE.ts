import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { MFE as MFE_v23 } from "../v2.3/MFE";

/**
 * MFE - Master File Entry Segment (HL7 v2.5.1)
 *
 * Extends the v2.3 MFE with no structural changes at this time.
 * Add v2.5.1-specific field methods here as needed.
 */
export class MFE extends MFE_v23 {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<MFE> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "MFE") {
      return {
        ok: false,
        err: new Err(`Expected MFE segment, got ${parts[0]}`),
      };
    }
    const mfe = new MFE();
    for (let i = 1; i < parts.length; i++) {
      mfe.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: mfe };
  }
}
