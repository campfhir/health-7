import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { RXD as RXD_base } from "../v2.3/RXD";

/**
 * RXD segment (HL7 v2.5.1)
 * Extends v2.3 RXD. Add v2.5.1-specific fields here as needed.
 */
export class RXD extends RXD_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<RXD> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "RXD") {
      return { ok: false, err: new Err(`Expected RXD segment, got ${parts[0]}`) };
    }
    const seg = new RXD();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
