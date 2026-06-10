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

  /** AIL-1: Set ID (SI, required) */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** AIL-2: Segment Action Code (ID) */
  segmentActionCode(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** AIL-3: Location Resource ID (PL) */
  locationResourceId(
    pointOfCare: string,
    room?: string,
    bed?: string,
    facility?: string,
  ): this {
    this.fields[2] = this.createField([
      [pointOfCare, room || "", bed || "", facility || ""],
    ]);
    return this;
  }

  /** AIL-4: Location Type-AIL (CE) */
  locationType(code: string, text?: string): this {
    if (text) {
      this.fields[3] = this.createField([[code, text]]);
    } else {
      this.fields[3] = this.createField(code);
    }
    return this;
  }

  /** AIL-5: Location Group (CE) */
  locationGroup(code: string, text?: string): this {
    if (text) {
      this.fields[4] = this.createField([[code, text]]);
    } else {
      this.fields[4] = this.createField(code);
    }
    return this;
  }

  /** AIL-6: Start Date/Time (TS) */
  startDateTime(value: string, format?: never): this;
  /** Sets the start date time field (chainable). */
  startDateTime(value: Date, format?: HL7DateTimeLayout): this;
  startDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[5] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** AIL-7: Start Date/Time Offset (NM) */
  startDateTimeOffset(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** AIL-8: Start Date/Time Offset Units (CE) */
  startDateTimeOffsetUnits(code: string, text?: string): this {
    if (text) {
      this.fields[7] = this.createField([[code, text]]);
    } else {
      this.fields[7] = this.createField(code);
    }
    return this;
  }

  /** AIL-9: Duration (NM) */
  duration(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /** AIL-10: Duration Units (CE) */
  durationUnits(code: string, text?: string): this {
    if (text) {
      this.fields[9] = this.createField([[code, text]]);
    } else {
      this.fields[9] = this.createField(code);
    }
    return this;
  }

  /** AIL-11: Allow Substitution Code (IS) */
  allowSubstitutionCode(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /** AIL-12: Filler Status Code (CE) */
  fillerStatusCode(code: string, text?: string): this {
    if (text) {
      this.fields[11] = this.createField([[code, text]]);
    } else {
      this.fields[11] = this.createField(code);
    }
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
