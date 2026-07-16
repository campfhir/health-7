/**
 * MFE segment definition for HL7 v2.3.
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
 * MFE - Master File Entry Segment
 *
 * Contains one record-level entry in the master file update.
 * Repeats for each staff record in an MFN^M02 message.
 *
 * HL7 v2.3 Specification
 */
export class MFE extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "MFE";

  constructor() {
    super();
    this.fields = [];
  }

  /** MFE-1 Record-Level Event Code (chainable). */
  recordLevelEventCode(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** MFE-2 MFN Control ID (chainable). */
  mfnControlId(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** MFE-3 Effective Date/Time (chainable). */
  effectiveDateTime(value: string, format?: never): this;
  /** MFE-3 Effective Date/Time (chainable). */
  effectiveDateTime(value: Date, format?: HL7DateTimeLayout): this;
  effectiveDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[2] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** MFE-4 Primary Key Value (chainable). */
  primaryKeyValue(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** MFE-5 Primary Key Value Type (chainable). */
  primaryKeyValueType(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** Get record level event code. */
  getRecordLevelEventCode(): string {
    return this.fields[0]?.components[0]?.subComponents[0] ?? "";
  }

  /** Get mfn control id. */
  getMfnControlId(): string {
    return this.fields[1]?.components[0]?.subComponents[0] ?? "";
  }

  /** Get primary key value. */
  getPrimaryKeyValue(): string {
    return this.fields[3]?.components[0]?.subComponents[0] ?? "";
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<MFE> {
    const parts = segmentString.split(encoding.fieldSeparator);

    if (parts[0] !== "MFE") {
      return {
        ok: false,
        err: new Err(`Expected MFE segment, got ${parts[0]}`),
      };
    }

    const mfe = new MFE();
    for (let i = 1; i < parts.length; i++) {
      mfe.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }

    return { ok: true, val: mfe };
  }
}
