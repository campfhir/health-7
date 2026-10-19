/**
 * ADD segment definition for HL7 v2.3.
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
 * ADD - Addendum Segment (HL7 v2.3)
 * Defines the continuation of the prior segment in a continuation message.
 */
export class ADD extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "ADD";

  constructor() {
    super();
    this.fields = [];
  }

  /** ADD-1 Addendum Continuation Pointer (chainable). */
  addendumContinuationPointer(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(segmentString: string, encoding: EncodingCharacters): Result<ADD> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "ADD") {
      return {
        ok: false,
        err: new Err(`Expected ADD segment, got ${parts[0]}`),
      };
    }
    const seg = new ADD();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
