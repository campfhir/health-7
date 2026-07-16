/**
 * ORC segment definition for HL7 v2.3.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { formatHL7Date, DateTimeLayout, type HL7DateTimeLayout } from "../../utils/hl7DateUtils.ts";

/**
 * ORC - Common Order Segment (HL7 v2.3)
 */
export class ORC extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "ORC";

  constructor() {
    super();
    this.fields = [];
  }

  /** ORC-1 Order Control (chainable). */
  orderControl(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** ORC-2 Placer Order Number (chainable). */
  placerOrderNumber(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** ORC-3 Filler Order Number (chainable). */
  fillerOrderNumber(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** ORC-4 Placer Group Number (chainable). */
  placerGroupNumber(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** ORC-5 Order Status (chainable). */
  orderStatus(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** ORC-6 Response Flag (chainable). */
  responseFlag(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** ORC-7 Quantity Timing (chainable). */
  quantityTiming(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** ORC-8 Parent (chainable). */
  parent(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }

  /** ORC-9 Date Time Of Transaction (chainable). */
  dateTimeOfTransaction(value: string, format?: never): this;
  /** ORC-9 Date Time Of Transaction (chainable). */
  dateTimeOfTransaction(value: Date, format?: HL7DateTimeLayout): this;
  dateTimeOfTransaction(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[8] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /**
   * ORC-10 Entered By (chainable).
   * @param id - ORC-10.1 ID Number
   * @param familyName - ORC-10.2 Family Name
   * @param givenName - ORC-10.3 Given Name
   */
  enteredBy(id: string, familyName?: string, givenName?: string): this {
    this.fields[9] = this.createComponentsField([id, familyName, givenName]);
    return this;
  }

  /**
   * ORC-11 Verified By (chainable).
   * @param id - ORC-11.1 ID Number
   * @param familyName - ORC-11.2 Family Name
   * @param givenName - ORC-11.3 Given Name
   */
  verifiedBy(id: string, familyName?: string, givenName?: string): this {
    this.fields[10] = this.createComponentsField([id, familyName, givenName]);
    return this;
  }

  /**
   * ORC-12 Ordering Provider (chainable).
   * @param id - ORC-12.1 ID Number
   * @param familyName - ORC-12.2 Family Name
   * @param givenName - ORC-12.3 Given Name
   */
  orderingProvider(id: string, familyName?: string, givenName?: string): this {
    this.fields[11] = this.createComponentsField([id, familyName, givenName]);
    return this;
  }

  /**
   * ORC-13 Enterers Location (chainable).
   * @param pointOfCare - ORC-13.1 Point of Care
   * @param room - ORC-13.2 Room
   * @param bed - ORC-13.3 Bed
   * @param facility - ORC-13.4 Facility
   * @param locationStatus - ORC-13.5 Location Status
   * @param personLocationType - ORC-13.6 Person Location Type
   */
  enterersLocation(
    pointOfCare: string,
    room?: string,
    bed?: string,
    facility?: string,
    locationStatus?: string,
    personLocationType?: string,
  ): this {
    this.fields[12] = this.createComponentsField([
      pointOfCare,
      room,
      bed,
      facility,
      locationStatus,
      personLocationType,
    ]);
    return this;
  }

  /** ORC-14 Call Back Phone Number (chainable). */
  callBackPhoneNumber(value: string): this {
    this.fields[13] = this.createField(value);
    return this;
  }

  /** ORC-15 Order Effective Date Time (chainable). */
  orderEffectiveDateTime(value: string, format?: never): this;
  /** ORC-15 Order Effective Date Time (chainable). */
  orderEffectiveDateTime(value: Date, format?: HL7DateTimeLayout): this;
  orderEffectiveDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[14] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** ORC-16 Order Control Code Reason (chainable). */
  orderControlCodeReason(value: string): this {
    this.fields[15] = this.createField(value);
    return this;
  }

  /** ORC-17 Entering Organization (chainable). */
  enteringOrganization(value: string): this {
    this.fields[16] = this.createField(value);
    return this;
  }

  /** ORC-18 Entering Device (chainable). */
  enteringDevice(value: string): this {
    this.fields[17] = this.createField(value);
    return this;
  }

  /**
   * ORC-19 Action By (chainable).
   * @param id - ORC-19.1 ID Number
   * @param familyName - ORC-19.2 Family Name
   * @param givenName - ORC-19.3 Given Name
   */
  actionBy(id: string, familyName?: string, givenName?: string): this {
    this.fields[18] = this.createComponentsField([id, familyName, givenName]);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<ORC> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "ORC") {
      return {
        ok: false,
        err: new Err(`Expected ORC segment, got ${parts[0]}`),
      };
    }
    const orc = new ORC();
    for (let i = 1; i < parts.length; i++) {
      orc.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: orc };
  }
}
