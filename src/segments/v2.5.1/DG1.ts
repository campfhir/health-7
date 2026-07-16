/**
 * DG1 segment definition for HL7 v2.5.1.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { DG1 as DG1_base } from "../v2.3/DG1.ts";

/**
 * DG1 segment (HL7 v2.5.1)
 * Extends v2.3 DG1. Add v2.5.1-specific fields here as needed.
 */
export class DG1 extends DG1_base {
  /**
   * DG1-20 Diagnosis Identifier (chainable).
   * @param entityIdentifier - DG1-20.1 Entity Identifier
   * @param namespaceId - DG1-20.2 Namespace ID
   */
  diagnosisIdentifier(entityIdentifier: string, namespaceId?: string): this {
    this.fields[19] = this.createComponentsField([
      entityIdentifier,
      namespaceId,
    ]);
    return this;
  }

  /** DG1-21 Diagnosis Action Code (chainable). */
  diagnosisActionCode(value: string): this {
    this.fields[20] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<DG1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "DG1") {
      return { ok: false, err: new Err(`Expected DG1 segment, got ${parts[0]}`) };
    }
    const seg = new DG1();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
