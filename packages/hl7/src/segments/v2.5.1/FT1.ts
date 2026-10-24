/**
 * FT1 segment definition for HL7 v2.5.1.
 *
 * position-tests: hand-written (composite and repeating fields; see FT1.test.ts)
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { FT1 as FT1_base } from "../v2.5/FT1.ts";
import {
  ceParts, components, cpParts, cweParts, cxParts, xcnParts,
  type CE, type CodedElement, type CP, type CX, type XCN,
} from "../../utils/composites.ts";

/**
 * FT1 segment (HL7 v2.5.1)
 *
 * Extends v2.5 FT1 with FT1-26 to FT1-31, makes the XCN fields FT1-20, FT1-21 and FT1-24
 * repeating, and takes FT1-22 Unit Cost as a CP. FT1-4 is a DR in v2.5.1; a plain timestamp
 * is a valid DR (its range start), so `transactionDate` keeps its v2.3 form.
 */
export class FT1 extends FT1_base {
  /** FT1-20 Performed By Code (XCN, repeating) (chainable). */
  override performedByCode(...values: (XCN | string)[]): this {
    this.fields[19] = this.xcnRepetitions(values);
    return this;
  }

  /** FT1-21 Ordered By Code (XCN, repeating) (chainable). */
  override orderedByCode(...values: (XCN | string)[]): this {
    this.fields[20] = this.xcnRepetitions(values);
    return this;
  }

  /** FT1-22 Unit Cost (CP) (chainable). A string is used verbatim as the raw field text. */
  override unitCost(value: CP | string): this {
    this.fields[21] = this.createField(typeof value === "string" ? value : components(cpParts(value)));
    return this;
  }

  /** FT1-24 Entered By Code (XCN, repeating) (chainable). */
  override enteredByCode(...values: (XCN | string)[]): this {
    this.fields[23] = this.xcnRepetitions(values);
    return this;
  }

  /** FT1-26 Procedure Code Modifier (CE, repeating, table 0340) (chainable). */
  procedureCodeModifier(...values: (CE | string)[]): this {
    this.fields[25] = this.createRepeatingField(
      values.map((v) => this.createField(typeof v === "string" ? v : components(ceParts(v)))),
    );
    return this;
  }

  /** FT1-27 Advanced Beneficiary Notice Code (CE, table 0339) (chainable). */
  advancedBeneficiaryNoticeCode(value: CE | string): this {
    this.fields[26] = this.createField(typeof value === "string" ? value : components(ceParts(value)));
    return this;
  }

  /** FT1-28 Medically Necessary Duplicate Procedure Reason (CWE, table 0476) (chainable). */
  medicallyNecessaryDuplicateProcedureReason(value: CodedElement): this {
    this.fields[27] = this.createField(components(cweParts(value)));
    return this;
  }

  /** FT1-29 NDC Code (CNE, table 0549) (chainable). */
  ndcCode(value: CodedElement): this {
    this.fields[28] = this.createField(components(cweParts(value)));
    return this;
  }

  /** FT1-30 Payment Reference ID (CX) (chainable). A string is used verbatim as the raw field text. */
  paymentReferenceId(value: CX | string): this {
    this.fields[29] = this.createField(typeof value === "string" ? value : components(cxParts(value)));
    return this;
  }

  /** FT1-31 Transaction Reference Key (SI, repeating) (chainable). */
  transactionReferenceKey(...values: string[]): this {
    this.fields[30] = this.createRepeatingField(values.map((v) => this.createField(v)));
    return this;
  }

  private xcnRepetitions(values: (XCN | string)[]) {
    return this.createRepeatingField(
      values.map((v) => this.createField(typeof v === "string" ? v : components(xcnParts(v)))),
    );
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<FT1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "FT1") {
      return { ok: false, err: new Err(`Expected FT1 segment, got ${parts[0]}`) };
    }
    const seg = new FT1();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
