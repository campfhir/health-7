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
  name = "PV1";

  constructor() {
    super();
    this.fields = [];
  }

  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }
  patientClass(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }
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
  admissionType(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }
  preadmitNumber(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }
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
  attendingDoctor(id: string, familyName?: string, givenName?: string): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[6] = this.createField(components);
    return this;
  }
  referringDoctor(id: string, familyName?: string, givenName?: string): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[7] = this.createField(components);
    return this;
  }
  consultingDoctor(id: string, familyName?: string, givenName?: string): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[8] = this.createField(components);
    return this;
  }
  hospitalService(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }
  temporaryLocation(pointOfCare?: string, room?: string, bed?: string): this {
    const components = [];
    if (pointOfCare) components.push(pointOfCare);
    if (room) components.push(room);
    if (bed) components.push(bed);

    this.fields[10] = this.createField(components);
    return this;
  }
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
  admitDateTime(value: string, format?: never): this;
  admitDateTime(value: Date, format?: HL7DateTimeLayout): this;
  admitDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[44] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }
  dischargeDateTime(value: string, format?: never): this;
  dischargeDateTime(value: Date, format?: HL7DateTimeLayout): this;
  dischargeDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[45] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

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
