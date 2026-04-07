import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { PRA as PRA_base } from "../v2.3/PRA";

/**
 * PRA segment (HL7 v2.5.1)
 * Extends v2.3 PRA. Add v2.5.1-specific fields here as needed.
 */
export class PRA extends PRA_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<PRA> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "PRA") {
      return { ok: false, err: new Err(`Expected PRA segment, got ${parts[0]}`) };
    }
    const seg = new PRA();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
