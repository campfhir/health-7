/**
 * AIS segment definition for HL7 v2.3.
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
 * AIS - Appointment Information - Service Segment (HL7 v2.3)
 */
export class AIS extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "AIS";

  constructor() {
    super();
    this.fields = [];
  }

  /** AIS-1 Set ID (chainable). */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** AIS-2 Segment Action Code (chainable). */
  segmentActionCode(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /**
   * AIS-3 Universal Service Identifier (chainable).
   * @param code - AIS-3.1 Code
   * @param text - AIS-3.2 Text
   * @param codingSystem - AIS-3.3 Coding System
   */
  universalServiceId(code: string, text?: string, codingSystem?: string): this {
    this.fields[2] = this.createComponentsField([
      code,
      text || "",
      codingSystem || "",
    ]);
    return this;
  }

  /** AIS-4 Start Date/Time (chainable). */
  startDateTime(value: string, format?: never): this;
  /** AIS-4 Start Date/Time (chainable). */
  startDateTime(value: Date, format?: HL7DateTimeLayout): this;
  startDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[3] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** AIS-5 Start Date/Time Offset (chainable). */
  startDateTimeOffset(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /**
   * AIS-6 Start Date/Time Offset Units (chainable).
   * @param code - AIS-6.1 Code
   * @param text - AIS-6.2 Text
   */
  startDateTimeOffsetUnits(code: string, text?: string): this {
    this.fields[5] = this.createComponentsField([code, text]);
    return this;
  }

  /** AIS-7 Duration (chainable). */
  duration(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /**
   * AIS-8 Duration Units (chainable).
   * @param code - AIS-8.1 Code
   * @param text - AIS-8.2 Text
   */
  durationUnits(code: string, text?: string): this {
    this.fields[7] = this.createComponentsField([code, text]);
    return this;
  }

  /** AIS-9 Allow Substitution Code (chainable). */
  allowSubstitutionCode(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /**
   * AIS-10 Filler Status Code (chainable).
   * @param code - AIS-10.1 Code
   * @param text - AIS-10.2 Text
   */
  fillerStatusCode(code: string, text?: string): this {
    this.fields[9] = this.createComponentsField([code, text]);
    return this;
  }

  /**
   * AIS-11 Placer Supplemental Service Information (chainable).
   * @param code - AIS-11.1 Code
   * @param text - AIS-11.2 Text
   */
  placerSupplementalInfo(code: string, text?: string): this {
    this.fields[10] = this.createComponentsField([code, text]);
    return this;
  }

  /**
   * AIS-12 Filler Supplemental Service Information (chainable).
   * @param code - AIS-12.1 Code
   * @param text - AIS-12.2 Text
   */
  fillerSupplementalInfo(code: string, text?: string): this {
    this.fields[11] = this.createComponentsField([code, text]);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<AIS> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "AIS") {
      return {
        ok: false,
        err: new Err(`Expected AIS segment, got ${parts[0]}`),
      };
    }
    const seg = new AIS();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
