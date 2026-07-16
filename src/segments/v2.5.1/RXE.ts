/**
 * RXE segment definition for HL7 v2.5.1.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { RXE as RXE_base } from "../v2.3/RXE.ts";
import {
  DateTimeLayout,
  formatHL7Date,
  type HL7DateTimeLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * RXE segment (HL7 v2.5.1)
 * Extends v2.3 RXE. Add v2.5.1-specific fields here as needed.
 */
export class RXE extends RXE_base {
  /**
   * RXE-31 Supplementary Code (chainable).
   * @param code - RXE-31.1 Identifier
   * @param text - RXE-31.2 Text
   * @param codingSystem - RXE-31.3 Name of Coding System
   */
  supplementaryCode(code: string, text?: string, codingSystem?: string): this {
    this.fields[30] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** RXE-32 Original Order Date/Time (chainable). */
  originalOrderDateTime(value: string, format?: never): this;
  /** RXE-32 Original Order Date/Time (chainable). */
  originalOrderDateTime(value: Date, format?: HL7DateTimeLayout): this;
  originalOrderDateTime(
    value: string | Date,
    format?: HL7DateTimeLayout,
  ): this {
    this.fields[31] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** RXE-33 Give Drug Strength Volume (chainable). */
  giveDrugStrengthVolume(value: string): this {
    this.fields[32] = this.createField(value);
    return this;
  }

  /**
   * RXE-34 Give Drug Strength Volume Units (chainable).
   * @param code - RXE-34.1 Identifier
   * @param text - RXE-34.2 Text
   * @param codingSystem - RXE-34.3 Name of Coding System
   */
  giveDrugStrengthVolumeUnits(
    code: string,
    text?: string,
    codingSystem?: string,
  ): this {
    this.fields[33] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * RXE-35 Controlled Substance Schedule (chainable).
   * @param code - RXE-35.1 Identifier
   * @param text - RXE-35.2 Text
   * @param codingSystem - RXE-35.3 Name of Coding System
   */
  controlledSubstanceSchedule(
    code: string,
    text?: string,
    codingSystem?: string,
  ): this {
    this.fields[34] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** RXE-36 Formulary Status (chainable). */
  formularyStatus(value: string): this {
    this.fields[35] = this.createField(value);
    return this;
  }

  /**
   * RXE-37 Pharmaceutical Substance Alternative (chainable).
   * @param code - RXE-37.1 Identifier
   * @param text - RXE-37.2 Text
   * @param codingSystem - RXE-37.3 Name of Coding System
   */
  pharmaceuticalSubstanceAlternative(
    code: string,
    text?: string,
    codingSystem?: string,
  ): this {
    this.fields[36] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * RXE-38 Pharmacy of Most Recent Fill (chainable).
   * @param code - RXE-38.1 Identifier
   * @param text - RXE-38.2 Text
   * @param codingSystem - RXE-38.3 Name of Coding System
   */
  pharmacyOfMostRecentFill(
    code: string,
    text?: string,
    codingSystem?: string,
  ): this {
    this.fields[37] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** RXE-39 Initial Dispense Amount (chainable). */
  initialDispenseAmount(value: string): this {
    this.fields[38] = this.createField(value);
    return this;
  }

  /**
   * RXE-40 Dispensing Pharmacy (chainable).
   * @param code - RXE-40.1 Identifier
   * @param text - RXE-40.2 Text
   * @param codingSystem - RXE-40.3 Name of Coding System
   */
  dispensingPharmacy(code: string, text?: string, codingSystem?: string): this {
    this.fields[39] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * RXE-41 Dispensing Pharmacy Address (chainable).
   * @param street - RXE-41.1 Street Address
   * @param otherDesignation - RXE-41.2 Other Designation
   * @param city - RXE-41.3 City
   * @param state - RXE-41.4 State or Province
   * @param zip - RXE-41.5 Zip or Postal Code
   * @param country - RXE-41.6 Country
   */
  dispensingPharmacyAddress(
    street: string,
    otherDesignation?: string,
    city?: string,
    state?: string,
    zip?: string,
    country?: string,
  ): this {
    this.fields[40] = this.createComponentsField([
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
   * RXE-42 Deliver-to Patient Location (chainable).
   * @param pointOfCare - RXE-42.1 Point of Care
   * @param room - RXE-42.2 Room
   * @param bed - RXE-42.3 Bed
   * @param facility - RXE-42.4 Facility
   * @param locationStatus - RXE-42.5 Location Status
   * @param personLocationType - RXE-42.6 Person Location Type
   */
  deliverToPatientLocation(
    pointOfCare: string,
    room?: string,
    bed?: string,
    facility?: string,
    locationStatus?: string,
    personLocationType?: string,
  ): this {
    this.fields[41] = this.createComponentsField([
      pointOfCare,
      room,
      bed,
      facility,
      locationStatus,
      personLocationType,
    ]);
    return this;
  }

  /**
   * RXE-43 Deliver-to Address (chainable).
   * @param street - RXE-43.1 Street Address
   * @param otherDesignation - RXE-43.2 Other Designation
   * @param city - RXE-43.3 City
   * @param state - RXE-43.4 State or Province
   * @param zip - RXE-43.5 Zip or Postal Code
   * @param country - RXE-43.6 Country
   */
  deliverToAddress(
    street: string,
    otherDesignation?: string,
    city?: string,
    state?: string,
    zip?: string,
    country?: string,
  ): this {
    this.fields[42] = this.createComponentsField([
      street,
      otherDesignation,
      city,
      state,
      zip,
      country,
    ]);
    return this;
  }

  /** RXE-44 Pharmacy Order Type (chainable). */
  pharmacyOrderType(value: string): this {
    this.fields[43] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<RXE> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "RXE") {
      return { ok: false, err: new Err(`Expected RXE segment, got ${parts[0]}`) };
    }
    const seg = new RXE();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
