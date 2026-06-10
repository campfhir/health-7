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

  /**
   * PR1-1: Set ID (SI, required)
   * Sequence number of this segment within the message.
   */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /**
   * PR1-2: Procedure Coding Method (IS, optional, deprecated)
   * Retained for backward compatibility; use PR1-3 coding system instead.
   */
  procedureCodingMethod(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /**
   * PR1-3: Procedure Code (CNE, required)
   * Unique identifier for the procedure (e.g., codingSystem "I10P" for ICD-10-PCS).
   */
  procedureCode(code: string, text?: string, codingSystem?: string): this {
    const components = [code, text || "", codingSystem || ""];
    this.fields[2] = this.createField(components);
    return this;
  }

  /**
   * PR1-4: Procedure Description (ST, optional, deprecated)
   * Retained for backward compatibility; use PR1-3 text component instead.
   */
  procedureDescription(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /**
   * PR1-5: Procedure Date/Time (TS, required)
   * The date/time the procedure was performed.
   */
  procedureDateTime(value: string, format?: never): this;
  /** Sets the procedure date time field (chainable). */
  procedureDateTime(value: Date, format?: HL7DateTimeLayout): this;
  procedureDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[4] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /**
   * PR1-6: Procedure Functional Type (IS, optional)
   * Type of procedure (e.g., A=Anesthesia, D=Diagnostic, I=Invasive, N=Non-invasive, P=Psychiatric, T=Therapeutic).
   */
  procedureFunctionalType(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /**
   * PR1-7: Procedure Minutes (NM, optional)
   * The length of the procedure in minutes.
   */
  procedureMinutes(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /**
   * PR1-8: Anesthesiologist (XCN, optional)
   * The anesthesiologist who performed the anesthesia.
   */
  anesthesiologist(id: string, familyName?: string, givenName?: string): this {
    const components = [id, familyName || "", givenName || ""];
    this.fields[7] = this.createField(components);
    return this;
  }

  /**
   * PR1-9: Anesthesia Code (IS, optional)
   * The anesthesia code for the procedure.
   */
  anesthesiaCode(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /**
   * PR1-10: Anesthesia Minutes (NM, optional)
   * The length of the anesthesia in minutes.
   */
  anesthesiaMinutes(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }

  /**
   * PR1-11: Surgeon (XCN, optional)
   * The surgeon who performed the procedure.
   */
  surgeon(id: string, familyName?: string, givenName?: string): this {
    const components = [id, familyName || "", givenName || ""];
    this.fields[10] = this.createField(components);
    return this;
  }

  /**
   * PR1-12: Procedure Practitioner (XCN, optional)
   * The practitioner associated with the procedure.
   */
  procedurePractitioner(
    id: string,
    familyName?: string,
    givenName?: string,
  ): this {
    const components = [id, familyName || "", givenName || ""];
    this.fields[11] = this.createField(components);
    return this;
  }

  /**
   * PR1-13: Consent Code (CE, optional)
   * The type of consent obtained for the procedure.
   */
  consentCode(code: string, text?: string, codingSystem?: string): this {
    const components = [code, text || "", codingSystem || ""];
    this.fields[12] = this.createField(components);
    return this;
  }

  /**
   * PR1-14: Procedure Priority (NM, optional)
   * The priority ranking of this procedure (1=highest).
   */
  procedurePriority(value: string): this {
    this.fields[13] = this.createField(value);
    return this;
  }

  /**
   * PR1-15: Associated Diagnosis Code (CE, optional)
   * The diagnosis associated with this procedure.
   */
  associatedDiagnosisCode(
    code: string,
    text?: string,
    codingSystem?: string,
  ): this {
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
