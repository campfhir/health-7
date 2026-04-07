import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { MFI as MFI_v23 } from "../v2.3/MFI";

/**
 * MFI - Master File Identification Segment (HL7 v2.5.1)
 *
 * Extends the v2.3 MFI with no structural changes at this time.
 * Add v2.5.1-specific field methods here as needed.
 */
export class MFI extends MFI_v23 {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<MFI> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "MFI") {
      return {
        ok: false,
        err: new Err(`Expected MFI segment, got ${parts[0]}`),
      };
    }
    const mfi = new MFI();
    for (let i = 1; i < parts.length; i++) {
      mfi.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: mfi };
  }
}
