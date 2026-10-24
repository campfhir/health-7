/**
 * RQ1 segment definition for HL7 v2.3.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";

/**
 * RQ1 - Requisition Detail-1 Segment (HL7 v2.3)
 *
 * Additional requisition detail for a supply-type order.
 */
export class RQ1 extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "RQ1";

  constructor() {
    super();
    this.fields = [];
  }

  /** RQ1-1 Anticipated Price (chainable). */
  anticipatedPrice(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /**
   * RQ1-2 Manufacturer ID (chainable).
   * @param identifier - RQ1-2.1 Identifier
   * @param text - RQ1-2.2 Text
   * @param nameOfCodingSystem - RQ1-2.3 Name of Coding System
   * @param alternateIdentifier - RQ1-2.4 Alternate Identifier
   * @param alternateText - RQ1-2.5 Alternate Text
   * @param nameOfAlternateCodingSystem - RQ1-2.6 Name of Alternate Coding System
   */
  manufacturerId({ identifier, text, nameOfCodingSystem, alternateIdentifier, alternateText, nameOfAlternateCodingSystem }: { identifier: string; text?: string; nameOfCodingSystem?: string; alternateIdentifier?: string; alternateText?: string; nameOfAlternateCodingSystem?: string }): this {
    this.fields[1] = this.createComponentsField([identifier, text, nameOfCodingSystem, alternateIdentifier, alternateText, nameOfAlternateCodingSystem]);
    return this;
  }

  /** RQ1-3 Manufacturer's Catalog (chainable). */
  manufacturersCatalog(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /**
   * RQ1-4 Vendor ID (chainable).
   * @param identifier - RQ1-4.1 Identifier
   * @param text - RQ1-4.2 Text
   * @param nameOfCodingSystem - RQ1-4.3 Name of Coding System
   * @param alternateIdentifier - RQ1-4.4 Alternate Identifier
   * @param alternateText - RQ1-4.5 Alternate Text
   * @param nameOfAlternateCodingSystem - RQ1-4.6 Name of Alternate Coding System
   */
  vendorId({ identifier, text, nameOfCodingSystem, alternateIdentifier, alternateText, nameOfAlternateCodingSystem }: { identifier: string; text?: string; nameOfCodingSystem?: string; alternateIdentifier?: string; alternateText?: string; nameOfAlternateCodingSystem?: string }): this {
    this.fields[3] = this.createComponentsField([identifier, text, nameOfCodingSystem, alternateIdentifier, alternateText, nameOfAlternateCodingSystem]);
    return this;
  }

  /** RQ1-5 Vendor Catalog (chainable). */
  vendorCatalog(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** RQ1-6 Taxable (chainable). */
  taxable(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** RQ1-7 Substitute Allowed (chainable). */
  substituteAllowed(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** Get anticipated price. */
  getAnticipatedPrice(): string {
    return this.fields[0]?.components?.[0]?.subComponents?.[0] ?? "";
  }

  /** Parses the input string into a structured instance. */
  static parse(segmentString: string, encoding: EncodingCharacters): Result<RQ1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "RQ1") {
      return { ok: false, err: new Err(`Expected RQ1 segment, got ${parts[0]}`) };
    }
    const seg = new RQ1();
    for (let i = 1; i < parts.length; i++) {
      if (parts[i] !== undefined) {
        seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
      }
    }
    return { ok: true, val: seg };
  }
}
