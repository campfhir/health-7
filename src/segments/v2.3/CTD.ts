/**
 * CTD segment definition for HL7 v2.3.
 *
 * position-tests: hand-written (composite and repeating fields; see CTD.test.ts)
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { ceParts, components, piParts, plParts, xadParts, xpnParts, xtnParts, type CE, type PI, type PL, type XAD, type XPN, type XTN } from "../../utils/composites.ts";

/**
 * CTD - Contact Data Segment (HL7 v2.3)
 *
 * Identifies the contact person(s) for a patient, referral or other business context.
 */
export class CTD extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "CTD";

  constructor() {
    super();
    this.fields = [];
  }

  /** CTD-1 Contact Role (chainable). A string is used verbatim as the raw field text. */
  contactRole(value: CE | string): this {
    this.fields[0] = this.createField(typeof value === "string" ? value : components(ceParts(value)));
    return this;
  }

  /**
   * CTD-2 Contact Name (chainable). The field repeats: pass one argument per repetition.
   * A string is used verbatim as the raw text of that repetition.
   */
  contactName(...values: (XPN | string)[]): this {
    this.fields[1] = this.createRepeatingField(
      values.map((v) => this.createField(typeof v === "string" ? v : components(xpnParts(v)))),
    );
    return this;
  }

  /**
   * CTD-3 Contact Address (chainable). The field repeats: pass one argument per repetition.
   * A string is used verbatim as the raw text of that repetition.
   */
  contactAddress(...values: (XAD | string)[]): this {
    this.fields[2] = this.createRepeatingField(
      values.map((v) => this.createField(typeof v === "string" ? v : components(xadParts(v)))),
    );
    return this;
  }

  /** CTD-4 Contact Location (chainable). A string is used verbatim as the raw field text. */
  contactLocation(value: PL | string): this {
    this.fields[3] = this.createField(typeof value === "string" ? value : components(plParts(value)));
    return this;
  }

  /**
   * CTD-5 Contact Communication Information (chainable). The field repeats: pass one argument per repetition.
   * A string is used verbatim as the raw text of that repetition.
   */
  contactCommunicationInformation(...values: (XTN | string)[]): this {
    this.fields[4] = this.createRepeatingField(
      values.map((v) => this.createField(typeof v === "string" ? v : components(xtnParts(v)))),
    );
    return this;
  }

  /** CTD-6 Preferred Method of Contact (chainable). A string is used verbatim as the raw field text. */
  preferredMethodOfContact(value: CE | string): this {
    this.fields[5] = this.createField(typeof value === "string" ? value : components(ceParts(value)));
    return this;
  }

  /**
   * CTD-7 Contact Identifiers (chainable). The field repeats: pass one argument per repetition.
   * A string is used verbatim as the raw text of that repetition.
   */
  contactIdentifiers(...values: (PI | string)[]): this {
    this.fields[6] = this.createRepeatingField(
      values.map((v) => this.createField(typeof v === "string" ? v : components(piParts(v)))),
    );
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(segmentString: string, encoding: EncodingCharacters): Result<CTD> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "CTD") {
      return { ok: false, err: new Err(`Expected CTD segment, got ${parts[0]}`) };
    }
    const seg = new CTD();
    for (let i = 1; i < parts.length; i++) {
      if (parts[i] !== undefined) {
        seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
      }
    }
    return { ok: true, val: seg };
  }
}
