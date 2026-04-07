import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { RXE as RXE_base } from "../v2.3/RXE";

/**
 * RXE segment (HL7 v2.5.1)
 * Extends v2.3 RXE. Add v2.5.1-specific fields here as needed.
 */
export class RXE extends RXE_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<RXE> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "RXE") {
      return { ok: false, err: new Err(`Expected RXE segment, got ${parts[0]}`) };
    }
    const seg = new RXE();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
