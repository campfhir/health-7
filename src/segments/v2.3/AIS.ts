/**
 * AIS segment definition for HL7 v2.3.
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
 * AIS - Appointment Information - Service Segment (HL7 v2.3)
 */
export class AIS extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "AIS";

  constructor() {
    super();
    this.fields = [];
  }

  /** AIS-1: Set ID (SI, required) */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** AIS-2: Segment Action Code (ID) */
  segmentActionCode(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** AIS-3: Universal Service Identifier (CE, required) */
  universalServiceId(code: string, text?: string, codingSystem?: string): this {
    if (text || codingSystem) {
      this.fields[2] = this.createField([
        [code, text || "", codingSystem || ""],
      ]);
    } else {
      this.fields[2] = this.createField(code);
    }
    return this;
  }

  /** AIS-4: Start Date/Time (TS) */
  startDateTime(value: string, format?: never): this;
  /** Sets the start date time field (chainable). */
  startDateTime(value: Date, format?: HL7DateTimeLayout): this;
  startDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[3] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** AIS-5: Start Date/Time Offset (NM) */
  startDateTimeOffset(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** AIS-6: Start Date/Time Offset Units (CE) */
  startDateTimeOffsetUnits(code: string, text?: string): this {
    if (text) {
      this.fields[5] = this.createField([[code, text]]);
    } else {
      this.fields[5] = this.createField(code);
    }
    return this;
  }

  /** AIS-7: Duration (NM) */
  duration(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** AIS-8: Duration Units (CE) */
  durationUnits(code: string, text?: string): this {
    if (text) {
      this.fields[7] = this.createField([[code, text]]);
    } else {
      this.fields[7] = this.createField(code);
    }
    return this;
  }

  /** AIS-9: Allow Substitution Code (IS) */
  allowSubstitutionCode(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /** AIS-10: Filler Status Code (CE) */
  fillerStatusCode(code: string, text?: string): this {
    if (text) {
      this.fields[9] = this.createField([[code, text]]);
    } else {
      this.fields[9] = this.createField(code);
    }
    return this;
  }

  /** AIS-11: Placer Supplemental Service Information (CE) */
  placerSupplementalInfo(code: string, text?: string): this {
    if (text) {
      this.fields[10] = this.createField([[code, text]]);
    } else {
      this.fields[10] = this.createField(code);
    }
    return this;
  }

  /** AIS-12: Filler Supplemental Service Information (CE) */
  fillerSupplementalInfo(code: string, text?: string): this {
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
  ): Result<AIS> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "AIS") {
      return {
        ok: false,
        err: new Err(`Expected AIS segment, got ${parts[0]}`),
      };
    }
    const seg = new AIS();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
