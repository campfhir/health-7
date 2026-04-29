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
 * PID - Patient Identification Segment (HL7 v2.3)
 */
export class PID extends BaseSegment {
  name = "PID";

  constructor() {
    super();
    this.fields = [];
  }

  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }
  patientId(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }
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
  alternatePatientId(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }
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
  mothersMaidenName(familyName: string, givenName?: string): this {
    const components = [familyName];
    if (givenName) components.push(givenName);
    this.fields[5] = this.createField(components);
    return this;
  }
  dateTimeOfBirth(value: string, format?: never): this;
  dateTimeOfBirth(value: Date, format?: HL7DateLayout): this;
  dateTimeOfBirth(value: string | Date, format?: HL7DateLayout): this {
    this.fields[6] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }
  administrativeSex(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }
  patientAlias(familyName: string, givenName?: string): this {
    const components = [familyName];
    if (givenName) components.push(givenName);
    this.fields[8] = this.createField(components);
    return this;
  }
  race(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }
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
  countyCode(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }
  phoneNumberHome(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }
  phoneNumberBusiness(value: string): this {
    this.fields[13] = this.createField(value);
    return this;
  }
  primaryLanguage(value: string): this {
    this.fields[14] = this.createField(value);
    return this;
  }
  maritalStatus(value: string): this {
    this.fields[15] = this.createField(value);
    return this;
  }
  religion(value: string): this {
    this.fields[16] = this.createField(value);
    return this;
  }
  patientAccountNumber(value: string): this {
    this.fields[17] = this.createField(value);
    return this;
  }
  ssn(value: string): this {
    this.fields[18] = this.createField(value);
    return this;
  }

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
