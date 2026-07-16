/**
 * TQ1 segment definition for HL7 v2.3.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import {
  formatHL7Date,
  DateTimeLayout,
  type HL7DateTimeLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * TQ1 - Timing/Quantity Segment (HL7 v2.3)
 */
export class TQ1 extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "TQ1";

  constructor() {
    super();
    this.fields = [];
  }

  /** TQ1-1 Set ID (chainable). */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /**
   * TQ1-2 Quantity (chainable).
   * @param value - TQ1-2.1 Value
   * @param units - TQ1-2.2 Units
   */
  quantity(value: string, units?: string): this {
    this.fields[1] = this.createField([[value, units || ""]]);
    return this;
  }

  /** TQ1-3 Repeat Pattern (chainable). */
  repeatPattern(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** TQ1-4 Explicit Time (chainable). */
  explicitTime(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /**
   * TQ1-5 Relative Time and Units (chainable).
   * @param value - TQ1-5.1 Value
   * @param units - TQ1-5.2 Units
   */
  relativeTime(value: string, units?: string): this {
    this.fields[4] = this.createField([[value, units || ""]]);
    return this;
  }

  /**
   * TQ1-6 Service Duration (chainable).
   * @param value - TQ1-6.1 Value
   * @param units - TQ1-6.2 Units
   */
  serviceDuration(value: string, units?: string): this {
    this.fields[5] = this.createField([[value, units || ""]]);
    return this;
  }

  /** TQ1-7 Start Date/Time (chainable). */
  startDateTime(value: string, format?: never): this;
  /** TQ1-7 Start Date/Time (chainable). */
  startDateTime(value: Date, format?: HL7DateTimeLayout): this;
  startDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[6] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** TQ1-8 End Date/Time (chainable). */
  endDateTime(value: string, format?: never): this;
  /** TQ1-8 End Date/Time (chainable). */
  endDateTime(value: Date, format?: HL7DateTimeLayout): this;
  endDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[7] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /**
   * TQ1-9 Priority (chainable).
   * @param code - TQ1-9.1 Code
   * @param text - TQ1-9.2 Text
   * @param codingSystem - TQ1-9.3 Coding System
   */
  priority(code: string, text?: string, codingSystem?: string): this {
    this.fields[8] = this.createField([[code, text || "", codingSystem || ""]]);
    return this;
  }

  /** TQ1-10 Condition Text (chainable). */
  conditionText(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }

  /** TQ1-11 Text Instruction (chainable). */
  textInstruction(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /** TQ1-12 Conjunction (chainable). */
  conjunction(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }

  /**
   * TQ1-13 Occurrence Duration (chainable).
   * @param value - TQ1-13.1 Value
   * @param units - TQ1-13.2 Units
   */
  occurrenceDuration(value: string, units?: string): this {
    this.fields[12] = this.createField([[value, units || ""]]);
    return this;
  }

  /** TQ1-14 Total Occurrences (chainable). */
  totalOccurrences(value: string): this {
    this.fields[13] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<TQ1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "TQ1") {
      return {
        ok: false,
        err: new Err(`Expected TQ1 segment, got ${parts[0]}`),
      };
    }
    const seg = new TQ1();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
