import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { DB1 as DB1_base } from "../v2.3/DB1";

/**
 * DB1 segment (HL7 v2.5.1)
 * Extends v2.3 DB1. Add v2.5.1-specific fields here as needed.
 */
export class DB1 extends DB1_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<DB1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "DB1") {
      return { ok: false, err: new Err(`Expected DB1 segment, got ${parts[0]}`) };
    }
    const seg = new DB1();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
