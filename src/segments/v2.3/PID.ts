/**
 * PID segment definition for HL7 v2.3.
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
 * PID - Patient Identification Segment (HL7 v2.3)
 */
export class PID extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "PID";

  constructor() {
    super();
    this.fields = [];
  }

  /** Sets the set id field (chainable). */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }
  /** Sets the patient id field (chainable). */
  patientId(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }
  /** Patient identifier list. */
  patientIdentifierList(
    id: string,
    checkDigit?: string,
    checkDigitScheme?: string,
    assigningAuthority?: string,
    identifierTypeCode?: string,
  ): this {
    const components = [id];
    if (checkDigit) components.push(checkDigit);
    if (checkDigitScheme) components.push(checkDigitScheme);
    if (assigningAuthority) components.push(assigningAuthority);
    if (identifierTypeCode) components.push(identifierTypeCode);

    this.fields[2] = this.createField(components);
    return this;
  }
  /** Sets the alternate patient id field (chainable). */
  alternatePatientId(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }
  /** Patient name. */
  patientName(
    familyName: string,
    givenName?: string,
    middleName?: string,
    suffix?: string,
    prefix?: string,
  ): this {
    const components = [familyName];
    if (givenName) components.push(givenName);
    if (middleName) components.push(middleName);
    if (suffix) components.push(suffix);
    if (prefix) components.push(prefix);

    this.fields[4] = this.createField(components);
    return this;
  }
  /** Sets the mothers maiden name field (chainable). */
  mothersMaidenName(familyName: string, givenName?: string): this {
    const components = [familyName];
    if (givenName) components.push(givenName);
    this.fields[5] = this.createField(components);
    return this;
  }
  /** Sets the date time of birth field (chainable). */
  dateTimeOfBirth(value: string, format?: never): this;
  /** Sets the date time of birth field (chainable). */
  dateTimeOfBirth(value: Date, format?: HL7DateLayout): this;
  dateTimeOfBirth(value: string | Date, format?: HL7DateLayout): this {
    this.fields[6] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }
  /** Sets the administrative sex field (chainable). */
  administrativeSex(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }
  /** Sets the patient alias field (chainable). */
  patientAlias(familyName: string, givenName?: string): this {
    const components = [familyName];
    if (givenName) components.push(givenName);
    this.fields[8] = this.createField(components);
    return this;
  }
  /** Sets the race field (chainable). */
  race(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }
  /** Patient address. */
  patientAddress(
    streetAddress?: string,
    otherDesignation?: string,
    city?: string,
    state?: string,
    zip?: string,
    country?: string,
  ): this {
    const components = [];
    if (streetAddress) components.push(streetAddress);
    if (otherDesignation) components.push(otherDesignation);
    if (city) components.push(city);
    if (state) components.push(state);
    if (zip) components.push(zip);
    if (country) components.push(country);

    this.fields[10] = this.createField(components);
    return this;
  }
  /** Sets the county code field (chainable). */
  countyCode(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }
  /** Sets the phone number home field (chainable). */
  phoneNumberHome(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }
  /** Sets the phone number business field (chainable). */
  phoneNumberBusiness(value: string): this {
    this.fields[13] = this.createField(value);
    return this;
  }
  /** Sets the primary language field (chainable). */
  primaryLanguage(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }
  /** Sets the marital status field (chainable). */
  maritalStatus(value: string): this {
    this.fields[15] = this.createField(value);
    return this;
  }
  /** Sets the religion field (chainable). */
  religion(value: string): this {
    this.fields[16] = this.createField(value);
    return this;
  }
  /** Sets the patient account number field (chainable). */
  patientAccountNumber(value: string): this {
    this.fields[17] = this.createField(value);
    return this;
  }
  /** Sets the ssn field (chainable). */
  ssn(value: string): this {
    this.fields[18] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<PID> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "PID") {
      return {
        ok: false,
        err: new Err(`Expected PID segment, got ${parts[0]}`),
      };
    }
    const pid = new PID();
    for (let i = 1; i < parts.length; i++) {
      pid.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: pid };
  }
}
