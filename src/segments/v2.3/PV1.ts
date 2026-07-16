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

  /** PV1-1 Set ID - PV1 (chainable). */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }
  /** PV1-2 Patient Class (chainable). */
  patientClass(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }
  /**
   * PV1-3 Assigned Patient Location (chainable).
   * @param pointOfCare - PV1-3.1 Point of Care
   * @param room - PV1-3.2 Room
   * @param bed - PV1-3.3 Bed
   * @param facility - PV1-3.4 Facility
   * @param locationStatus - PV1-3.5 Location Status
   * @param personLocationType - PV1-3.6 Person Location Type
   */
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
  /** PV1-4 Admission Type (chainable). */
  admissionType(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }
  /** PV1-5 Preadmit Number (chainable). */
  preadmitNumber(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }
  /**
   * PV1-6 Prior Patient Location (chainable).
   * @param pointOfCare - PV1-6.1 Point of Care
   * @param room - PV1-6.2 Room
   * @param bed - PV1-6.3 Bed
   * @param facility - PV1-6.4 Facility
   */
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
  /**
   * PV1-7 Attending Doctor (chainable).
   * @param id - PV1-7.1 ID Number
   * @param familyName - PV1-7.2 Family Name
   * @param givenName - PV1-7.3 Given Name
   */
  attendingDoctor(id: string, familyName?: string, givenName?: string): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[6] = this.createField(components);
    return this;
  }
  /**
   * PV1-8 Referring Doctor (chainable).
   * @param id - PV1-8.1 ID Number
   * @param familyName - PV1-8.2 Family Name
   * @param givenName - PV1-8.3 Given Name
   */
  referringDoctor(id: string, familyName?: string, givenName?: string): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[7] = this.createField(components);
    return this;
  }
  /**
   * PV1-9 Consulting Doctor (chainable).
   * @param id - PV1-9.1 ID Number
   * @param familyName - PV1-9.2 Family Name
   * @param givenName - PV1-9.3 Given Name
   */
  consultingDoctor(id: string, familyName?: string, givenName?: string): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[8] = this.createField(components);
    return this;
  }
  /** PV1-10 Hospital Service (chainable). */
  hospitalService(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }
  /**
   * PV1-11 Temporary Location (chainable).
   * @param pointOfCare - PV1-11.1 Point of Care
   * @param room - PV1-11.2 Room
   * @param bed - PV1-11.3 Bed
   */
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
  /** PV1-44 Admit Date/Time (chainable). */
  admitDateTime(value: string, format?: never): this;
  /** PV1-44 Admit Date/Time (chainable). */
  admitDateTime(value: Date, format?: HL7DateTimeLayout): this;
  admitDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[44] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }
  /** PV1-45 Discharge Date/Time (chainable). */
  dischargeDateTime(value: string, format?: never): this;
  /** PV1-45 Discharge Date/Time (chainable). */
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
