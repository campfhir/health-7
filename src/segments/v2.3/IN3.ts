import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import {
  formatHL7Date,
  type HL7DateLayout,
  DateTimeLayout,
  type HL7DateTimeLayout,
  DateLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * IN3 - Insurance Additional Information, Certification Segment (HL7 v2.3)
 * Communicates certification and pre-authorization information for insurance coverage.
 */
export class IN3 extends BaseSegment {
  name = "IN3";

  constructor() {
    super();
    this.fields = [];
  }

  /** IN3-1: Set ID (SI, required) */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** IN3-2: Certification Number (CX) */
  certificationNumber(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** IN3-3: Certified By (XCN) */
  certifiedBy(id: string, familyName?: string, givenName?: string): this {
    this.fields[2] = this.createField([id, familyName || "", givenName || ""]);
    return this;
  }

  /** IN3-4: Certification Required (ID) - Y/N */
  certificationRequired(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** IN3-5: Penalty (MOP) - money or percentage */
  penalty(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** IN3-6: Certification Date/Time (TS) */
  certificationDateTime(value: string, format?: never): this;
  certificationDateTime(value: Date, format?: HL7DateTimeLayout): this;
  certificationDateTime(
    value: string | Date,
    format?: HL7DateTimeLayout,
  ): this {
    this.fields[5] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** IN3-7: Certification Modify Date/Time (TS) */
  certificationModifyDateTime(value: string, format?: never): this;
  certificationModifyDateTime(value: Date, format?: HL7DateTimeLayout): this;
  certificationModifyDateTime(
    value: string | Date,
    format?: HL7DateTimeLayout,
  ): this {
    this.fields[6] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** IN3-8: Operator (XCN) */
  operator(id: string, familyName?: string, givenName?: string): this {
    this.fields[7] = this.createField([id, familyName || "", givenName || ""]);
    return this;
  }

  /** IN3-9: Certification Begin Date (DT) */
  certificationBeginDate(value: string, format?: never): this;
  certificationBeginDate(value: Date, format?: HL7DateLayout): this;
  certificationBeginDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[8] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** IN3-10: Certification End Date (DT) */
  certificationEndDate(value: string, format?: never): this;
  certificationEndDate(value: Date, format?: HL7DateLayout): this;
  certificationEndDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[9] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** IN3-11: Days (DTN) - number of days certified */
  days(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /** IN3-12: Non-Concur Code/Description (CE) */
  nonConcurCodeDescription(code: string, text?: string): this {
    this.fields[11] = this.createField([code, text || ""]);
    return this;
  }

  /** IN3-13: Non-Concur Effective Date/Time (TS) */
  nonConcurEffectiveDateTime(value: string, format?: never): this;
  nonConcurEffectiveDateTime(value: Date, format?: HL7DateTimeLayout): this;
  nonConcurEffectiveDateTime(
    value: string | Date,
    format?: HL7DateTimeLayout,
  ): this {
    this.fields[12] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** IN3-14: Physician Reviewer (XCN) */
  physicianReviewer(id: string, familyName?: string, givenName?: string): this {
    this.fields[13] = this.createField([id, familyName || "", givenName || ""]);
    return this;
  }

  /** IN3-15: Certification Contact (ST) */
  certificationContact(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }

  /** IN3-16: Certification Contact Phone Number (XTN) */
  certificationContactPhone(value: string): this {
    this.fields[15] = this.createField(value);
    return this;
  }

  /** IN3-17: Appeal Reason (CE) */
  appealReason(code: string, text?: string): this {
    this.fields[16] = this.createField([code, text || ""]);
    return this;
  }

  /** IN3-18: Certification Agency (CE) */
  certificationAgency(code: string, text?: string): this {
    this.fields[17] = this.createField([code, text || ""]);
    return this;
  }

  /** IN3-19: Certification Agency Phone Number (XTN) */
  certificationAgencyPhone(value: string): this {
    this.fields[18] = this.createField(value);
    return this;
  }

  /** IN3-20: Pre-Certification Required (ICD) */
  preCertificationRequired(value: string): this {
    this.fields[19] = this.createField(value);
    return this;
  }

  /** IN3-21: Case Manager (ST) */
  caseManager(value: string): this {
    this.fields[20] = this.createField(value);
    return this;
  }

  /** IN3-22: Second Opinion Date (DT) */
  secondOpinionDate(value: string, format?: never): this;
  secondOpinionDate(value: Date, format?: HL7DateLayout): this;
  secondOpinionDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[21] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** IN3-23: Second Opinion Status (IS) */
  secondOpinionStatus(value: string): this {
    this.fields[22] = this.createField(value);
    return this;
  }

  /** IN3-24: Second Opinion Documentation Received (IS) */
  secondOpinionDocumentationReceived(value: string): this {
    this.fields[23] = this.createField(value);
    return this;
  }

  /** IN3-25: Second Opinion Physician (XCN) */
  secondOpinionPhysician(
    id: string,
    familyName?: string,
    givenName?: string,
  ): this {
    this.fields[24] = this.createField([id, familyName || "", givenName || ""]);
    return this;
  }

  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<IN3> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "IN3") {
      return {
        ok: false,
        err: new Err(`Expected IN3 segment, got ${parts[0]}`),
      };
    }
    const seg = new IN3();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
