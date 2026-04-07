import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { RGS as RGS_base } from "../v2.3/RGS";

/**
 * RGS segment (HL7 v2.5.1)
 * Extends v2.3 RGS. Add v2.5.1-specific fields here as needed.
 */
export class RGS extends RGS_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<RGS> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "RGS") {
      return { ok: false, err: new Err(`Expected RGS segment, got ${parts[0]}`) };
    }
    const seg = new RGS();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
