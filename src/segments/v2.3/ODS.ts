/**
 * ODS segment definition for HL7 v2.3.
 *
 * position-tests: hand-written (repeating setters take spread arguments; see its test file)
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";

/**
 * ODS - Dietary Orders, Supplements, and Preferences Segment (HL7 v2.3)
 *
 * Dietary order detail (diet, supplement or preference).
 */
export class ODS extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "ODS";

  constructor() {
    super();
    this.fields = [];
  }

  /** ODS-1 Type (chainable). */
  type(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /**
   * ODS-2 Service Period (chainable).
   * @param identifier - ODS-2.1 Identifier
   * @param text - ODS-2.2 Text
   * @param nameOfCodingSystem - ODS-2.3 Name of Coding System
   * @param alternateIdentifier - ODS-2.4 Alternate Identifier
   * @param alternateText - ODS-2.5 Alternate Text
   * @param nameOfAlternateCodingSystem - ODS-2.6 Name of Alternate Coding System
   */
  servicePeriod(...values: { identifier: string; text?: string; nameOfCodingSystem?: string; alternateIdentifier?: string; alternateText?: string; nameOfAlternateCodingSystem?: string }[]): this {
    this.fields[1] = this.createRepeatingField(values.map(({ identifier, text, nameOfCodingSystem, alternateIdentifier, alternateText, nameOfAlternateCodingSystem }) => this.createComponentsField([identifier, text, nameOfCodingSystem, alternateIdentifier, alternateText, nameOfAlternateCodingSystem])));
    return this;
  }

  /**
   * ODS-3 Diet, Supplement, or Preference Code (chainable).
   * @param identifier - ODS-3.1 Identifier
   * @param text - ODS-3.2 Text
   * @param nameOfCodingSystem - ODS-3.3 Name of Coding System
   * @param alternateIdentifier - ODS-3.4 Alternate Identifier
   * @param alternateText - ODS-3.5 Alternate Text
   * @param nameOfAlternateCodingSystem - ODS-3.6 Name of Alternate Coding System
   */
  dietSupplementOrPreferenceCode(...values: { identifier: string; text?: string; nameOfCodingSystem?: string; alternateIdentifier?: string; alternateText?: string; nameOfAlternateCodingSystem?: string }[]): this {
    this.fields[2] = this.createRepeatingField(values.map(({ identifier, text, nameOfCodingSystem, alternateIdentifier, alternateText, nameOfAlternateCodingSystem }) => this.createComponentsField([identifier, text, nameOfCodingSystem, alternateIdentifier, alternateText, nameOfAlternateCodingSystem])));
    return this;
  }

  /** ODS-4 Text Instruction (chainable). */
  textInstruction(...values: string[]): this {
    this.fields[3] = this.createRepeatingField(values.map((value) => this.createField(value)));
    return this;
  }

  /** Get type. */
  getType(): string {
    return this.fields[0]?.components?.[0]?.subComponents?.[0] ?? "";
  }

  /** Parses the input string into a structured instance. */
  static parse(segmentString: string, encoding: EncodingCharacters): Result<ODS> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "ODS") {
      return { ok: false, err: new Err(`Expected ODS segment, got ${parts[0]}`) };
    }
    const seg = new ODS();
    for (let i = 1; i < parts.length; i++) {
      if (parts[i] !== undefined) {
        seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
      }
    }
    return { ok: true, val: seg };
  }
}
