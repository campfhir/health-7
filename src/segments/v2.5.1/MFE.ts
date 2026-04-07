import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { MFE as MFE_base } from "../v2.3/MFE";

/**
 * MFE segment (HL7 v2.5.1)
 * Extends v2.3 MFE. Add v2.5.1-specific fields here as needed.
 */
export class MFE extends MFE_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<MFE> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "MFE") {
      return { ok: false, err: new Err(`Expected MFE segment, got ${parts[0]}`) };
    }
    const seg = new MFE();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
