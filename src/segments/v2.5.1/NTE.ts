import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { NTE as NTE_base } from "../v2.3/NTE";

/**
 * NTE segment (HL7 v2.5.1)
 * Extends v2.3 NTE. Add v2.5.1-specific fields here as needed.
 */
export class NTE extends NTE_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<NTE> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "NTE") {
      return { ok: false, err: new Err(`Expected NTE segment, got ${parts[0]}`) };
    }
    const seg = new NTE();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
