/**
 * FTS segment definition for HL7 v2.3.
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
 * FTS - File Trailer Segment (HL7 v2.3)
 * Closes a file started by FHS and reports how many batches it contained.
 */
export class FTS extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "FTS";

  constructor() {
    super();
    this.fields = [];
  }

  /** FTS-1 File Batch Count (chainable). */
  fileBatchCount(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** FTS-2 File Trailer Comment (chainable). */
  comment(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(segmentString: string, encoding: EncodingCharacters): Result<FTS> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "FTS") {
      return {
        ok: false,
        err: new Err(`Expected FTS segment, got ${parts[0]}`),
      };
    }
    const seg = new FTS();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
