import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { BaseSegment } from "../../types/segment";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import {
  DateLayout,
  formatHL7Date,
  HL7DateLayout,
} from "../../utils/hl7DateUtils";

/**
 * PRA - Practitioner Detail Segment
 *
 * Provides additional detail about a practitioner (physician, etc.).
 * Optionally follows an STF segment in an MFN^M02 message.
 *
 * HL7 v2.3 Specification
 */
export class PRA extends BaseSegment {
  name = "PRA";

  constructor() {
    super();
    this.fields = [];
  }

  /** PRA-1: Primary Key Value - PRA (CE) */
  primaryKeyValue(
    identifier: string,
    text?: string,
    codingSystem?: string,
  ): this {
    if (text || codingSystem) {
      this.fields[0] = this.createField([
        [identifier, text || "", codingSystem || ""],
      ]);
    } else {
      this.fields[0] = this.createField(identifier);
    }
    return this;
  }

  /** PRA-2: Practitioner Group (CE) */
  practitionerGroup(identifier: string, text?: string): this {
    if (text) {
      this.fields[1] = this.createField([identifier, text]);
    } else {
      this.fields[1] = this.createField(identifier);
    }
    return this;
  }

  /** PRA-3: Practitioner Category (IS) e.g., "OP" (Outpatient), "IP" (Inpatient) */
  practitionerCategory(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** PRA-4: Provider Billing (ID) e.g., "I" (Institution), "P" (Physician) */
  providerBilling(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /**
   * PRA-5: Specialty (SPD)
   * Components: specialtyName^governingBoard^eligibleOrCertified^dateOfCertification
   */
  specialty(
    specialtyName: string,
    governingBoard?: string,
    eligibleOrCertified?: string,
    dateOfCertification?: string,
  ): this {
    const components = [
      specialtyName,
      governingBoard ?? "",
      eligibleOrCertified ?? "",
      dateOfCertification ?? "",
    ];
    this.fields[4] = this.createField(components);
    return this;
  }

  /**
   * PRA-6: Practitioner ID Numbers (PLN)
   * Components: idNumber^typeOfIdNumber^stateOtherQualifying^expireDate
   */
  practitionerIdNumbers(
    idNumber: string,
    typeOfIdNumber?: string,
    stateOrQualifying?: string,
    expireDate?: string,
  ): this {
    const components = [
      idNumber,
      typeOfIdNumber ?? "",
      stateOrQualifying ?? "",
      expireDate ?? "",
    ];
    this.fields[5] = this.createField(components);
    return this;
  }

  /** PRA-8: Date Entered Practice (DT) */
  dateEnteredPractice(value: string, format?: never): this;
  dateEnteredPractice(value: Date, format?: HL7DateLayout): this;
  dateEnteredPractice(value: string | Date, format?: HL7DateLayout): this {
    this.fields[7] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  getPrimaryKeyValue(): string {
    return this.fields[0]?.components[0]?.subComponents[0] ?? "";
  }

  getPractitionerCategory(): string {
    return this.fields[2]?.components[0]?.subComponents[0] ?? "";
  }

  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<PRA> {
    const parts = segmentString.split(encoding.fieldSeparator);

    if (parts[0] !== "PRA") {
      return {
        ok: false,
        err: new Err(`Expected PRA segment, got ${parts[0]}`),
      };
    }

    const pra = new PRA();
    for (let i = 1; i < parts.length; i++) {
      pra.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }

    return { ok: true, val: pra };
  }
}
