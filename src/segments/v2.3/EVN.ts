import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { BaseSegment } from "../../types/segment";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import {
  formatHL7Date,
  DateTimeLayout,
  HL7DateTimeLayout,
} from "../../utils/hl7DateUtils";

/**
 * EVN - Event Type Segment (HL7 v2.3)
 * Communicates necessary trigger event information to receiving applications.
 */
export class EVN extends BaseSegment {
  name = "EVN";

  constructor() {
    super();
    this.fields = [];
  }

  /**
   * EVN-1: Event Type Code (IS, optional, deprecated)
   * Retained for backward compatibility; the trigger event is in MSH-9.
   */
  eventTypeCode(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /**
   * EVN-2: Recorded Date/Time (TS, required)
   * The date/time the event was recorded.
   */
  recordedDateTime(value: string, format?: never): this;
  recordedDateTime(value: Date, format?: HL7DateTimeLayout): this;
  recordedDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[1] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /**
   * EVN-3: Date/Time Planned Event (TS, optional)
   * The date/time the event was planned.
   */
  dateTimePlannedEvent(value: string, format?: never): this;
  dateTimePlannedEvent(value: Date, format?: HL7DateTimeLayout): this;
  dateTimePlannedEvent(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[2] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /**
   * EVN-4: Event Reason Code (IS, optional)
   * The reason for the event (e.g., 01=Patient request, 02=Physician order).
   */
  eventReasonCode(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /**
   * EVN-5: Operator ID (XCN, optional)
   * The person who initiated the event.
   */
  operatorId(id: string, familyName?: string, givenName?: string): this {
    const components = [id, familyName || "", givenName || ""];
    this.fields[4] = this.createField(components);
    return this;
  }

  /**
   * EVN-6: Event Occurred (TS, optional)
   * The date/time the event actually occurred.
   */
  eventOccurred(value: string, format?: never): this;
  eventOccurred(value: Date, format?: HL7DateTimeLayout): this;
  eventOccurred(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[5] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /**
   * EVN-7: Event Facility (HD, optional)
   * The facility where the event occurred.
   */
  eventFacility(
    namespaceId: string,
    universalId?: string,
    universalIdType?: string,
  ): this {
    const components = [namespaceId, universalId || "", universalIdType || ""];
    this.fields[6] = this.createField(components);
    return this;
  }

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
