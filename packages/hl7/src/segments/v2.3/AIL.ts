/**
 * AIL segment definition for HL7 v2.3.
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
 * AIL - Appointment Information - Location Resource Segment (HL7 v2.3)
 */
export class AIL extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "AIL";

  constructor() {
    super();
    this.fields = [];
  }

  /** AIL-1 Set ID (chainable). */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** AIL-2 Segment Action Code (chainable). */
  segmentActionCode(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /**
   * AIL-3 Location Resource ID (chainable).
   * @param pointOfCare - AIL-3.1 Point of Care
   * @param room - AIL-3.2 Room
   * @param bed - AIL-3.3 Bed
   * @param facility - AIL-3.4 Facility
   */
  locationResourceId({ pointOfCare, room, bed, facility }: { pointOfCare: string; room?: string; bed?: string; facility?: string }): this {
    this.fields[2] = this.createComponentsField([
      pointOfCare,
      room || "",
      bed || "",
      facility || "",
    ]);
    return this;
  }

  /**
   * AIL-4 Location Type (chainable).
   * @param code - AIL-4.1 Code
   * @param text - AIL-4.2 Text
   */
  locationType({ code, text }: { code: string; text?: string }): this {
    this.fields[3] = this.createComponentsField([code, text]);
    return this;
  }

  /**
   * AIL-5 Location Group (chainable).
   * @param code - AIL-5.1 Code
   * @param text - AIL-5.2 Text
   */
  locationGroup({ code, text }: { code: string; text?: string }): this {
    this.fields[4] = this.createComponentsField([code, text]);
    return this;
  }

  /** AIL-6 Start Date/Time (chainable). */
  startDateTime(value: string, format?: never): this;
  /** AIL-6 Start Date/Time (chainable). */
  startDateTime(value: Date, format?: HL7DateTimeLayout): this;
  startDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[5] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** AIL-7 Start Date/Time Offset (chainable). */
  startDateTimeOffset(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /**
   * AIL-8 Start Date/Time Offset Units (chainable).
   * @param code - AIL-8.1 Code
   * @param text - AIL-8.2 Text
   */
  startDateTimeOffsetUnits({ code, text }: { code: string; text?: string }): this {
    this.fields[7] = this.createComponentsField([code, text]);
    return this;
  }

  /** AIL-9 Duration (chainable). */
  duration(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /**
   * AIL-10 Duration Units (chainable).
   * @param code - AIL-10.1 Code
   * @param text - AIL-10.2 Text
   */
  durationUnits({ code, text }: { code: string; text?: string }): this {
    this.fields[9] = this.createComponentsField([code, text]);
    return this;
  }

  /** AIL-11 Allow Substitution Code (chainable). */
  allowSubstitutionCode(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /**
   * AIL-12 Filler Status Code (chainable).
   * @param code - AIL-12.1 Code
   * @param text - AIL-12.2 Text
   */
  fillerStatusCode({ code, text }: { code: string; text?: string }): this {
    this.fields[11] = this.createComponentsField([code, text]);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<AIL> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "AIL") {
      return {
        ok: false,
        err: new Err(`Expected AIL segment, got ${parts[0]}`),
      };
    }
    const seg = new AIL();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
