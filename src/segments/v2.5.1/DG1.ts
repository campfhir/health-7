/**
 * DG1 segment definition for HL7 v2.5.1.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { DG1 as DG1_base } from "../v2.3/DG1.ts";

/**
 * DG1 segment (HL7 v2.5.1)
 * Extends v2.3 DG1. Add v2.5.1-specific fields here as needed.
 */
export class DG1 extends DG1_base {
  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<DG1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "DG1") {
      return { ok: false, err: new Err(`Expected DG1 segment, got ${parts[0]}`) };
    }
    const seg = new DG1();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
