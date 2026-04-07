import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { MFI as MFI_base } from "../v2.3/MFI";

/**
 * MFI segment (HL7 v2.5.1)
 * Extends v2.3 MFI. Add v2.5.1-specific fields here as needed.
 */
export class MFI extends MFI_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<MFI> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "MFI") {
      return { ok: false, err: new Err(`Expected MFI segment, got ${parts[0]}`) };
    }
    const seg = new MFI();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
