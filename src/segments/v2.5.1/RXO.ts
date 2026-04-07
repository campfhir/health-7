import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { RXO as RXO_base } from "../v2.3/RXO";

/**
 * RXO segment (HL7 v2.5.1)
 * Extends v2.3 RXO. Add v2.5.1-specific fields here as needed.
 */
export class RXO extends RXO_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<RXO> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "RXO") {
      return { ok: false, err: new Err(`Expected RXO segment, got ${parts[0]}`) };
    }
    const seg = new RXO();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
