/**
 * PV2 segment definition for HL7 v2.5.1.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { PV2 as PV2_base } from "../v2.3/PV2.ts";
import {
  DateLayout,
  DateTimeLayout,
  formatHL7Date,
  type HL7DateLayout,
  type HL7DateTimeLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * PV2 segment (HL7 v2.5.1)
 * Extends v2.3 PV2. Add v2.5.1-specific fields here as needed.
 */
export class PV2 extends PV2_base {
  /**
   * PV2-39 Recreational Drug Use Code (chainable).
   * @param code - PV2-39.1 Identifier
   * @param text - PV2-39.2 Text
   * @param codingSystem - PV2-39.3 Name of Coding System
   */
  recreationalDrugUseCode(
    code: string,
    text?: string,
    codingSystem?: string,
  ): this {
    this.fields[38] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * PV2-40 Admission Level of Care Code (chainable).
   * @param code - PV2-40.1 Identifier
   * @param text - PV2-40.2 Text
   * @param codingSystem - PV2-40.3 Name of Coding System
   */
  admissionLevelOfCareCode(
    code: string,
    text?: string,
    codingSystem?: string,
  ): this {
    this.fields[39] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * PV2-41 Precaution Code (chainable).
   * @param code - PV2-41.1 Identifier
   * @param text - PV2-41.2 Text
   * @param codingSystem - PV2-41.3 Name of Coding System
   */
  precautionCode(code: string, text?: string, codingSystem?: string): this {
    this.fields[40] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * PV2-42 Patient Condition Code (chainable).
   * @param code - PV2-42.1 Identifier
   * @param text - PV2-42.2 Text
   * @param codingSystem - PV2-42.3 Name of Coding System
   */
  patientConditionCode(
    code: string,
    text?: string,
    codingSystem?: string,
  ): this {
    this.fields[41] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** PV2-43 Living Will Code (chainable). */
  livingWillCode(value: string): this {
    this.fields[42] = this.createField(value);
    return this;
  }

  /** PV2-44 Organ Donor Code (chainable). */
  organDonorCode(value: string): this {
    this.fields[43] = this.createField(value);
    return this;
  }

  /**
   * PV2-45 Advance Directive Code (chainable).
   * @param code - PV2-45.1 Identifier
   * @param text - PV2-45.2 Text
   * @param codingSystem - PV2-45.3 Name of Coding System
   */
  advanceDirectiveCode(
    code: string,
    text?: string,
    codingSystem?: string,
  ): this {
    this.fields[44] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** PV2-46 Patient Status Effective Date (chainable). */
  patientStatusEffectiveDate(value: string, format?: never): this;
  /** PV2-46 Patient Status Effective Date (chainable). */
  patientStatusEffectiveDate(value: Date, format?: HL7DateLayout): this;
  patientStatusEffectiveDate(
    value: string | Date,
    format?: HL7DateLayout,
  ): this {
    this.fields[45] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** PV2-47 Expected LOA Return Date/Time (chainable). */
  expectedLoaReturnDateTime(value: string, format?: never): this;
  /** PV2-47 Expected LOA Return Date/Time (chainable). */
  expectedLoaReturnDateTime(value: Date, format?: HL7DateTimeLayout): this;
  expectedLoaReturnDateTime(
    value: string | Date,
    format?: HL7DateTimeLayout,
  ): this {
    this.fields[46] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** PV2-48 Expected Pre-admission Testing Date/Time (chainable). */
  expectedPreAdmissionTestingDateTime(value: string, format?: never): this;
  /** PV2-48 Expected Pre-admission Testing Date/Time (chainable). */
  expectedPreAdmissionTestingDateTime(
    value: Date,
    format?: HL7DateTimeLayout,
  ): this;
  expectedPreAdmissionTestingDateTime(
    value: string | Date,
    format?: HL7DateTimeLayout,
  ): this {
    this.fields[47] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** PV2-49 Notify Clergy Code (chainable). */
  notifyClergyCode(value: string): this {
    this.fields[48] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<PV2> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "PV2") {
      return { ok: false, err: new Err(`Expected PV2 segment, got ${parts[0]}`) };
    }
    const seg = new PV2();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
