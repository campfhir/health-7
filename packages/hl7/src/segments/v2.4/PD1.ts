/**
 * PD1 segment definition for HL7 v2.4.
 *
 * position-tests: hand-written (overrides of the v2.3.1 PD1; see PD1.test.ts)
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { PD1 as PD1_base } from "../v2.3.1/PD1.ts";

/**
 * PD1 segment (HL7 v2.4)
 *
 * Extends v2.3.1 PD1 with PD1-13 to PD1-21 (Protection Indicator Effective Date through Military Status). Source: hl7.eu v2.4 PD1 table (21 fields).
 */
export class PD1 extends PD1_base {
  /** PD1-13 Protection Indicator Effective Date (chainable). */
  protectionIndicatorEffectiveDate(date: string): this {
    this.fields[12] = this.createField(date);
    return this;
  }

  /** PD1-14 Place of Worship (chainable). */
  placeOfWorship(name: string): this {
    this.fields[13] = this.createField(name);
    return this;
  }

  /**
   * PD1-15 Advance Directive Code (chainable).
   * @param code - PD1-15.1 Code
   * @param text - PD1-15.2 Text
   * @param codingSystem - PD1-15.3 Coding System
   */
  advanceDirectiveCode({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[14] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** PD1-16 Immunization Registry Status (chainable). */
  immunizationRegistryStatus(status: string): this {
    this.fields[15] = this.createField(status);
    return this;
  }

  /** PD1-17 Immunization Registry Status Effective Date (chainable). */
  immunizationRegistryStatusEffectiveDate(date: string): this {
    this.fields[16] = this.createField(date);
    return this;
  }

  /** PD1-18 Publicity Code Effective Date (chainable). */
  publicityCodeEffectiveDate(date: string): this {
    this.fields[17] = this.createField(date);
    return this;
  }

  /** PD1-19 Military Branch (chainable). */
  militaryBranch(branch: string): this {
    this.fields[18] = this.createField(branch);
    return this;
  }

  /** PD1-20 Military Rank/Grade (chainable). */
  militaryRankGrade(rank: string): this {
    this.fields[19] = this.createField(rank);
    return this;
  }

  /** PD1-21 Military Status (chainable). */
  militaryStatus(status: string): this {
    this.fields[20] = this.createField(status);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<PD1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "PD1") {
      return { ok: false, err: new Err(`Expected PD1 segment, got ${parts[0]}`) };
    }
    const seg = new PD1();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
