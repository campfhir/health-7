/**
 * DG1 segment definition for HL7 v2.3.
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
 * DG1 - Diagnosis Segment (HL7 v2.3)
 * Transmits patient diagnosis information for various uses including billing.
 */
export class DG1 extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "DG1";

  constructor() {
    super();
    this.fields = [];
  }

  /** DG1-1 Set ID (chainable). */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** DG1-2 Diagnosis Coding Method (chainable). */
  diagnosisCodingMethod(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /**
   * DG1-3 Diagnosis Code (chainable).
   * @param code - DG1-3.1 Code
   * @param text - DG1-3.2 Text
   * @param codingSystem - DG1-3.3 Coding System
   */
  diagnosisCode(code: string, text?: string, codingSystem?: string): this {
    const components = [code, text || "", codingSystem || ""];
    this.fields[2] = this.createField(components);
    return this;
  }

  /** DG1-4 Diagnosis Description (chainable). */
  diagnosisDescription(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** DG1-5 Diagnosis Date/Time (chainable). */
  diagnosisDateTime(value: string, format?: never): this;
  /** DG1-5 Diagnosis Date/Time (chainable). */
  diagnosisDateTime(value: Date, format?: HL7DateTimeLayout): this;
  diagnosisDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[4] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** DG1-6 Diagnosis Type (chainable). */
  diagnosisType(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** DG1-7 Major Diagnostic Category (chainable). */
  majorDiagnosticCategory(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** DG1-8 Diagnostic Related Group (chainable). */
  diagnosticRelatedGroup(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }

  /** DG1-9 DRG Approval Indicator (chainable). */
  drgApprovalIndicator(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /** DG1-10 DRG Grouper Review Code (chainable). */
  drgGrouperReviewCode(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }

  /** DG1-11 Outlier Type (chainable). */
  outlierType(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /** DG1-12 Outlier Days (chainable). */
  outlierDays(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }

  /** DG1-13 Outlier Cost (chainable). */
  outlierCost(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }

  /** DG1-14 Grouper Version And Type (chainable). */
  grouperVersionAndType(value: string): this {
    this.fields[13] = this.createField(value);
    return this;
  }

  /** DG1-15 Diagnosis Priority (chainable). */
  diagnosisPriority(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }

  /**
   * DG1-16 Diagnosing Clinician (chainable).
   * @param id - DG1-16.1 ID Number
   * @param familyName - DG1-16.2 Family Name
   * @param givenName - DG1-16.3 Given Name
   */
  diagnosingClinician(
    id: string,
    familyName?: string,
    givenName?: string,
  ): this {
    const components = [id, familyName || "", givenName || ""];
    this.fields[15] = this.createField(components);
    return this;
  }

  /** DG1-17 Diagnosis Classification (chainable). */
  diagnosisClassification(value: string): this {
    this.fields[16] = this.createField(value);
    return this;
  }

  /** DG1-18 Confidential Indicator (chainable). */
  confidentialIndicator(value: string): this {
    this.fields[17] = this.createField(value);
    return this;
  }

  /** DG1-19 Attestation Date/Time (chainable). */
  attestationDateTime(value: string, format?: never): this;
  /** DG1-19 Attestation Date/Time (chainable). */
  attestationDateTime(value: Date, format?: HL7DateTimeLayout): this;
  attestationDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[18] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<DG1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "DG1") {
      return {
        ok: false,
        err: new Err(`Expected DG1 segment, got ${parts[0]}`),
      };
    }
    const seg = new DG1();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
