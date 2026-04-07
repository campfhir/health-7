import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { RXR as RXR_base } from "../v2.3/RXR";

/**
 * RXR segment (HL7 v2.5.1)
 * Extends v2.3 RXR. Add v2.5.1-specific fields here as needed.
 */
export class RXR extends RXR_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<RXR> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "RXR") {
      return { ok: false, err: new Err(`Expected RXR segment, got ${parts[0]}`) };
    }
    const seg = new RXR();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
