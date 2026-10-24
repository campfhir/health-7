/**
 * AL1 segment definition for HL7 v2.3.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import {
  DateLayout,
  formatHL7Date,
  type HL7DateLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * AL1 - Patient Allergy Information Segment (HL7 v2.3)
 * Transmits patient allergy information as part of an ADT message.
 */
export class AL1 extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "AL1";

  constructor() {
    super();
    this.fields = [];
  }

  /** AL1-1 Set ID (chainable). */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** AL1-2 Allergen Type Code (chainable). */
  allergenTypeCode(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /**
   * AL1-3 Allergen Code/Mnemonic/Description (chainable).
   * @param code - AL1-3.1 Code
   * @param text - AL1-3.2 Text
   * @param codingSystem - AL1-3.3 Coding System
   */
  allergen({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    const components = [code, text || "", codingSystem || ""];
    this.fields[2] = this.createField(components);
    return this;
  }

  /** AL1-4 Allergy Severity Code (chainable). */
  allergySeverityCode(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** AL1-5 Allergy Reaction Code (chainable). */
  allergyReaction(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** AL1-6 Identification Date (chainable). */
  identificationDate(value: string, format?: never): this;
  /** AL1-6 Identification Date (chainable). */
  identificationDate(value: Date, format?: HL7DateLayout): this;
  identificationDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[5] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<AL1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "AL1") {
      return {
        ok: false,
        err: new Err(`Expected AL1 segment, got ${parts[0]}`),
      };
    }
    const seg = new AL1();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
