/**
 * NSC segment definition for HL7 v2.4.
 *
 * position-tests: hand-written (overrides of the v2.3.1 NSC; see NSC.test.ts)
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { SegmentFieldValue } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { NSC as NSC_base } from "../v2.3.1/NSC.ts";

/**
 * NSC segment (HL7 v2.4)
 *
 * Extends v2.3.1 NSC with NSC-9 New Facility. The v2.3 table has eight fields; the ninth is a
 * v2.4 addition (hl7.eu v2.4 NSC table, 9 fields). Setters take raw HL7 values.
 */
export class NSC extends NSC_base {
  /** NSC-9 New Facility (chainable). */
  newFacility(value: SegmentFieldValue): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<NSC> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "NSC") {
      return { ok: false, err: new Err(`Expected NSC segment, got ${parts[0]}`) };
    }
    const seg = new NSC();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
