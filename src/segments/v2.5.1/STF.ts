/**
 * STF segment definition for HL7 v2.5.1.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { STF as STF_base } from "../v2.3/STF.ts";
import {
  DateTimeLayout,
  formatHL7Date,
  type HL7DateTimeLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * STF segment (HL7 v2.5.1)
 * Extends v2.3 STF. Add v2.5.1-specific fields here as needed.
 */
export class STF extends STF_base {
  /**
   * STF-27 Race (chainable).
   * @param code - STF-27.1 Identifier
   * @param text - STF-27.2 Text
   * @param codingSystem - STF-27.3 Name of Coding System
   */
  race({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[26] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * STF-28 Ethnic Group (chainable).
   * @param code - STF-28.1 Identifier
   * @param text - STF-28.2 Text
   * @param codingSystem - STF-28.3 Name of Coding System
   */
  ethnicGroup({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[27] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** STF-29 Re-activation Approval Indicator (chainable). */
  reactivationApprovalIndicator(value: string): this {
    this.fields[28] = this.createField(value);
    return this;
  }

  /**
   * STF-30 Citizenship (chainable).
   * @param code - STF-30.1 Identifier
   * @param text - STF-30.2 Text
   * @param codingSystem - STF-30.3 Name of Coding System
   */
  citizenship({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[29] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** STF-31 Death Date and Time (chainable). */
  deathDateAndTime(value: string, format?: never): this;
  /** STF-31 Death Date and Time (chainable). */
  deathDateAndTime(value: Date, format?: HL7DateTimeLayout): this;
  deathDateAndTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[30] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** STF-32 Death Indicator (chainable). */
  deathIndicator(value: string): this {
    this.fields[31] = this.createField(value);
    return this;
  }

  /**
   * STF-33 Institution Relationship Type Code (chainable).
   * @param code - STF-33.1 Identifier
   * @param text - STF-33.2 Text
   * @param codingSystem - STF-33.3 Name of Coding System
   */
  institutionRelationshipTypeCode({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[32] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /**
   * STF-34 Institution Relationship Period (chainable).
   * @param rangeStartDateTime - STF-34.1 Range Start Date/Time
   * @param rangeEndDateTime - STF-34.2 Range End Date/Time
   */
  institutionRelationshipPeriod({ rangeStartDateTime, rangeEndDateTime }: { rangeStartDateTime: string; rangeEndDateTime?: string }): this {
    this.fields[33] = this.createComponentsField([
      rangeStartDateTime,
      rangeEndDateTime,
    ]);
    return this;
  }

  /** STF-35 Expected Return Date (chainable). */
  expectedReturnDate(value: string): this {
    this.fields[34] = this.createField(value);
    return this;
  }

  /**
   * STF-36 Cost Center Code (chainable).
   * @param code - STF-36.1 Identifier
   * @param text - STF-36.2 Text
   * @param codingSystem - STF-36.3 Name of Coding System
   */
  costCenterCode({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[35] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** STF-37 Generic Classification Indicator (chainable). */
  genericClassificationIndicator(value: string): this {
    this.fields[36] = this.createField(value);
    return this;
  }

  /**
   * STF-38 Inactive Reason Code (chainable).
   * @param code - STF-38.1 Identifier
   * @param text - STF-38.2 Text
   * @param codingSystem - STF-38.3 Name of Coding System
   */
  inactiveReasonCode({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[37] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<STF> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "STF") {
      return { ok: false, err: new Err(`Expected STF segment, got ${parts[0]}`) };
    }
    const seg = new STF();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
