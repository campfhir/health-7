/**
 * AIG segment definition for HL7 v2.3.
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
 * AIG - Appointment Information - General Resource Segment (HL7 v2.3)
 */
export class AIG extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "AIG";

  constructor() {
    super();
    this.fields = [];
  }

  /** AIG-1 Set ID (chainable). */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** AIG-2 Segment Action Code (chainable). */
  segmentActionCode(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /**
   * AIG-3 Resource ID (chainable).
   * @param code - AIG-3.1 Code
   * @param text - AIG-3.2 Text
   * @param codingSystem - AIG-3.3 Coding System
   */
  resourceId(code: string, text?: string, codingSystem?: string): this {
    this.fields[2] = this.createComponentsField([
      code,
      text || "",
      codingSystem || "",
    ]);
    return this;
  }

  /**
   * AIG-4 Resource Type (chainable).
   * @param code - AIG-4.1 Code
   * @param text - AIG-4.2 Text
   * @param codingSystem - AIG-4.3 Coding System
   */
  resourceType(code: string, text?: string, codingSystem?: string): this {
    this.fields[3] = this.createComponentsField([
      code,
      text || "",
      codingSystem || "",
    ]);
    return this;
  }

  /**
   * AIG-5 Resource Group (chainable).
   * @param code - AIG-5.1 Code
   * @param text - AIG-5.2 Text
   */
  resourceGroup(code: string, text?: string): this {
    this.fields[4] = this.createComponentsField([code, text]);
    return this;
  }

  /** AIG-6 Resource Quantity (chainable). */
  resourceQuantity(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /**
   * AIG-7 Resource Quantity Units (chainable).
   * @param code - AIG-7.1 Code
   * @param text - AIG-7.2 Text
   */
  resourceQuantityUnits(code: string, text?: string): this {
    this.fields[6] = this.createComponentsField([code, text]);
    return this;
  }

  /** AIG-8 Start Date/Time (chainable). */
  startDateTime(value: string, format?: never): this;
  /** AIG-8 Start Date/Time (chainable). */
  startDateTime(value: Date, format?: HL7DateTimeLayout): this;
  startDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[7] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** AIG-9 Start Date/Time Offset (chainable). */
  startDateTimeOffset(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /**
   * AIG-10 Start Date/Time Offset Units (chainable).
   * @param code - AIG-10.1 Code
   * @param text - AIG-10.2 Text
   */
  startDateTimeOffsetUnits(code: string, text?: string): this {
    this.fields[9] = this.createComponentsField([code, text]);
    return this;
  }

  /** AIG-11 Duration (chainable). */
  duration(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /**
   * AIG-12 Duration Units (chainable).
   * @param code - AIG-12.1 Code
   * @param text - AIG-12.2 Text
   */
  durationUnits(code: string, text?: string): this {
    this.fields[11] = this.createComponentsField([code, text]);
    return this;
  }

  /** AIG-13 Allow Substitution Code (chainable). */
  allowSubstitutionCode(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }

  /**
   * AIG-14 Filler Status Code (chainable).
   * @param code - AIG-14.1 Code
   * @param text - AIG-14.2 Text
   */
  fillerStatusCode(code: string, text?: string): this {
    this.fields[13] = this.createComponentsField([code, text]);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<AIG> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "AIG") {
      return {
        ok: false,
        err: new Err(`Expected AIG segment, got ${parts[0]}`),
      };
    }
    const seg = new AIG();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
