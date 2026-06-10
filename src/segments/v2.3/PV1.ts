/**
 * PV1 segment definition for HL7 v2.3.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import {
  formatHL7Date,
  DateTimeLayout,
  type HL7DateTimeLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * PV1 - Patient Visit Segment (HL7 v2.3)
 */
export class PV1 extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "PV1";

  constructor() {
    super();
    this.fields = [];
  }

  /** Sets the set id field (chainable). */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }
  /** Sets the patient class field (chainable). */
  patientClass(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }
  /** Assigned patient location. */
  assignedPatientLocation(
    pointOfCare?: string,
    room?: string,
    bed?: string,
    facility?: string,
    locationStatus?: string,
    personLocationType?: string,
  ): this {
    const components = [];
    if (pointOfCare) components.push(pointOfCare);
    if (room) components.push(room);
    if (bed) components.push(bed);
    if (facility) components.push(facility);
    if (locationStatus) components.push(locationStatus);
    if (personLocationType) components.push(personLocationType);

    this.fields[2] = this.createField(components);
    return this;
  }
  /** Sets the admission type field (chainable). */
  admissionType(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }
  /** Sets the preadmit number field (chainable). */
  preadmitNumber(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }
  /** Prior patient location. */
  priorPatientLocation(
    pointOfCare?: string,
    room?: string,
    bed?: string,
    facility?: string,
  ): this {
    const components = [];
    if (pointOfCare) components.push(pointOfCare);
    if (room) components.push(room);
    if (bed) components.push(bed);
    if (facility) components.push(facility);

    this.fields[5] = this.createField(components);
    return this;
  }
  /** Sets the attending doctor field (chainable). */
  attendingDoctor(id: string, familyName?: string, givenName?: string): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[6] = this.createField(components);
    return this;
  }
  /** Sets the referring doctor field (chainable). */
  referringDoctor(id: string, familyName?: string, givenName?: string): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[7] = this.createField(components);
    return this;
  }
  /** Sets the consulting doctor field (chainable). */
  consultingDoctor(id: string, familyName?: string, givenName?: string): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[8] = this.createField(components);
    return this;
  }
  /** Sets the hospital service field (chainable). */
  hospitalService(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }
  /** Sets the temporary location field (chainable). */
  temporaryLocation(pointOfCare?: string, room?: string, bed?: string): this {
    const components = [];
    if (pointOfCare) components.push(pointOfCare);
    if (room) components.push(room);
    if (bed) components.push(bed);

    this.fields[10] = this.createField(components);
    return this;
  }
  /** Visit number. */
  visitNumber(
    value: string,
    assigningAuthority?: string,
    identifierType?: string,
  ): this {
    const components = [value];
    if (assigningAuthority) components.push(assigningAuthority);
    if (identifierType) components.push(identifierType);

    this.fields[18] = this.createField(components);
    return this;
  }
  /** Sets the admit date time field (chainable). */
  admitDateTime(value: string, format?: never): this;
  /** Sets the admit date time field (chainable). */
  admitDateTime(value: Date, format?: HL7DateTimeLayout): this;
  admitDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[44] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }
  /** Sets the discharge date time field (chainable). */
  dischargeDateTime(value: string, format?: never): this;
  /** Sets the discharge date time field (chainable). */
  dischargeDateTime(value: Date, format?: HL7DateTimeLayout): this;
  dischargeDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[45] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<PV1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "PV1") {
      return {
        ok: false,
        err: new Err(`Expected PV1 segment, got ${parts[0]}`),
      };
    }
    const pv1 = new PV1();
    for (let i = 1; i < parts.length; i++) {
      pv1.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: pv1 };
  }
}
