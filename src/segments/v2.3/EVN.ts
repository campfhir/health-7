/**
 * EVN segment definition for HL7 v2.3.
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
 * EVN - Event Type Segment (HL7 v2.3)
 * Communicates necessary trigger event information to receiving applications.
 */
export class EVN extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "EVN";

  constructor() {
    super();
    this.fields = [];
  }

  /** EVN-1 Event Type Code (chainable). */
  eventTypeCode(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** EVN-2 Recorded Date/Time (chainable). */
  recordedDateTime(value: string, format?: never): this;
  /** EVN-2 Recorded Date/Time (chainable). */
  recordedDateTime(value: Date, format?: HL7DateTimeLayout): this;
  recordedDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[1] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** EVN-3 Date/Time Planned Event (chainable). */
  dateTimePlannedEvent(value: string, format?: never): this;
  /** EVN-3 Date/Time Planned Event (chainable). */
  dateTimePlannedEvent(value: Date, format?: HL7DateTimeLayout): this;
  dateTimePlannedEvent(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[2] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** EVN-4 Event Reason Code (chainable). */
  eventReasonCode(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /**
   * EVN-5 Operator ID (chainable).
   * @param id - EVN-5.1 ID Number
   * @param familyName - EVN-5.2 Family Name
   * @param givenName - EVN-5.3 Given Name
   */
  operatorId({ id, familyName, givenName }: { id: string; familyName?: string; givenName?: string }): this {
    const components = [id, familyName || "", givenName || ""];
    this.fields[4] = this.createField(components);
    return this;
  }

  /** EVN-6 Event Occurred (chainable). */
  eventOccurred(value: string, format?: never): this;
  /** EVN-6 Event Occurred (chainable). */
  eventOccurred(value: Date, format?: HL7DateTimeLayout): this;
  eventOccurred(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[5] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /**
   * EVN-7 Event Facility (chainable).
   * @param namespaceId - EVN-7.1 Namespace ID
   * @param universalId - EVN-7.2 Universal ID
   * @param universalIdType - EVN-7.3 Universal ID Type
   */
  eventFacility({ namespaceId, universalId, universalIdType }: { namespaceId: string; universalId?: string; universalIdType?: string }): this {
    const components = [namespaceId, universalId || "", universalIdType || ""];
    this.fields[6] = this.createField(components);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<EVN> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "EVN") {
      return {
        ok: false,
        err: new Err(`Expected EVN segment, got ${parts[0]}`),
      };
    }
    const seg = new EVN();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
