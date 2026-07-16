/**
 * ORC segment definition for HL7 v2.5.1.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { ORC as ORC_base } from "../v2.3/ORC.ts";
import {
  DateTimeLayout,
  formatHL7Date,
  type HL7DateTimeLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * ORC segment (HL7 v2.5.1)
 * Extends v2.3 ORC. Add v2.5.1-specific fields here as needed.
 */
export class ORC extends ORC_base {
  /**
   * ORC-20 Advanced Beneficiary Notice Code (chainable).
   * @param code - ORC-20.1 Identifier
   * @param text - ORC-20.2 Text
   * @param codingSystem - ORC-20.3 Name of Coding System
   */
  advancedBeneficiaryNoticeCode(
    code: string,
    text?: string,
    codingSystem?: string,
  ): this {
    this.fields[19] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }
  /**
   * ORC-21 Ordering Facility Name (chainable).
   * @param organizationName - ORC-21.1 Organization Name
   * @param organizationNameTypeCode - ORC-21.2 Organization Name Type Code
   * @param idNumber - ORC-21.3 ID Number
   */
  orderingFacilityName(
    organizationName: string,
    organizationNameTypeCode?: string,
    idNumber?: string,
  ): this {
    this.fields[20] = this.createComponentsField([
      organizationName,
      organizationNameTypeCode,
      idNumber,
    ]);
    return this;
  }
  /**
   * ORC-22 Ordering Facility Address (chainable).
   * @param street - ORC-22.1 Street Address
   * @param otherDesignation - ORC-22.2 Other Designation
   * @param city - ORC-22.3 City
   * @param state - ORC-22.4 State/Province
   * @param zip - ORC-22.5 Zip or Postal Code
   * @param country - ORC-22.6 Country
   */
  orderingFacilityAddress(
    street: string,
    otherDesignation?: string,
    city?: string,
    state?: string,
    zip?: string,
    country?: string,
  ): this {
    this.fields[21] = this.createComponentsField([
      street,
      otherDesignation,
      city,
      state,
      zip,
      country,
    ]);
    return this;
  }
  /** ORC-23 Ordering Facility Phone Number (chainable). */
  orderingFacilityPhoneNumber(value: string): this {
    this.fields[22] = this.createField(value);
    return this;
  }
  /**
   * ORC-24 Ordering Provider Address (chainable).
   * @param street - ORC-24.1 Street Address
   * @param otherDesignation - ORC-24.2 Other Designation
   * @param city - ORC-24.3 City
   * @param state - ORC-24.4 State/Province
   * @param zip - ORC-24.5 Zip or Postal Code
   * @param country - ORC-24.6 Country
   */
  orderingProviderAddress(
    street: string,
    otherDesignation?: string,
    city?: string,
    state?: string,
    zip?: string,
    country?: string,
  ): this {
    this.fields[23] = this.createComponentsField([
      street,
      otherDesignation,
      city,
      state,
      zip,
      country,
    ]);
    return this;
  }
  /**
   * ORC-25 Order Status Modifier (chainable).
   * @param code - ORC-25.1 Identifier
   * @param text - ORC-25.2 Text
   * @param codingSystem - ORC-25.3 Name of Coding System
   */
  orderStatusModifier(code: string, text?: string, codingSystem?: string): this {
    this.fields[24] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }
  /**
   * ORC-26 Advanced Beneficiary Notice Override Reason (chainable).
   * @param code - ORC-26.1 Identifier
   * @param text - ORC-26.2 Text
   * @param codingSystem - ORC-26.3 Name of Coding System
   */
  advancedBeneficiaryNoticeOverrideReason(
    code: string,
    text?: string,
    codingSystem?: string,
  ): this {
    this.fields[25] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }
  /** ORC-27 Filler's Expected Availability Date/Time (chainable). */
  fillersExpectedAvailabilityDateTime(value: string, format?: never): this;
  /** ORC-27 Filler's Expected Availability Date/Time (chainable). */
  fillersExpectedAvailabilityDateTime(
    value: Date,
    format?: HL7DateTimeLayout,
  ): this;
  fillersExpectedAvailabilityDateTime(
    value: string | Date,
    format?: HL7DateTimeLayout,
  ): this {
    this.fields[26] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }
  /**
   * ORC-28 Confidentiality Code (chainable).
   * @param code - ORC-28.1 Identifier
   * @param text - ORC-28.2 Text
   * @param codingSystem - ORC-28.3 Name of Coding System
   */
  confidentialityCode(code: string, text?: string, codingSystem?: string): this {
    this.fields[27] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }
  /**
   * ORC-29 Order Type (chainable).
   * @param code - ORC-29.1 Identifier
   * @param text - ORC-29.2 Text
   * @param codingSystem - ORC-29.3 Name of Coding System
   */
  orderType(code: string, text?: string, codingSystem?: string): this {
    this.fields[28] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }
  /**
   * ORC-30 Enterer Authorization Mode (chainable).
   * @param code - ORC-30.1 Identifier
   * @param text - ORC-30.2 Text
   * @param codingSystem - ORC-30.3 Name of Coding System
   */
  entererAuthorizationMode(
    code: string,
    text?: string,
    codingSystem?: string,
  ): this {
    this.fields[29] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }
  /**
   * ORC-31 Parent Universal Service Identifier (chainable).
   * @param code - ORC-31.1 Identifier
   * @param text - ORC-31.2 Text
   * @param codingSystem - ORC-31.3 Name of Coding System
   */
  parentUniversalServiceIdentifier(
    code: string,
    text?: string,
    codingSystem?: string,
  ): this {
    this.fields[30] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<ORC> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "ORC") {
      return { ok: false, err: new Err(`Expected ORC segment, got ${parts[0]}`) };
    }
    const seg = new ORC();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
