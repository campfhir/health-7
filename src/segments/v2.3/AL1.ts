import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { BaseSegment } from "../../types/segment";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import {
  DateLayout,
  formatHL7Date,
  HL7DateLayout,
} from "../../utils/hl7DateUtils";

/**
 * AL1 - Patient Allergy Information Segment (HL7 v2.3)
 * Transmits patient allergy information as part of an ADT message.
 */
export class AL1 extends BaseSegment {
  name = "AL1";

  constructor() {
    super();
    this.fields = [];
  }

  /**
   * AL1-1: Set ID (SI, required)
   * Sequence number of this segment within the message.
   */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /**
   * AL1-2: Allergen Type Code (IS, optional)
   * Type of allergy (e.g., DA=Drug, FA=Food, EA=Environmental, MA=Miscellaneous).
   */
  allergenTypeCode(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /**
   * AL1-3: Allergen Code/Mnemonic/Description (CE, required)
   * Uniquely identifies the allergen.
   */
  allergen(code: string, text?: string, codingSystem?: string): this {
    const components = [code, text || "", codingSystem || ""];
    this.fields[2] = this.createField(components);
    return this;
  }

  /**
   * AL1-4: Allergy Severity Code (IS, optional)
   * Severity of the allergy (e.g., SV=Severe, MO=Moderate, MI=Mild, U=Unknown).
   */
  allergySeverityCode(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /**
   * AL1-5: Allergy Reaction Code (ST, optional, repeating)
   * Describes the reaction caused by the allergen.
   */
  allergyReaction(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /**
   * AL1-6: Identification Date (DT, optional)
   * The date the allergy was identified.
   */
  identificationDate(value: string, format?: never): this;
  identificationDate(value: Date, format?: HL7DateLayout): this;
  identificationDate(value: string | Date, format?: HL7DateLayout): this {
    this.fields[5] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }

  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<AL1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "AL1") {
      return {
        ok: false,
        err: new Err(`Expected AL1 segment, got ${parts[0]}`),
      };
    }
    const seg = new AL1();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
