/**
 * STF segment definition for HL7 v2.3.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import {
  DateLayout,
  formatHL7Date,
  type HL7DateLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * STF - Staff Identification Segment
 *
 * Identifies a staff member (clinician, technician, etc.) in the master file.
 * Follows an MFE segment in an MFN^M02 message.
 *
 * HL7 v2.3 Specification
 */
export class STF extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "STF";

  constructor() {
    super();
    this.fields = [];
  }

  /**
   * STF-1 Primary Key Value - STF (chainable).
   * @param identifier - STF-1.1 Identifier
   * @param text - STF-1.2 Text
   * @param codingSystem - STF-1.3 Coding System
   */
  primaryKeyValue({ identifier, text, codingSystem }: { identifier: string; text?: string; codingSystem?: string }): this {
    this.fields[0] = this.createComponentsField([
      identifier,
      text,
      codingSystem,
    ]);
    return this;
  }

  /** STF-2 Staff Identifier List (chainable). */
  staffIdentifierList(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /**
   * STF-3 Staff Name (chainable).
   * @param familyName - STF-3.1 Family Name
   * @param givenName - STF-3.2 Given Name
   * @param middleName - STF-3.3 Middle Name
   * @param suffix - STF-3.4 Suffix
   * @param prefix - STF-3.5 Prefix
   */
  staffName({ familyName, givenName, middleName, suffix, prefix }: { familyName: string; givenName?: string; middleName?: string; suffix?: string; prefix?: string }): this {
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

  /** STF-4 Staff Type (chainable). */
  staffType(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** STF-5 Administrative Sex (chainable). */
  administrativeSex(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** STF-6 Date/Time of Birth (chainable). */
  dateTimeOfBirth(value: string, format?: never): this;
  /** STF-6 Date/Time of Birth (chainable). */
  dateTimeOfBirth(value: Date, format?: HL7DateLayout): this;
  dateTimeOfBirth(value: string | Date, format?: HL7DateLayout): this {
    this.fields[5] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** STF-7 Active/Inactive Flag (chainable). */
  activeInactiveFlag(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /**
   * STF-8 Department (chainable).
   * @param identifier - STF-8.1 Identifier
   * @param text - STF-8.2 Text
   */
  department({ identifier, text }: { identifier: string; text?: string }): this {
    if (text) {
      this.fields[7] = this.createField([identifier, text]);
    } else {
      this.fields[7] = this.createField(identifier);
    }
    return this;
  }

  /**
   * STF-9 Hospital Service (chainable).
   * @param identifier - STF-9.1 Identifier
   * @param text - STF-9.2 Text
   */
  hospitalService({ identifier, text }: { identifier: string; text?: string }): this {
    if (text) {
      this.fields[8] = this.createField([identifier, text]);
    } else {
      this.fields[8] = this.createField(identifier);
    }
    return this;
  }

  /** STF-10 Phone (chainable). */
  phone(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }

  /** STF-11 Office/Home Address (chainable). */
  address(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /**
   * STF-12 Institution Activation Date (chainable).
   * @param date - STF-12.1 Date
   * @param institutionName - STF-12.2 Institution Name
   */
  institutionActivationDate({ date, institutionName }: { date: string; institutionName?: string }): this {
    this.fields[11] = this.createComponentsField([date, institutionName]);
    return this;
  }

  /**
   * STF-13 Institution Inactivation Date (chainable).
   * @param date - STF-13.1 Date
   * @param institutionName - STF-13.2 Institution Name
   */
  institutionInactivationDate({ date, institutionName }: { date: string; institutionName?: string }): this {
    this.fields[12] = this.createComponentsField([date, institutionName]);
    return this;
  }

  /**
   * STF-14 Backup Person ID (chainable).
   * @param code - STF-14.1 Identifier
   * @param text - STF-14.2 Text
   * @param codingSystem - STF-14.3 Name of Coding System
   */
  backupPersonId({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[13] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** STF-15 E-Mail Address (chainable). */
  emailAddress(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }

  /**
   * STF-16 Preferred Method of Contact (chainable).
   * @param code - STF-16.1 Identifier
   * @param text - STF-16.2 Text
   * @param codingSystem - STF-16.3 Name of Coding System
   */
  preferredMethodOfContact({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[15] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * STF-17 Marital Status (chainable).
   * @param code - STF-17.1 Identifier
   * @param text - STF-17.2 Text
   * @param codingSystem - STF-17.3 Name of Coding System
   */
  maritalStatus({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[16] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** STF-18 Job Title (chainable). */
  jobTitle(value: string): this {
    this.fields[17] = this.createField(value);
    return this;
  }

  /**
   * STF-19 Job Code/Class (chainable).
   * @param jobCode - STF-19.1 Job Code
   * @param jobClass - STF-19.2 Job Class
   */
  jobCodeClass({ jobCode, jobClass }: { jobCode: string; jobClass?: string }): this {
    this.fields[18] = this.createComponentsField([jobCode, jobClass]);
    return this;
  }

  /**
   * STF-20 Employment Status Code (chainable).
   * @param code - STF-20.1 Identifier
   * @param text - STF-20.2 Text
   * @param codingSystem - STF-20.3 Name of Coding System
   */
  employmentStatusCode({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[19] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** STF-21 Additional Insured on Auto (chainable). */
  additionalInsuredOnAuto(value: string): this {
    this.fields[20] = this.createField(value);
    return this;
  }

  /**
   * STF-22 Driver's License Number - Staff (chainable).
   * @param licenseNumber - STF-22.1 License Number
   * @param issuingAuthority - STF-22.2 Issuing State, Province, Country
   * @param expirationDate - STF-22.3 Expiration Date
   */
  driversLicenseNumber({ licenseNumber, issuingAuthority, expirationDate }: { licenseNumber: string; issuingAuthority?: string; expirationDate?: string }): this {
    this.fields[21] = this.createComponentsField([
      licenseNumber,
      issuingAuthority,
      expirationDate,
    ]);
    return this;
  }

  /** STF-23 Copy Auto Ins (chainable). */
  copyAutoIns(value: string): this {
    this.fields[22] = this.createField(value);
    return this;
  }

  /** STF-24 Auto Ins. Expires (chainable). */
  autoInsExpires(value: string): this {
    this.fields[23] = this.createField(value);
    return this;
  }

  /** STF-25 Date Last DMV Review (chainable). */
  dateLastDmvReview(value: string): this {
    this.fields[24] = this.createField(value);
    return this;
  }

  /** STF-26 Date Next DMV Review (chainable). */
  dateNextDmvReview(value: string): this {
    this.fields[25] = this.createField(value);
    return this;
  }

  /** Get primary key value. */
  getPrimaryKeyValue(): string {
    return this.fields[0]?.components[0]?.subComponents[0] ?? "";
  }

  /** Get staff name. */
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

  /** Get active inactive flag. */
  getActiveInactiveFlag(): string {
    return this.fields[6]?.components[0]?.subComponents[0] ?? "";
  }

  /** Parses the input string into a structured instance. */
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
