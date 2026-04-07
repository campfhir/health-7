import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { BaseSegment } from "../../types/segment";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";

/**
 * IN2 - Insurance Additional Information Segment (HL7 v2.3)
 * Contains additional insurance policy coverage and insured information.
 */
export class IN2 extends BaseSegment {
  name = "IN2";

  constructor() {
    super();
    this.fields = [];
  }

  /** IN2-1: Insured's Employee ID (CX) */
  insuredEmployeeId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** IN2-2: Insured's Social Security Number (ST) */
  insuredSsn(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** IN2-3: Insured's Employer's Name and ID (XCN) */
  insuredEmployerName(id: string, familyName?: string, givenName?: string): this {
    this.fields[2] = this.createField([id, familyName || "", givenName || ""]);
    return this;
  }

  /** IN2-4: Employer Information Data (IS) */
  employerInfoData(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** IN2-6: Medicare Health Ins Card Number (ST) */
  medicareHicNumber(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** IN2-7: Medicaid Case Name (XPN) */
  medicaidCaseName(familyName: string, givenName?: string): this {
    this.fields[6] = this.createField([[familyName, givenName || ""]]);
    return this;
  }

  /** IN2-8: Medicaid Case Number (ST) */
  medicaidCaseNumber(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }

  /** IN2-26: Relationship to the Patient Start Date (DT) */
  relationshipStartDate(value: string): this {
    this.fields[25] = this.createField(value);
    return this;
  }

  /** IN2-27: Relationship to the Patient Stop Date (DT) */
  relationshipStopDate(value: string): this {
    this.fields[26] = this.createField(value);
    return this;
  }

  /** IN2-29: Medicaid Eligibility Status (IS) */
  medicaidEligibilityStatus(value: string): this {
    this.fields[28] = this.createField(value);
    return this;
  }

  /** IN2-63: Insured's Sex (IS) - e.g. M/F/U */
  insuredSex(value: string): this {
    this.fields[62] = this.createField(value);
    return this;
  }

  /** IN2-69: Relationship to the Patient (CE) */
  relationshipToPatient(code: string, text?: string): this {
    this.fields[68] = this.createField([code, text || ""]);
    return this;
  }

  /** IN2-72: Insured's Employment Status (CE) */
  insuredEmploymentStatus(code: string, text?: string): this {
    this.fields[71] = this.createField([code, text || ""]);
    return this;
  }

  static parse(segmentString: string, encoding: EncodingCharacters): Result<IN2> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "IN2") {
      return { ok: false, err: new Err(`Expected IN2 segment, got ${parts[0]}`) };
    }
    const seg = new IN2();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
