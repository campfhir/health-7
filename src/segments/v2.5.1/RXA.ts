import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { RXA as RXA_base } from "../v2.3/RXA";

/**
 * RXA segment (HL7 v2.5.1)
 * Extends v2.3 RXA. Add v2.5.1-specific fields here as needed.
 */
export class RXA extends RXA_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<RXA> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "RXA") {
      return { ok: false, err: new Err(`Expected RXA segment, got ${parts[0]}`) };
    }
    const seg = new RXA();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
