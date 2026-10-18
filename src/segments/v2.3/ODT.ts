/**
 * ODT segment definition for HL7 v2.3.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";

/**
 * ODT - Diet Tray Instructions Segment (HL7 v2.3)
 *
 * Diet tray instruction detail.
 */
export class ODT extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "ODT";

  constructor() {
    super();
    this.fields = [];
  }

  /**
   * ODT-1 Tray Type (chainable).
   * @param identifier - ODT-1.1 Identifier
   * @param text - ODT-1.2 Text
   * @param nameOfCodingSystem - ODT-1.3 Name of Coding System
   * @param alternateIdentifier - ODT-1.4 Alternate Identifier
   * @param alternateText - ODT-1.5 Alternate Text
   * @param nameOfAlternateCodingSystem - ODT-1.6 Name of Alternate Coding System
   */
  trayType({ identifier, text, nameOfCodingSystem, alternateIdentifier, alternateText, nameOfAlternateCodingSystem }: { identifier: string; text?: string; nameOfCodingSystem?: string; alternateIdentifier?: string; alternateText?: string; nameOfAlternateCodingSystem?: string }): this {
    this.fields[0] = this.createComponentsField([identifier, text, nameOfCodingSystem, alternateIdentifier, alternateText, nameOfAlternateCodingSystem]);
    return this;
  }

  /**
   * ODT-2 Service Period (chainable).
   * @param identifier - ODT-2.1 Identifier
   * @param text - ODT-2.2 Text
   * @param nameOfCodingSystem - ODT-2.3 Name of Coding System
   * @param alternateIdentifier - ODT-2.4 Alternate Identifier
   * @param alternateText - ODT-2.5 Alternate Text
   * @param nameOfAlternateCodingSystem - ODT-2.6 Name of Alternate Coding System
   */
  servicePeriod({ identifier, text, nameOfCodingSystem, alternateIdentifier, alternateText, nameOfAlternateCodingSystem }: { identifier: string; text?: string; nameOfCodingSystem?: string; alternateIdentifier?: string; alternateText?: string; nameOfAlternateCodingSystem?: string }): this {
    this.fields[1] = this.createComponentsField([identifier, text, nameOfCodingSystem, alternateIdentifier, alternateText, nameOfAlternateCodingSystem]);
    return this;
  }

  /** ODT-3 Text Instruction (chainable). */
  textInstruction(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** Get tray type. */
  getTrayType(): string {
    return this.fields[0]?.components?.[0]?.subComponents?.[0] ?? "";
  }

  /** Parses the input string into a structured instance. */
  static parse(segmentString: string, encoding: EncodingCharacters): Result<ODT> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "ODT") {
      return { ok: false, err: new Err(`Expected ODT segment, got ${parts[0]}`) };
    }
    const seg = new ODT();
    for (let i = 1; i < parts.length; i++) {
      if (parts[i] !== undefined) {
        seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
      }
    }
    return { ok: true, val: seg };
  }
}
