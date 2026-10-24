/**
 * ACC segment definition for HL7 v2.3.
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
 * ACC - Accident Segment (HL7 v2.3)
 * Contains information about an accident that caused the patient's injury.
 */
export class ACC extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "ACC";

  constructor() {
    super();
    this.fields = [];
  }

  /** ACC-1 Accident Date/Time (chainable). */
  accidentDateTime(value: string, format?: never): this;
  /** ACC-1 Accident Date/Time (chainable). */
  accidentDateTime(value: Date, format?: HL7DateTimeLayout): this;
  accidentDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[0] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /**
   * ACC-2 Accident Code (chainable).
   * @param code - ACC-2.1 Code
   * @param text - ACC-2.2 Text
   * @param codingSystem - ACC-2.3 Coding System
   */
  accidentCode({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[1] = this.createField([code, text || "", codingSystem || ""]);
    return this;
  }

  /** ACC-3 Accident Location (chainable). */
  accidentLocation(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /**
   * ACC-4 Auto Accident State (chainable).
   * @param code - ACC-4.1 Code
   * @param text - ACC-4.2 Text
   */
  autoAccidentState({ code, text }: { code: string; text?: string }): this {
    this.fields[3] = this.createField([code, text || ""]);
    return this;
  }

  /** ACC-5 Accident Job Related Indicator (chainable). */
  accidentJobRelated(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** ACC-6 Accident Death Indicator (chainable). */
  accidentDeath(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<ACC> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "ACC") {
      return {
        ok: false,
        err: new Err(`Expected ACC segment, got ${parts[0]}`),
      };
    }
    const seg = new ACC();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
