/**
 * MRG segment definition for HL7 v2.3.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";

/**
 * MRG - Merge Patient Information Segment (HL7 v2.3)
 * Used in patient merge/move events (A34–A40) to identify the prior patient.
 */
export class MRG extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "MRG";

  constructor() {
    super();
    this.fields = [];
  }

  /**
   * MRG-1 Prior Patient Identifier List (chainable).
   * @param id - MRG-1.1 ID Number
   * @param assigningAuthority - MRG-1.4 Assigning Authority
   * @param identifierTypeCode - MRG-1.5 Identifier Type Code
   */
  priorPatientId(
    id: string,
    assigningAuthority?: string,
    identifierTypeCode?: string,
  ): this {
    // CX: ID Number (.1), Assigning Authority (.4), Identifier Type Code (.5).
    this.fields[0] = this.createComponentsField([
      id,
      undefined,
      undefined,
      assigningAuthority,
      identifierTypeCode,
    ]);
    return this;
  }

  /** MRG-2 Prior Alternate Patient ID (chainable). */
  priorAlternatePatientId(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** MRG-3 Prior Patient Account Number (chainable). */
  priorPatientAccountNumber(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** MRG-4 Prior Patient ID (chainable). */
  priorPatientIdDeprecated(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** MRG-5 Prior Visit Number (chainable). */
  priorVisitNumber(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** MRG-6 Prior Alternate Visit ID (chainable). */
  priorAlternateVisitId(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /**
   * MRG-7 Prior Patient Name (chainable).
   * @param familyName - MRG-7.1 Family Name
   * @param givenName - MRG-7.2 Given Name
   */
  priorPatientName(familyName: string, givenName?: string): this {
    this.fields[6] = this.createField([familyName, givenName || ""]);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<MRG> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "MRG") {
      return {
        ok: false,
        err: new Err(`Expected MRG segment, got ${parts[0]}`),
      };
    }
    const seg = new MRG();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
