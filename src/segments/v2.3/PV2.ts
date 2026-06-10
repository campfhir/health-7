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

  /** PV2-1: Prior Pending Location (PL) */
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

  /** PV2-2: Accommodation Code (CE) */
  accommodationCode(code: string, text?: string, codingSystem?: string): this {
    this.fields[1] = this.createField([[code, text || "", codingSystem || ""]]);
    return this;
  }

  /** PV2-3: Admit Reason (CE) */
  admitReason(code: string, text?: string, codingSystem?: string): this {
    this.fields[2] = this.createField([[code, text || "", codingSystem || ""]]);
    return this;
  }

  /** PV2-4: Transfer Reason (CE) */
  transferReason(code: string, text?: string, codingSystem?: string): this {
    this.fields[3] = this.createField([[code, text || "", codingSystem || ""]]);
    return this;
  }

  /** PV2-5: Patient Valuables (ST) */
  patientValuables(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** PV2-6: Patient Valuables Location (ST) */
  patientValuablesLocation(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** PV2-7: Visit User Code (IS) */
  visitUserCode(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** PV2-8: Expected Admit Date/Time (TS) */
  expectedAdmitDateTime(value: string, format?: never): this;
  /** Sets the expected admit date time field (chainable). */
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

  /** PV2-9: Expected Discharge Date/Time (TS) */
  expectedDischargeDateTime(value: string, format?: never): this;
  /** Sets the expected discharge date time field (chainable). */
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

  /** PV2-10: Estimated Length of Inpatient Stay (NM) */
  estimatedLengthOfStay(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }

  /** PV2-11: Actual Length of Inpatient Stay (NM) */
  actualLengthOfStay(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /** PV2-12: Visit Description (ST) */
  visitDescription(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }

  /** PV2-13: Referral Source Code (XCN) */
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

  /** PV2-14: Previous Service Date (DT) */
  previousServiceDate(value: string, format?: never): this;
  /** Sets the previous service date field (chainable). */
  previousServiceDate(value: Date, format?: HL7DateLayout): this;
  previousServiceDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[13] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** PV2-15: Employment Illness Related Indicator (ID) */
  employmentIllnessRelated(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }

  /** PV2-16: Purge Status Code (IS) */
  purgeStatusCode(value: string): this {
    this.fields[15] = this.createField(value);
    return this;
  }

  /** PV2-17: Purge Status Date (DT) */
  purgeStatusDate(value: string, format?: never): this;
  /** Sets the purge status date field (chainable). */
  purgeStatusDate(value: Date, format?: HL7DateLayout): this;
  purgeStatusDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[16] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** PV2-18: Special Program Code (IS) */
  specialProgramCode(value: string): this {
    this.fields[17] = this.createField(value);
    return this;
  }

  /** PV2-19: Retention Indicator (ID) */
  retentionIndicator(value: string): this {
    this.fields[18] = this.createField(value);
    return this;
  }

  /** PV2-20: Expected Number of Insurance Plans (NM) */
  expectedNumberOfInsurancePlans(value: string): this {
    this.fields[19] = this.createField(value);
    return this;
  }

  /** PV2-21: Visit Publicity Code (IS) */
  visitPublicityCode(value: string): this {
    this.fields[20] = this.createField(value);
    return this;
  }

  /** PV2-22: Visit Protection Indicator (ID) */
  visitProtectionIndicator(value: string): this {
    this.fields[21] = this.createField(value);
    return this;
  }

  /** PV2-25: Visit Priority Code (IS) */
  visitPriorityCode(value: string): this {
    this.fields[24] = this.createField(value);
    return this;
  }

  /** PV2-38: Mode of Arrival Code (CE) */
  modeOfArrivalCode(code: string, text?: string): this {
    this.fields[37] = this.createField([[code, text || ""]]);
    return this;
  }

  /** PV2-41: Indirect Exposure Mechanism (IS) */
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
