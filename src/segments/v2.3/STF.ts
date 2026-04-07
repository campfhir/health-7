import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { BaseSegment } from "../../types/segment";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";

/**
 * STF - Staff Identification Segment
 *
 * Identifies a staff member (clinician, technician, etc.) in the master file.
 * Follows an MFE segment in an MFN^M02 message.
 *
 * HL7 v2.3 Specification
 */
export class STF extends BaseSegment {
  name = "STF";

  constructor() {
    super();
    this.fields = [];
  }

  /** STF-1: Primary Key Value - STF (CE) */
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

  /** STF-2: Staff Identifier List (CX) - repeating, use repetitionSeparator between values */
  staffIdentifierList(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /**
   * STF-3: Staff Name (XPN)
   * Components: family^given^middle^suffix^prefix^degree^nameTypeCode
   */
  staffName(
    familyName: string,
    givenName?: string,
    middleName?: string,
    suffix?: string,
    prefix?: string,
  ): this {
    const components = [
      familyName,
      givenName ?? "",
      middleName ?? "",
      suffix ?? "",
      prefix ?? "",
    ];
    this.fields[2] = this.createField(components);
    return this;
  }

  /** STF-4: Staff Type (IS) e.g., "MD", "RN", "PN" */
  staffType(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** STF-5: Administrative Sex (IS) e.g., "M", "F", "U" */
  administrativeSex(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** STF-6: Date/Time of Birth (TS) */
  dateTimeOfBirth(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** STF-7: Active/Inactive Flag (ID) e.g., "A" (Active), "I" (Inactive) */
  activeInactiveFlag(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** STF-8: Department (CE) */
  department(identifier: string, text?: string): this {
    if (text) {
      this.fields[7] = this.createField([identifier, text]);
    } else {
      this.fields[7] = this.createField(identifier);
    }
    return this;
  }

  /** STF-9: Hospital Service (CE) */
  hospitalService(identifier: string, text?: string): this {
    if (text) {
      this.fields[8] = this.createField([identifier, text]);
    } else {
      this.fields[8] = this.createField(identifier);
    }
    return this;
  }

  /** STF-10: Phone (XTN) */
  phone(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }

  /** STF-11: Office/Home Address (XAD) */
  address(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /** STF-15: E-Mail Address (ST) */
  emailAddress(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }

  /** STF-18: Job Title (ST) */
  jobTitle(value: string): this {
    this.fields[17] = this.createField(value);
    return this;
  }

  getPrimaryKeyValue(): string {
    return this.fields[0]?.components[0]?.subComponents[0] ?? "";
  }

  getStaffName(): {
    familyName: string;
    givenName: string;
    middleName: string;
  } {
    const field = this.fields[2];
    if (!field) return { familyName: "", givenName: "", middleName: "" };
    return {
      familyName: field.components[0]?.subComponents[0] ?? "",
      givenName: field.components[1]?.subComponents[0] ?? "",
      middleName: field.components[2]?.subComponents[0] ?? "",
    };
  }

  getActiveInactiveFlag(): string {
    return this.fields[6]?.components[0]?.subComponents[0] ?? "";
  }

  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<STF> {
    const parts = segmentString.split(encoding.fieldSeparator);

    if (parts[0] !== "STF") {
      return {
        ok: false,
        err: new Err(`Expected STF segment, got ${parts[0]}`),
      };
    }

    const stf = new STF();
    for (let i = 1; i < parts.length; i++) {
      stf.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }

    return { ok: true, val: stf };
  }
}
