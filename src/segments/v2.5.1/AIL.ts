import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { AIL as AIL_base } from "../v2.3/AIL";

/**
 * AIL segment (HL7 v2.5.1)
 * Extends v2.3 AIL. Add v2.5.1-specific fields here as needed.
 */
export class AIL extends AIL_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<AIL> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "AIL") {
      return { ok: false, err: new Err(`Expected AIL segment, got ${parts[0]}`) };
    }
    const seg = new AIL();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
