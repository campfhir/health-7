/**
 * OBX segment definition for HL7 v2.5.1.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { OBX as OBX_base } from "../v2.3/OBX.ts";
import {
  DateTimeLayout,
  formatHL7Date,
  type HL7DateTimeLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * OBX segment (HL7 v2.5.1)
 * Extends v2.3 OBX. Add v2.5.1-specific fields here as needed.
 */
export class OBX extends OBX_base {
  /**
   * OBX-18 Equipment Instance Identifier (chainable).
   * @param entityIdentifier - OBX-18.1 Entity Identifier
   * @param namespaceId - OBX-18.2 Namespace ID
   */
  equipmentInstanceIdentifier(
    entityIdentifier: string,
    namespaceId?: string,
  ): this {
    this.fields[17] = this.createComponentsField([entityIdentifier, namespaceId]);
    return this;
  }
  /** OBX-19 Date/Time of the Analysis (chainable). */
  dateTimeOfTheAnalysis(value: string, format?: never): this;
  /** OBX-19 Date/Time of the Analysis (chainable). */
  dateTimeOfTheAnalysis(value: Date, format?: HL7DateTimeLayout): this;
  dateTimeOfTheAnalysis(
    value: string | Date,
    format?: HL7DateTimeLayout,
  ): this {
    this.fields[18] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }
  /**
   * OBX-23 Performing Organization Name (chainable).
   * @param organizationName - OBX-23.1 Organization Name
   * @param organizationNameTypeCode - OBX-23.2 Organization Name Type Code
   * @param idNumber - OBX-23.3 ID Number
   */
  performingOrganizationName(
    organizationName: string,
    organizationNameTypeCode?: string,
    idNumber?: string,
  ): this {
    this.fields[22] = this.createComponentsField([
      organizationName,
      organizationNameTypeCode,
      idNumber,
    ]);
    return this;
  }
  /**
   * OBX-24 Performing Organization Address (chainable).
   * @param street - OBX-24.1 Street Address
   * @param otherDesignation - OBX-24.2 Other Designation
   * @param city - OBX-24.3 City
   * @param state - OBX-24.4 State/Province
   * @param zip - OBX-24.5 Zip or Postal Code
   * @param country - OBX-24.6 Country
   */
  performingOrganizationAddress(
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
   * OBX-25 Performing Organization Medical Director (chainable).
   * @param id - OBX-25.1 ID Number
   * @param familyName - OBX-25.2 Family Name
   * @param givenName - OBX-25.3 Given Name
   */
  performingOrganizationMedicalDirector(
    id: string,
    familyName?: string,
    givenName?: string,
  ): this {
    this.fields[24] = this.createComponentsField([id, familyName, givenName]);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<OBX> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "OBX") {
      return { ok: false, err: new Err(`Expected OBX segment, got ${parts[0]}`) };
    }
    const seg = new OBX();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
