/**
 * OBR segment definition for HL7 v2.5.1.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { OBR as OBR_base } from "../v2.3/OBR.ts";

/**
 * OBR segment (HL7 v2.5.1)
 * Extends v2.3 OBR. Add v2.5.1-specific fields here as needed.
 */
export class OBR extends OBR_base {
  /**
   * OBR-44 Procedure Code (chainable).
   * @param code - OBR-44.1 Identifier
   * @param text - OBR-44.2 Text
   * @param codingSystem - OBR-44.3 Name of Coding System
   */
  procedureCode({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[43] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }
  /**
   * OBR-45 Procedure Code Modifier (chainable).
   * @param code - OBR-45.1 Identifier
   * @param text - OBR-45.2 Text
   * @param codingSystem - OBR-45.3 Name of Coding System
   */
  procedureCodeModifier({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[44] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }
  /**
   * OBR-46 Placer Supplemental Service Information (chainable).
   * @param code - OBR-46.1 Identifier
   * @param text - OBR-46.2 Text
   * @param codingSystem - OBR-46.3 Name of Coding System
   */
  placerSupplementalServiceInformation({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[45] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }
  /**
   * OBR-47 Filler Supplemental Service Information (chainable).
   * @param code - OBR-47.1 Identifier
   * @param text - OBR-47.2 Text
   * @param codingSystem - OBR-47.3 Name of Coding System
   */
  fillerSupplementalServiceInformation({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[46] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }
  /**
   * OBR-48 Medically Necessary Duplicate Procedure Reason (chainable).
   * @param code - OBR-48.1 Identifier
   * @param text - OBR-48.2 Text
   * @param codingSystem - OBR-48.3 Name of Coding System
   */
  medicallyNecessaryDuplicateProcedureReason({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[47] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }
  /** OBR-49 Result Handling (chainable). */
  resultHandling(value: string): this {
    this.fields[48] = this.createField(value);
    return this;
  }
  /**
   * OBR-50 Parent Universal Service Identifier (chainable).
   * @param code - OBR-50.1 Identifier
   * @param text - OBR-50.2 Text
   * @param codingSystem - OBR-50.3 Name of Coding System
   */
  parentUniversalServiceIdentifier({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[49] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<OBR> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "OBR") {
      return { ok: false, err: new Err(`Expected OBR segment, got ${parts[0]}`) };
    }
    const seg = new OBR();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
