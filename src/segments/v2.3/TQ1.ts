import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { BaseSegment } from "../../types/segment";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";

/**
 * TQ1 - Timing/Quantity Segment (HL7 v2.3)
 */
export class TQ1 extends BaseSegment {
  name = "TQ1";

  constructor() {
    super();
    this.fields = [];
  }

  /** TQ1-1: Set ID (SI) */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** TQ1-2: Quantity (CQ) */
  quantity(value: string, units?: string): this {
    this.fields[1] = this.createField([[value, units || ""]]);
    return this;
  }

  /** TQ1-3: Repeat Pattern (RPT) e.g. Q8H, QD, BID, TID */
  repeatPattern(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** TQ1-4: Explicit Time (TM) */
  explicitTime(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** TQ1-5: Relative Time and Units (CQ) */
  relativeTime(value: string, units?: string): this {
    this.fields[4] = this.createField([[value, units || ""]]);
    return this;
  }

  /** TQ1-6: Service Duration (CQ) */
  serviceDuration(value: string, units?: string): this {
    this.fields[5] = this.createField([[value, units || ""]]);
    return this;
  }

  /** TQ1-7: Start Date/Time (TS) */
  startDateTime(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** TQ1-8: End Date/Time (TS) */
  endDateTime(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }

  /** TQ1-9: Priority (CWE) e.g. R=Routine, S=Stat, A=ASAP, P=Pre-op, C=Callback */
  priority(code: string, text?: string, codingSystem?: string): this {
    this.fields[8] = this.createField([[code, text || "", codingSystem || ""]]);
    return this;
  }

  /** TQ1-10: Condition Text (TX) */
  conditionText(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }

  /** TQ1-11: Text Instruction (TX) */
  textInstruction(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /** TQ1-12: Conjunction (ID) e.g. S=Synchronous, A=Asynchronous, C=Check with patient */
  conjunction(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }

  /** TQ1-13: Occurrence Duration (CQ) */
  occurrenceDuration(value: string, units?: string): this {
    this.fields[12] = this.createField([[value, units || ""]]);
    return this;
  }

  /** TQ1-14: Total Occurrences (NM) */
  totalOccurrences(value: string): this {
    this.fields[13] = this.createField(value);
    return this;
  }

  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<TQ1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "TQ1") {
      return {
        ok: false,
        err: new Err(`Expected TQ1 segment, got ${parts[0]}`),
      };
    }
    const seg = new TQ1();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
