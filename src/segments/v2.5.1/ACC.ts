import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { ACC as ACC_base } from "../v2.3/ACC";

/**
 * ACC segment (HL7 v2.5.1)
 * Extends v2.3 ACC. Add v2.5.1-specific fields here as needed.
 */
export class ACC extends ACC_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<ACC> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "ACC") {
      return { ok: false, err: new Err(`Expected ACC segment, got ${parts[0]}`) };
    }
    const seg = new ACC();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
