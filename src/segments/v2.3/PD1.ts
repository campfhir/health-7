/**
 * PD1 segment definition for HL7 v2.3.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";

/**
 * PD1 - Patient Additional Demographic Segment (HL7 v2.3)
 *
 * Contains additional patient demographic information beyond what is in PID.
 * Includes living arrangements, protection indicators, advance directives, etc.
 */
export class PD1 extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "PD1";
  constructor() {
    super();
    this.fields = [];
  }

  /** PD1-1 Living Dependency (chainable). */
  livingDependency(...dependencies: string[]): this {
    if (dependencies.length === 1) {
      this.fields[0] = this.createField(dependencies[0]);
    } else if (dependencies.length > 1) {
      this.fields[0] = this.createField([...dependencies.map((d) => [d])]);
    }
    return this;
  }

  /** PD1-2 Living Arrangement (chainable). */
  livingArrangement(arrangement: string): this {
    this.fields[1] = this.createField(arrangement);
    return this;
  }

  /**
   * PD1-3 Patient Primary Facility (chainable).
   * @param organizationName - PD1-3.1 Organization Name
   * @param idNumber - PD1-3.2 ID Number
   * @param checkDigit - PD1-3.3 Check Digit
   */
  patientPrimaryFacility(
    organizationName: string,
    idNumber?: string,
    checkDigit?: string,
  ): this {
    this.fields[2] = this.createComponentsField([
      organizationName,
      idNumber,
      checkDigit,
    ]);
    return this;
  }

  /**
   * PD1-4 Patient Primary Care Provider (chainable).
   * @param id - PD1-4.1 ID Number
   * @param familyName - PD1-4.2 Family Name
   * @param givenName - PD1-4.3 Given Name
   * @param middleName - PD1-4.4 Middle Name
   */
  patientPrimaryCareProvider(
    id: string,
    familyName: string,
    givenName?: string,
    middleName?: string,
  ): this {
    this.fields[3] = this.createComponentsField([
      id,
      familyName,
      givenName || "",
      middleName || "",
    ]);
    return this;
  }

  /** PD1-5 Student Indicator (chainable). */
  studentIndicator(indicator: string): this {
    this.fields[4] = this.createField(indicator);
    return this;
  }

  /** PD1-6 Handicap (chainable). */
  handicap(handicap: string): this {
    this.fields[5] = this.createField(handicap);
    return this;
  }

  /** PD1-7 Living Will Code (chainable). */
  livingWillCode(code: string): this {
    this.fields[6] = this.createField(code);
    return this;
  }

  /** PD1-8 Organ Donor Code (chainable). */
  organDonorCode(code: string): this {
    this.fields[7] = this.createField(code);
    return this;
  }

  /** PD1-9 Separate Bill (chainable). */
  separateBill(indicator: string): this {
    this.fields[8] = this.createField(indicator);
    return this;
  }

  /**
   * PD1-10 Duplicate Patient (chainable).
   * @param id - PD1-10.1 ID Number
   * @param assigningAuthority - PD1-10.4 Assigning Authority
   */
  duplicatePatient(id: string, assigningAuthority?: string): this {
    this.fields[9] = this.createComponentsField([
      id,
      "",
      "",
      assigningAuthority,
    ]);
    return this;
  }

  /**
   * PD1-11 Publicity Code (chainable).
   * @param code - PD1-11.1 Code
   * @param text - PD1-11.2 Text
   * @param codingSystem - PD1-11.3 Coding System
   */
  publicityCode(code: string, text?: string, codingSystem?: string): this {
    this.fields[10] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** PD1-12 Protection Indicator (chainable). */
  protectionIndicator(indicator: string): this {
    this.fields[11] = this.createField(indicator);
    return this;
  }

  /** PD1-13 Protection Indicator Effective Date (chainable). */
  protectionIndicatorEffectiveDate(date: string): this {
    this.fields[12] = this.createField(date);
    return this;
  }

  /** PD1-14 Place of Worship (chainable). */
  placeOfWorship(name: string): this {
    this.fields[13] = this.createField(name);
    return this;
  }

  /**
   * PD1-15 Advance Directive Code (chainable).
   * @param code - PD1-15.1 Code
   * @param text - PD1-15.2 Text
   * @param codingSystem - PD1-15.3 Coding System
   */
  advanceDirectiveCode(
    code: string,
    text?: string,
    codingSystem?: string,
  ): this {
    this.fields[14] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** PD1-16 Immunization Registry Status (chainable). */
  immunizationRegistryStatus(status: string): this {
    this.fields[15] = this.createField(status);
    return this;
  }

  /** PD1-17 Immunization Registry Status Effective Date (chainable). */
  immunizationRegistryStatusEffectiveDate(date: string): this {
    this.fields[16] = this.createField(date);
    return this;
  }

  /** PD1-18 Publicity Code Effective Date (chainable). */
  publicityCodeEffectiveDate(date: string): this {
    this.fields[17] = this.createField(date);
    return this;
  }

  /** PD1-19 Military Branch (chainable). */
  militaryBranch(branch: string): this {
    this.fields[18] = this.createField(branch);
    return this;
  }

  /** PD1-20 Military Rank/Grade (chainable). */
  militaryRankGrade(rank: string): this {
    this.fields[19] = this.createField(rank);
    return this;
  }

  /** PD1-21 Military Status (chainable). */
  militaryStatus(status: string): this {
    this.fields[20] = this.createField(status);
    return this;
  }

  /**
   * Get living arrangement
   */
  getLivingArrangement(): string {
    if (!this.fields[1]) {
      return "";
    }

    const field = this.fields[1];
    if (!field.components || field.components.length === 0) {
      return "";
    }

    const component = field.components[0];
    if (!component.subComponents || component.subComponents.length === 0) {
      return "";
    }

    return component.subComponents[0] || "";
  }

  /**
   * Get living will code
   */
  getLivingWillCode(): string {
    if (!this.fields[6]) {
      return "";
    }

    const field = this.fields[6];
    if (!field.components || field.components.length === 0) {
      return "";
    }

    const component = field.components[0];
    if (!component.subComponents || component.subComponents.length === 0) {
      return "";
    }

    return component.subComponents[0] || "";
  }

  /**
   * Get protection indicator
   */
  getProtectionIndicator(): string {
    if (!this.fields[11]) {
      return "";
    }

    const field = this.fields[11];
    if (!field.components || field.components.length === 0) {
      return "";
    }

    const component = field.components[0];
    if (!component.subComponents || component.subComponents.length === 0) {
      return "";
    }

    return component.subComponents[0] || "";
  }

  /**
   * Static factory method for parsing
   */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<PD1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    const segmentType = parts[0];

    if (segmentType !== "PD1") {
      return {
        ok: false,
        err: new Err(`Expected PD1 segment, got ${segmentType}`),
      };
    }

    const pd1 = new PD1();

    // Parse fields starting from index 1
    for (let i = 1; i < parts.length; i++) {
      if (parts[i] !== undefined) {
        pd1.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
      }
    }

    return { ok: true, val: pd1 };
  }
}
