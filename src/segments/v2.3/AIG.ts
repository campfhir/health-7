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
 * AIG - Appointment Information - General Resource Segment (HL7 v2.3)
 */
export class AIG extends BaseSegment {
  name = "AIG";

  constructor() {
    super();
    this.fields = [];
  }

  /** AIG-1: Set ID (SI, required) */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** AIG-2: Segment Action Code (ID) */
  segmentActionCode(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** AIG-3: Resource ID (CE) */
  resourceId(code: string, text?: string, codingSystem?: string): this {
    if (text || codingSystem) {
      this.fields[2] = this.createField([
        [code, text || "", codingSystem || ""],
      ]);
    } else {
      this.fields[2] = this.createField(code);
    }
    return this;
  }

  /** AIG-4: Resource Type (CE, required) */
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

  /** AIG-5: Resource Group (CE) */
  resourceGroup(code: string, text?: string): this {
    if (text) {
      this.fields[4] = this.createField([[code, text]]);
    } else {
      this.fields[4] = this.createField(code);
    }
    return this;
  }

  /** AIG-6: Resource Quantity (NM) */
  resourceQuantity(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** AIG-7: Resource Quantity Units (CE) */
  resourceQuantityUnits(code: string, text?: string): this {
    if (text) {
      this.fields[6] = this.createField([[code, text]]);
    } else {
      this.fields[6] = this.createField(code);
    }
    return this;
  }

  /** AIG-8: Start Date/Time (TS) */
  startDateTime(value: string, format?: never): this;
  startDateTime(value: Date, format?: HL7DateTimeLayout): this;
  startDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[7] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** AIG-9: Start Date/Time Offset (NM) */
  startDateTimeOffset(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /** AIG-10: Start Date/Time Offset Units (CE) */
  startDateTimeOffsetUnits(code: string, text?: string): this {
    if (text) {
      this.fields[9] = this.createField([[code, text]]);
    } else {
      this.fields[9] = this.createField(code);
    }
    return this;
  }

  /** AIG-11: Duration (NM) */
  duration(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /** AIG-12: Duration Units (CE) */
  durationUnits(code: string, text?: string): this {
    if (text) {
      this.fields[11] = this.createField([[code, text]]);
    } else {
      this.fields[11] = this.createField(code);
    }
    return this;
  }

  /** AIG-13: Allow Substitution Code (IS) */
  allowSubstitutionCode(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }

  /** AIG-14: Filler Status Code (CE) */
  fillerStatusCode(code: string, text?: string): this {
    if (text) {
      this.fields[13] = this.createField([[code, text]]);
    } else {
      this.fields[13] = this.createField(code);
    }
    return this;
  }

  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<AIG> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "AIG") {
      return {
        ok: false,
        err: new Err(`Expected AIG segment, got ${parts[0]}`),
      };
    }
    const seg = new AIG();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
