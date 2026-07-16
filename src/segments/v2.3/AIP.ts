/**
 * AIP segment definition for HL7 v2.3.
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
 * AIP - Appointment Information - Personnel Resource Segment (HL7 v2.3)
 */
export class AIP extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "AIP";

  constructor() {
    super();
    this.fields = [];
  }

  /** AIP-1 Set ID (chainable). */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** AIP-2 Segment Action Code (chainable). */
  segmentActionCode(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /**
   * AIP-3 Personnel Resource ID (chainable).
   * @param id - AIP-3.1 ID Number
   * @param familyName - AIP-3.2 Family Name
   * @param givenName - AIP-3.3 Given Name
   */
  personnelResourceId(
    id: string,
    familyName?: string,
    givenName?: string,
  ): this {
    this.fields[2] = this.createComponentsField([
      id,
      familyName || "",
      givenName || "",
    ]);
    return this;
  }

  /**
   * AIP-4 Resource Type (chainable).
   * @param code - AIP-4.1 Code
   * @param text - AIP-4.2 Text
   * @param codingSystem - AIP-4.3 Coding System
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
   * AIP-5 Resource Group (chainable).
   * @param code - AIP-5.1 Code
   * @param text - AIP-5.2 Text
   */
  resourceGroup(code: string, text?: string): this {
    this.fields[4] = this.createComponentsField([code, text]);
    return this;
  }

  /** AIP-6 Start Date/Time (chainable). */
  startDateTime(value: string, format?: never): this;
  /** AIP-6 Start Date/Time (chainable). */
  startDateTime(value: Date, format?: HL7DateTimeLayout): this;
  startDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[5] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** AIP-7 Start Date/Time Offset (chainable). */
  startDateTimeOffset(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /**
   * AIP-8 Start Date/Time Offset Units (chainable).
   * @param code - AIP-8.1 Code
   * @param text - AIP-8.2 Text
   */
  startDateTimeOffsetUnits(code: string, text?: string): this {
    this.fields[7] = this.createComponentsField([code, text]);
    return this;
  }

  /** AIP-9 Duration (chainable). */
  duration(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /**
   * AIP-10 Duration Units (chainable).
   * @param code - AIP-10.1 Code
   * @param text - AIP-10.2 Text
   */
  durationUnits(code: string, text?: string): this {
    this.fields[9] = this.createComponentsField([code, text]);
    return this;
  }

  /** AIP-11 Allow Substitution Code (chainable). */
  allowSubstitutionCode(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /**
   * AIP-12 Filler Status Code (chainable).
   * @param code - AIP-12.1 Code
   * @param text - AIP-12.2 Text
   */
  fillerStatusCode(code: string, text?: string): this {
    this.fields[11] = this.createComponentsField([code, text]);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<AIP> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "AIP") {
      return {
        ok: false,
        err: new Err(`Expected AIP segment, got ${parts[0]}`),
      };
    }
    const seg = new AIP();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
