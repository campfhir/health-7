/**
 * PV2 segment definition for HL7 v2.3.
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
  type HL7DateLayout,
  DateTimeLayout,
  type HL7DateTimeLayout,
  DateLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * PV2 - Patient Visit - Additional Information Segment (HL7 v2.3)
 */
export class PV2 extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "PV2";

  constructor() {
    super();
    this.fields = [];
  }

  /**
   * PV2-1 Prior Pending Location (chainable).
   * @param pointOfCare - PV2-1.1 Point of Care
   * @param room - PV2-1.2 Room
   * @param bed - PV2-1.3 Bed
   * @param facility - PV2-1.4 Facility
   */
  priorPendingLocation(
    pointOfCare: string,
    room?: string,
    bed?: string,
    facility?: string,
  ): this {
    this.fields[0] = this.createField([
      [pointOfCare, room || "", bed || "", facility || ""],
    ]);
    return this;
  }

  /**
   * PV2-2 Accommodation Code (chainable).
   * @param code - PV2-2.1 Code
   * @param text - PV2-2.2 Text
   * @param codingSystem - PV2-2.3 Coding System
   */
  accommodationCode(code: string, text?: string, codingSystem?: string): this {
    this.fields[1] = this.createField([[code, text || "", codingSystem || ""]]);
    return this;
  }

  /**
   * PV2-3 Admit Reason (chainable).
   * @param code - PV2-3.1 Code
   * @param text - PV2-3.2 Text
   * @param codingSystem - PV2-3.3 Coding System
   */
  admitReason(code: string, text?: string, codingSystem?: string): this {
    this.fields[2] = this.createField([[code, text || "", codingSystem || ""]]);
    return this;
  }

  /**
   * PV2-4 Transfer Reason (chainable).
   * @param code - PV2-4.1 Code
   * @param text - PV2-4.2 Text
   * @param codingSystem - PV2-4.3 Coding System
   */
  transferReason(code: string, text?: string, codingSystem?: string): this {
    this.fields[3] = this.createField([[code, text || "", codingSystem || ""]]);
    return this;
  }

  /** PV2-5 Patient Valuables (chainable). */
  patientValuables(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** PV2-6 Patient Valuables Location (chainable). */
  patientValuablesLocation(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** PV2-7 Visit User Code (chainable). */
  visitUserCode(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** PV2-8 Expected Admit Date/Time (chainable). */
  expectedAdmitDateTime(value: string, format?: never): this;
  /** PV2-8 Expected Admit Date/Time (chainable). */
  expectedAdmitDateTime(value: Date, format?: HL7DateTimeLayout): this;
  expectedAdmitDateTime(
    value: string | Date,
    format?: HL7DateTimeLayout,
  ): this {
    this.fields[7] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** PV2-9 Expected Discharge Date/Time (chainable). */
  expectedDischargeDateTime(value: string, format?: never): this;
  /** PV2-9 Expected Discharge Date/Time (chainable). */
  expectedDischargeDateTime(value: Date, format?: HL7DateTimeLayout): this;
  expectedDischargeDateTime(
    value: string | Date,
    format?: HL7DateTimeLayout,
  ): this {
    this.fields[8] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** PV2-10 Estimated Length of Inpatient Stay (chainable). */
  estimatedLengthOfStay(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }

  /** PV2-11 Actual Length of Inpatient Stay (chainable). */
  actualLengthOfStay(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /** PV2-12 Visit Description (chainable). */
  visitDescription(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }

  /**
   * PV2-13 Referral Source Code (chainable).
   * @param id - PV2-13.1 ID Number
   * @param familyName - PV2-13.2 Family Name
   * @param givenName - PV2-13.3 Given Name
   */
  referralSourceCode(
    id: string,
    familyName?: string,
    givenName?: string,
  ): this {
    this.fields[12] = this.createField([
      [id, familyName || "", givenName || ""],
    ]);
    return this;
  }

  /** PV2-14 Previous Service Date (chainable). */
  previousServiceDate(value: string, format?: never): this;
  /** PV2-14 Previous Service Date (chainable). */
  previousServiceDate(value: Date, format?: HL7DateLayout): this;
  previousServiceDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[13] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** PV2-15 Employment Illness Related Indicator (chainable). */
  employmentIllnessRelated(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }

  /** PV2-16 Purge Status Code (chainable). */
  purgeStatusCode(value: string): this {
    this.fields[15] = this.createField(value);
    return this;
  }

  /** PV2-17 Purge Status Date (chainable). */
  purgeStatusDate(value: string, format?: never): this;
  /** PV2-17 Purge Status Date (chainable). */
  purgeStatusDate(value: Date, format?: HL7DateLayout): this;
  purgeStatusDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[16] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** PV2-18 Special Program Code (chainable). */
  specialProgramCode(value: string): this {
    this.fields[17] = this.createField(value);
    return this;
  }

  /** PV2-19 Retention Indicator (chainable). */
  retentionIndicator(value: string): this {
    this.fields[18] = this.createField(value);
    return this;
  }

  /** PV2-20 Expected Number of Insurance Plans (chainable). */
  expectedNumberOfInsurancePlans(value: string): this {
    this.fields[19] = this.createField(value);
    return this;
  }

  /** PV2-21 Visit Publicity Code (chainable). */
  visitPublicityCode(value: string): this {
    this.fields[20] = this.createField(value);
    return this;
  }

  /** PV2-22 Visit Protection Indicator (chainable). */
  visitProtectionIndicator(value: string): this {
    this.fields[21] = this.createField(value);
    return this;
  }

  /** PV2-25 Visit Priority Code (chainable). */
  visitPriorityCode(value: string): this {
    this.fields[24] = this.createField(value);
    return this;
  }

  /**
   * PV2-38 Mode of Arrival Code (chainable).
   * @param code - PV2-38.1 Code
   * @param text - PV2-38.2 Text
   */
  modeOfArrivalCode(code: string, text?: string): this {
    this.fields[37] = this.createField([[code, text || ""]]);
    return this;
  }

  /** PV2-41 Indirect Exposure Mechanism (chainable). */
  indirectExposureMechanism(value: string): this {
    this.fields[40] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<PV2> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "PV2") {
      return {
        ok: false,
        err: new Err(`Expected PV2 segment, got ${parts[0]}`),
      };
    }
    const seg = new PV2();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
