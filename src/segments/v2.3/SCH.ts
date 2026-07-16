/**
 * SCH segment definition for HL7 v2.3.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";

/**
 * SCH - Scheduling Activity Information Segment (HL7 v2.3)
 */
export class SCH extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "SCH";

  constructor() {
    super();
    this.fields = [];
  }

  /**
   * SCH-1 Placer Appointment ID (chainable).
   * @param entityId - SCH-1.1 Entity ID
   * @param namespaceId - SCH-1.2 Namespace ID
   */
  placerAppointmentId(entityId: string, namespaceId?: string): this {
    this.fields[0] = this.createComponentsField([entityId, namespaceId || ""]);
    return this;
  }

  /**
   * SCH-2 Filler Appointment ID (chainable).
   * @param entityId - SCH-2.1 Entity ID
   * @param namespaceId - SCH-2.2 Namespace ID
   */
  fillerAppointmentId(entityId: string, namespaceId?: string): this {
    this.fields[1] = this.createComponentsField([entityId, namespaceId || ""]);
    return this;
  }

  /** SCH-3 Occurrence Number (chainable). */
  occurrenceNumber(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /**
   * SCH-4 Placer Group Number (chainable).
   * @param entityIdentifier - SCH-4.1 Entity Identifier
   * @param namespaceId - SCH-4.2 Namespace ID
   */
  placerGroupNumber(entityIdentifier: string, namespaceId?: string): this {
    this.fields[3] = this.createComponentsField([entityIdentifier, namespaceId]);
    return this;
  }

  /**
   * SCH-5 Schedule ID (chainable).
   * @param code - SCH-5.1 Code
   * @param text - SCH-5.2 Text
   */
  scheduleId(code: string, text?: string): this {
    this.fields[4] = this.createComponentsField([code, text]);
    return this;
  }

  /**
   * SCH-6 Event Reason (chainable).
   * @param code - SCH-6.1 Code
   * @param text - SCH-6.2 Text
   * @param codingSystem - SCH-6.3 Coding System
   */
  eventReason(code: string, text?: string, codingSystem?: string): this {
    this.fields[5] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * SCH-7 Appointment Reason (chainable).
   * @param code - SCH-7.1 Code
   * @param text - SCH-7.2 Text
   * @param codingSystem - SCH-7.3 Coding System
   */
  appointmentReason(code: string, text?: string, codingSystem?: string): this {
    this.fields[6] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * SCH-8 Appointment Type (chainable).
   * @param code - SCH-8.1 Code
   * @param text - SCH-8.2 Text
   */
  appointmentType(code: string, text?: string): this {
    this.fields[7] = this.createComponentsField([code, text]);
    return this;
  }

  /** SCH-9 Appointment Duration (chainable). */
  appointmentDuration(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /**
   * SCH-10 Appointment Duration Units (chainable).
   * @param code - SCH-10.1 Code
   * @param text - SCH-10.2 Text
   */
  appointmentDurationUnits(code: string, text?: string): this {
    this.fields[9] = this.createComponentsField([code, text]);
    return this;
  }

  /** SCH-11 Appointment Timing Quantity (chainable). */
  appointmentTimingQuantity(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /**
   * SCH-12 Placer Contact Person (chainable).
   * @param id - SCH-12.1 ID Number
   * @param familyName - SCH-12.2 Family Name
   * @param givenName - SCH-12.3 Given Name
   */
  placerContactPerson(id: string, familyName?: string, givenName?: string): this {
    this.fields[11] = this.createComponentsField([id, familyName, givenName]);
    return this;
  }

  /** SCH-13 Placer Contact Phone Number (chainable). */
  placerContactPhoneNumber(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }

  /**
   * SCH-14 Placer Contact Address (chainable).
   * @param street - SCH-14.1 Street Address
   * @param otherDesignation - SCH-14.2 Other Designation
   * @param city - SCH-14.3 City
   * @param state - SCH-14.4 State/Province
   * @param zip - SCH-14.5 Zip or Postal Code
   * @param country - SCH-14.6 Country
   */
  placerContactAddress(
    street: string,
    otherDesignation?: string,
    city?: string,
    state?: string,
    zip?: string,
    country?: string,
  ): this {
    this.fields[13] = this.createComponentsField([
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
   * SCH-15 Placer Contact Location (chainable).
   * @param pointOfCare - SCH-15.1 Point of Care
   */
  placerContactLocation(pointOfCare: string): this {
    this.fields[14] = this.createComponentsField([pointOfCare]);
    return this;
  }

  /**
   * SCH-16 Filler Contact Person (chainable).
   * @param id - SCH-16.1 ID Number
   * @param familyName - SCH-16.2 Family Name
   * @param givenName - SCH-16.3 Given Name
   */
  fillerContactPerson(id: string, familyName?: string, givenName?: string): this {
    this.fields[15] = this.createComponentsField([id, familyName, givenName]);
    return this;
  }

  /** SCH-17 Filler Contact Phone Number (chainable). */
  fillerContactPhoneNumber(value: string): this {
    this.fields[16] = this.createField(value);
    return this;
  }

  /**
   * SCH-18 Filler Contact Address (chainable).
   * @param street - SCH-18.1 Street Address
   * @param otherDesignation - SCH-18.2 Other Designation
   * @param city - SCH-18.3 City
   * @param state - SCH-18.4 State/Province
   * @param zip - SCH-18.5 Zip or Postal Code
   * @param country - SCH-18.6 Country
   */
  fillerContactAddress(
    street: string,
    otherDesignation?: string,
    city?: string,
    state?: string,
    zip?: string,
    country?: string,
  ): this {
    this.fields[17] = this.createComponentsField([
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
   * SCH-19 Filler Contact Location (chainable).
   * @param pointOfCare - SCH-19.1 Point of Care
   */
  fillerContactLocation(pointOfCare: string): this {
    this.fields[18] = this.createComponentsField([pointOfCare]);
    return this;
  }

  /**
   * SCH-20 Entered By Person (chainable).
   * @param id - SCH-20.1 ID Number
   * @param familyName - SCH-20.2 Family Name
   * @param givenName - SCH-20.3 Given Name
   */
  enteredByPerson(id: string, familyName?: string, givenName?: string): this {
    this.fields[19] = this.createComponentsField([id, familyName, givenName]);
    return this;
  }

  /** SCH-21 Entered By Phone Number (chainable). */
  enteredByPhoneNumber(value: string): this {
    this.fields[20] = this.createField(value);
    return this;
  }

  /**
   * SCH-22 Entered By Location (chainable).
   * @param pointOfCare - SCH-22.1 Point of Care
   */
  enteredByLocation(pointOfCare: string): this {
    this.fields[21] = this.createComponentsField([pointOfCare]);
    return this;
  }

  /**
   * SCH-23 Parent Placer Appointment ID (chainable).
   * @param entityIdentifier - SCH-23.1 Entity Identifier
   * @param namespaceId - SCH-23.2 Namespace ID
   */
  parentPlacerAppointmentId(
    entityIdentifier: string,
    namespaceId?: string,
  ): this {
    this.fields[22] = this.createComponentsField([entityIdentifier, namespaceId]);
    return this;
  }

  /**
   * SCH-24 Parent Filler Appointment ID (chainable).
   * @param entityIdentifier - SCH-24.1 Entity Identifier
   * @param namespaceId - SCH-24.2 Namespace ID
   */
  parentFillerAppointmentId(
    entityIdentifier: string,
    namespaceId?: string,
  ): this {
    this.fields[23] = this.createComponentsField([entityIdentifier, namespaceId]);
    return this;
  }

  /**
   * SCH-25 Filler Status Code (chainable).
   * @param code - SCH-25.1 Code
   * @param text - SCH-25.2 Text
   */
  fillerStatusCode(code: string, text?: string): this {
    this.fields[24] = this.createComponentsField([code, text]);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(segmentString: string, encoding: EncodingCharacters): Result<SCH> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "SCH") {
      return { ok: false, err: new Err(`Expected SCH segment, got ${parts[0]}`) };
    }
    const seg = new SCH();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
