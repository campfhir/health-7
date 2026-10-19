/**
 * DSC segment definition for HL7 v2.3.
 *
 * position-tests: hand-written
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";

/**
 * DSC - Continuation Pointer Segment (HL7 v2.3)
 * Points to the next page of a multi-part display or result.
 */
export class DSC extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "DSC";

  constructor() {
    super();
    this.fields = [];
  }

  /** DSC-1 Continuation Pointer (chainable). */
  continuationPointer(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(segmentString: string, encoding: EncodingCharacters): Result<DSC> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "DSC") {
      return {
        ok: false,
        err: new Err(`Expected DSC segment, got ${parts[0]}`),
      };
    }
    const seg = new DSC();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
