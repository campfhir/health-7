/**
 * BTS segment definition for HL7 v2.3.
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
 * BTS - Batch Trailer Segment (HL7 v2.3)
 * Closes a batch started by BHS and reports how many messages it contained.
 */
export class BTS extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "BTS";

  constructor() {
    super();
    this.fields = [];
  }

  /** BTS-1 Batch Message Count (chainable). */
  messageCount(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** BTS-2 Batch Comment (chainable). */
  comment(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /**
   * BTS-3 Batch Totals (chainable). Repeating numeric totals.
   * @param values - One entry per repetition
   */
  batchTotals(...values: string[]): this {
    this.fields[2] = this.createRepeatingField(values.map((v) => this.createField(v)));
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(segmentString: string, encoding: EncodingCharacters): Result<BTS> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "BTS") {
      return {
        ok: false,
        err: new Err(`Expected BTS segment, got ${parts[0]}`),
      };
    }
    const seg = new BTS();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
