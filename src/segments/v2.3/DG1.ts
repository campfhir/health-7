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

  /**
   * DG1-1: Set ID (SI, required)
   * Sequence number of this segment within the message.
   */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /**
   * DG1-2: Diagnosis Coding Method (ID, optional, deprecated)
   * Retained for backward compatibility; use DG1-3 coding system instead.
   */
  diagnosisCodingMethod(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /**
   * DG1-3: Diagnosis Code (CE, required)
   * The diagnosis code (e.g., codingSystem "I10" for ICD-10).
   */
  diagnosisCode(code: string, text?: string, codingSystem?: string): this {
    const components = [code, text || "", codingSystem || ""];
    this.fields[2] = this.createField(components);
    return this;
  }

  /**
   * DG1-4: Diagnosis Description (ST, optional, deprecated)
   * Retained for backward compatibility; use DG1-3 text component instead.
   */
  diagnosisDescription(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /**
   * DG1-5: Diagnosis Date/Time (TS, optional)
   * The date/time the diagnosis was determined.
   */
  diagnosisDateTime(value: string, format?: never): this;
  /** Sets the diagnosis date time field (chainable). */
  diagnosisDateTime(value: Date, format?: HL7DateTimeLayout): this;
  diagnosisDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[4] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /**
   * DG1-6: Diagnosis Type (IS, required)
   * The type of diagnosis (e.g., A=Admitting, W=Working, F=Final).
   */
  diagnosisType(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /**
   * DG1-7: Major Diagnostic Category (CE, optional)
   * The major diagnostic category (MDC) for this diagnosis.
   */
  majorDiagnosticCategory(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /**
   * DG1-8: Diagnostic Related Group (CE, optional)
   * The DRG assigned to this diagnosis.
   */
  diagnosticRelatedGroup(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }

  /**
   * DG1-9: DRG Approval Indicator (ID, optional)
   * Indicates whether the DRG has been approved (Y/N).
   */
  drgApprovalIndicator(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /**
   * DG1-10: DRG Grouper Review Code (IS, optional)
   * Code indicating the DRG grouper review result.
   */
  drgGrouperReviewCode(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }

  /**
   * DG1-11: Outlier Type (CE, optional)
   * The type of outlier (cost or day) that occurred.
   */
  outlierType(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /**
   * DG1-12: Outlier Days (NM, optional)
   * The number of outlier days.
   */
  outlierDays(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }

  /**
   * DG1-13: Outlier Cost (CP, optional)
   * The amount of money associated with the outlier.
   */
  outlierCost(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }

  /**
   * DG1-14: Grouper Version And Type (ST, optional)
   * The version and type of the DRG grouper.
   */
  grouperVersionAndType(value: string): this {
    this.fields[13] = this.createField(value);
    return this;
  }

  /**
   * DG1-15: Diagnosis Priority (NM, optional)
   * The priority ranking of this diagnosis (1=highest).
   */
  diagnosisPriority(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }

  /**
   * DG1-16: Diagnosing Clinician (XCN, optional)
   * The clinician who made the diagnosis.
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

  /**
   * DG1-17: Diagnosis Classification (IS, optional)
   * Classification of the diagnosis (e.g., C=Consultation, D=Diagnosis, M=Medication).
   */
  diagnosisClassification(value: string): this {
    this.fields[16] = this.createField(value);
    return this;
  }

  /**
   * DG1-18: Confidential Indicator (ID, optional)
   * Indicates whether the diagnosis is confidential (Y/N).
   */
  confidentialIndicator(value: string): this {
    this.fields[17] = this.createField(value);
    return this;
  }

  /**
   * DG1-19: Attestation Date/Time (TS, optional)
   * The date/time the diagnosis was attested.
   */
  attestationDateTime(value: string, format?: never): this;
  /** Sets the attestation date time field (chainable). */
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
