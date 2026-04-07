import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import { DRG as DRG_base } from "../v2.3/DRG";

/**
 * DRG segment (HL7 v2.5.1)
 * Extends v2.3 DRG. Add v2.5.1-specific fields here as needed.
 */
export class DRG extends DRG_base {
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<DRG> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "DRG") {
      return { ok: false, err: new Err(`Expected DRG segment, got ${parts[0]}`) };
    }
    const seg = new DRG();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
