import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { MRG as MRG_base } from "../v2.3/MRG.ts";

/**
 * MRG segment (HL7 v2.5.1)
 * Extends v2.3 MRG. Add v2.5.1-specific fields here as needed.
 */
export class MRG extends MRG_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<MRG> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "MRG") {
      return { ok: false, err: new Err(`Expected MRG segment, got ${parts[0]}`) };
    }
    const seg = new MRG();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
