/**
 * PR1 segment definition for HL7 v2.3.
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
 * PR1 - Procedures Segment (HL7 v2.3)
 * Transmits information relative to various types of procedures performed on a patient.
 */
export class PR1 extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "PR1";

  constructor() {
    super();
    this.fields = [];
  }

  /** PR1-1 Set ID (chainable). */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** PR1-2 Procedure Coding Method (chainable). */
  procedureCodingMethod(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /**
   * PR1-3 Procedure Code (chainable).
   * @param code - PR1-3.1 Code
   * @param text - PR1-3.2 Text
   * @param codingSystem - PR1-3.3 Coding System
   */
  procedureCode({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    const components = [code, text || "", codingSystem || ""];
    this.fields[2] = this.createField(components);
    return this;
  }

  /** PR1-4 Procedure Description (chainable). */
  procedureDescription(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** PR1-5 Procedure Date/Time (chainable). */
  procedureDateTime(value: string, format?: never): this;
  /** PR1-5 Procedure Date/Time (chainable). */
  procedureDateTime(value: Date, format?: HL7DateTimeLayout): this;
  procedureDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[4] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** PR1-6 Procedure Functional Type (chainable). */
  procedureFunctionalType(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** PR1-7 Procedure Minutes (chainable). */
  procedureMinutes(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /**
   * PR1-8 Anesthesiologist (chainable).
   * @param id - PR1-8.1 ID Number
   * @param familyName - PR1-8.2 Family Name
   * @param givenName - PR1-8.3 Given Name
   */
  anesthesiologist({ id, familyName, givenName }: { id: string; familyName?: string; givenName?: string }): this {
    const components = [id, familyName || "", givenName || ""];
    this.fields[7] = this.createField(components);
    return this;
  }

  /** PR1-9 Anesthesia Code (chainable). */
  anesthesiaCode(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /** PR1-10 Anesthesia Minutes (chainable). */
  anesthesiaMinutes(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }

  /**
   * PR1-11 Surgeon (chainable).
   * @param id - PR1-11.1 ID Number
   * @param familyName - PR1-11.2 Family Name
   * @param givenName - PR1-11.3 Given Name
   */
  surgeon({ id, familyName, givenName }: { id: string; familyName?: string; givenName?: string }): this {
    const components = [id, familyName || "", givenName || ""];
    this.fields[10] = this.createField(components);
    return this;
  }

  /**
   * PR1-12 Procedure Practitioner (chainable).
   * @param id - PR1-12.1 ID Number
   * @param familyName - PR1-12.2 Family Name
   * @param givenName - PR1-12.3 Given Name
   */
  procedurePractitioner({ id, familyName, givenName }: { id: string; familyName?: string; givenName?: string }): this {
    const components = [id, familyName || "", givenName || ""];
    this.fields[11] = this.createField(components);
    return this;
  }

  /**
   * PR1-13 Consent Code (chainable).
   * @param code - PR1-13.1 Code
   * @param text - PR1-13.2 Text
   * @param codingSystem - PR1-13.3 Coding System
   */
  consentCode({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    const components = [code, text || "", codingSystem || ""];
    this.fields[12] = this.createField(components);
    return this;
  }

  /** PR1-14 Procedure Priority (chainable). */
  procedurePriority(value: string): this {
    this.fields[13] = this.createField(value);
    return this;
  }

  /**
   * PR1-15 Associated Diagnosis Code (chainable).
   * @param code - PR1-15.1 Code
   * @param text - PR1-15.2 Text
   * @param codingSystem - PR1-15.3 Coding System
   */
  associatedDiagnosisCode({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    const components = [code, text || "", codingSystem || ""];
    this.fields[14] = this.createField(components);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<PR1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "PR1") {
      return {
        ok: false,
        err: new Err(`Expected PR1 segment, got ${parts[0]}`),
      };
    }
    const seg = new PR1();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
