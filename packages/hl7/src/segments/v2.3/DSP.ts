/**
 * DSP segment definition for HL7 v2.3.
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
 * DSP - Display Data Segment (HL7 v2.3)
 * One line of display data in a text report.
 */
export class DSP extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "DSP";

  constructor() {
    super();
    this.fields = [];
  }

  /** DSP-1 Set ID - Display Data (chainable). */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** DSP-2 Display Level (chainable). */
  displayLevel(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** DSP-3 Data Line (chainable). */
  dataLine(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** DSP-4 Logical Break Point (chainable). */
  logicalBreakPoint(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** DSP-5 Result ID (chainable). */
  resultId(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(segmentString: string, encoding: EncodingCharacters): Result<DSP> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "DSP") {
      return {
        ok: false,
        err: new Err(`Expected DSP segment, got ${parts[0]}`),
      };
    }
    const seg = new DSP();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
