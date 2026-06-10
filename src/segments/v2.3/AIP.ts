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
 * AIP - Appointment Information - Personnel Resource Segment (HL7 v2.3)
 */
export class AIP extends BaseSegment {
  name = "AIP";

  constructor() {
    super();
    this.fields = [];
  }

  /** AIP-1: Set ID (SI, required) */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** AIP-2: Segment Action Code (ID) */
  segmentActionCode(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** AIP-3: Personnel Resource ID (XCN) */
  personnelResourceId(
    id: string,
    familyName?: string,
    givenName?: string,
  ): this {
    if (familyName || givenName) {
      this.fields[2] = this.createField([
        [id, familyName || "", givenName || ""],
      ]);
    } else {
      this.fields[2] = this.createField(id);
    }
    return this;
  }

  /** AIP-4: Resource Type (CE, required) */
  resourceType(code: string, text?: string, codingSystem?: string): this {
    if (text || codingSystem) {
      this.fields[3] = this.createField([
        [code, text || "", codingSystem || ""],
      ]);
    } else {
      this.fields[3] = this.createField(code);
    }
    return this;
  }

  /** AIP-5: Resource Group (CE) */
  resourceGroup(code: string, text?: string): this {
    if (text) {
      this.fields[4] = this.createField([[code, text]]);
    } else {
      this.fields[4] = this.createField(code);
    }
    return this;
  }

  /** AIP-6: Start Date/Time (TS) */
  startDateTime(value: string, format?: never): this;
  startDateTime(value: Date, format?: HL7DateTimeLayout): this;
  startDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[5] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** AIP-7: Start Date/Time Offset (NM) */
  startDateTimeOffset(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** AIP-8: Start Date/Time Offset Units (CE) */
  startDateTimeOffsetUnits(code: string, text?: string): this {
    if (text) {
      this.fields[7] = this.createField([[code, text]]);
    } else {
      this.fields[7] = this.createField(code);
    }
    return this;
  }

  /** AIP-9: Duration (NM) */
  duration(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /** AIP-10: Duration Units (CE) */
  durationUnits(code: string, text?: string): this {
    if (text) {
      this.fields[9] = this.createField([[code, text]]);
    } else {
      this.fields[9] = this.createField(code);
    }
    return this;
  }

  /** AIP-11: Allow Substitution Code (IS) */
  allowSubstitutionCode(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /** AIP-12: Filler Status Code (CE) */
  fillerStatusCode(code: string, text?: string): this {
    if (text) {
      this.fields[11] = this.createField([[code, text]]);
    } else {
      this.fields[11] = this.createField(code);
    }
    return this;
  }

  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<AIP> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "AIP") {
      return {
        ok: false,
        err: new Err(`Expected AIP segment, got ${parts[0]}`),
      };
    }
    const seg = new AIP();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
