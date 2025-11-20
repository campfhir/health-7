import { BaseSegment } from "../../types/segment";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";

/**
 * PD1 - Patient Additional Demographic Segment
 *
 * Contains additional patient demographic information beyond what is in PID.
 * Includes living arrangements, protection indicators, advance directives, etc.
 *
 * HL7 v2.5.1 Specification
 */
export class PD1 extends BaseSegment {
  name = "PD1";
  constructor() {
    super();
    this.fields = [];
  }

  /**
   * PD1-1: Living Dependency (IS)
   * Patient's living arrangement
   * Examples: C (Small Children), M (Medical Supervision), S (Spouse)
   */
  livingDependency(...dependencies: string[]): this {
    if (dependencies.length === 1) {
      this.fields[0] = this.createField(dependencies[0]);
    } else if (dependencies.length > 1) {
      this.fields[0] = this.createField([...dependencies.map((d) => [d])]);
    }
    return this;
  }

  /**
   * PD1-2: Living Arrangement (IS)
   * Type of living arrangement
   * Examples: A (Alone), F (Family), I (Institution), R (Relative)
   */
  livingArrangement(arrangement: string): this {
    this.fields[1] = this.createField(arrangement);
    return this;
  }

  /**
   * PD1-3: Patient Primary Facility (XON)
   * Patient's primary healthcare facility
   */
  patientPrimaryFacility(
    organizationName: string,
    idNumber?: string,
    checkDigit?: string,
  ): this {
    if (idNumber || checkDigit) {
      this.fields[2] = this.createField([
        [organizationName, idNumber || "", checkDigit || ""],
      ]);
    } else {
      this.fields[2] = this.createField(organizationName);
    }
    return this;
  }

  /**
   * PD1-4: Patient Primary Care Provider Name & ID No. (XCN)
   * Primary care physician
   */
  patientPrimaryCareProvider(
    id: string,
    familyName: string,
    givenName?: string,
    middleName?: string,
  ): this {
    this.fields[3] = this.createField([
      [id, familyName, givenName || "", middleName || ""],
    ]);
    return this;
  }

  /**
   * PD1-5: Student Indicator (IS)
   * Whether patient is a student
   * F = Full-time, P = Part-time, N = Not a student
   */
  studentIndicator(indicator: string): this {
    this.fields[4] = this.createField(indicator);
    return this;
  }

  /**
   * PD1-6: Handicap (IS)
   * Patient's handicap status
   */
  handicap(handicap: string): this {
    this.fields[5] = this.createField(handicap);
    return this;
  }

  /**
   * PD1-7: Living Will Code (IS)
   * Whether patient has a living will
   * F = Yes, N = No, U = Unknown, I = Has living will but not on file
   */
  livingWillCode(code: string): this {
    this.fields[6] = this.createField(code);
    return this;
  }

  /**
   * PD1-8: Organ Donor Code (IS)
   * Whether patient is an organ donor
   * Y = Yes, N = No, F = Yes but documentation not on file
   */
  organDonorCode(code: string): this {
    this.fields[7] = this.createField(code);
    return this;
  }

  /**
   * PD1-9: Separate Bill (ID)
   * Whether to bill separately
   * Y = Yes, N = No
   */
  separateBill(indicator: string): this {
    this.fields[8] = this.createField(indicator);
    return this;
  }

  /**
   * PD1-10: Duplicate Patient (CX)
   * Duplicate patient identifier
   */
  duplicatePatient(id: string, assigningAuthority?: string): this {
    if (assigningAuthority) {
      this.fields[9] = this.createField([[id, "", "", assigningAuthority]]);
    } else {
      this.fields[9] = this.createField(id);
    }
    return this;
  }

  /**
   * PD1-11: Publicity Code (CE)
   * Patient's privacy preference
   */
  publicityCode(code: string, text?: string, codingSystem?: string): this {
    if (text || codingSystem) {
      this.fields[10] = this.createField([
        [code, text || "", codingSystem || ""],
      ]);
    } else {
      this.fields[10] = this.createField(code);
    }
    return this;
  }

  /**
   * PD1-12: Protection Indicator (ID)
   * Whether patient is under protection
   * Y = Yes, N = No
   */
  protectionIndicator(indicator: string): this {
    this.fields[11] = this.createField(indicator);
    return this;
  }

  /**
   * PD1-13: Protection Indicator Effective Date (DT)
   */
  protectionIndicatorEffectiveDate(date: string): this {
    this.fields[12] = this.createField(date);
    return this;
  }

  /**
   * PD1-14: Place of Worship (XON)
   */
  placeOfWorship(name: string): this {
    this.fields[13] = this.createField(name);
    return this;
  }

  /**
   * PD1-15: Advance Directive Code (CE)
   * Type of advance directive
   */
  advanceDirectiveCode(
    code: string,
    text?: string,
    codingSystem?: string,
  ): this {
    if (text || codingSystem) {
      this.fields[14] = this.createField([
        [code, text || "", codingSystem || ""],
      ]);
    } else {
      this.fields[14] = this.createField(code);
    }
    return this;
  }

  /**
   * PD1-16: Immunization Registry Status (IS)
   */
  immunizationRegistryStatus(status: string): this {
    this.fields[15] = this.createField(status);
    return this;
  }

  /**
   * PD1-17: Immunization Registry Status Effective Date (DT)
   */
  immunizationRegistryStatusEffectiveDate(date: string): this {
    this.fields[16] = this.createField(date);
    return this;
  }

  /**
   * PD1-18: Publicity Code Effective Date (DT)
   */
  publicityCodeEffectiveDate(date: string): this {
    this.fields[17] = this.createField(date);
    return this;
  }

  /**
   * PD1-19: Military Branch (IS)
   */
  militaryBranch(branch: string): this {
    this.fields[18] = this.createField(branch);
    return this;
  }

  /**
   * PD1-20: Military Rank/Grade (IS)
   */
  militaryRankGrade(rank: string): this {
    this.fields[19] = this.createField(rank);
    return this;
  }

  /**
   * PD1-21: Military Status (IS)
   */
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
  ): { success: boolean; data?: PD1; error?: string } {
    const parts = segmentString.split(encoding.fieldSeparator);
    const segmentType = parts[0];

    if (segmentType !== "PD1") {
      return {
        success: false,
        error: `Expected PD1 segment, got ${segmentType}`,
      };
    }

    const pd1 = new PD1();

    // Parse fields starting from index 1
    for (let i = 1; i < parts.length; i++) {
      if (parts[i] !== undefined) {
        pd1.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
      }
    }

    return {
      success: true,
      data: pd1,
    };
  }
}
