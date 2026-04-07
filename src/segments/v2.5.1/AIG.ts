import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { AIG as AIG_base } from "../v2.3/AIG";

/**
 * AIG segment (HL7 v2.5.1)
 * Extends v2.3 AIG. Add v2.5.1-specific fields here as needed.
 */
export class AIG extends AIG_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<AIG> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "AIG") {
      return { ok: false, err: new Err(`Expected AIG segment, got ${parts[0]}`) };
    }
    const seg = new AIG();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
