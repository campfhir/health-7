/**
 * QAK segment definition for HL7 v2.3.
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
 * QAK - Query Acknowledgment Segment (HL7 v2.3)
 * Acknowledges a query and reports its response status.
 */
export class QAK extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "QAK";

  constructor() {
    super();
    this.fields = [];
  }

  /** QAK-1 Query Tag (chainable). */
  queryTag(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** QAK-2 Query Response Status (chainable). */
  queryResponseStatus(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(segmentString: string, encoding: EncodingCharacters): Result<QAK> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "QAK") {
      return {
        ok: false,
        err: new Err(`Expected QAK segment, got ${parts[0]}`),
      };
    }
    const seg = new QAK();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
