/**
 * PID segment definition for HL7 v2.5.1.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { PID as PID_base } from "../v2.3/PID.ts";
import {
  DateTimeLayout,
  formatHL7Date,
  type HL7DateTimeLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * PID segment (HL7 v2.5.1)
 * Extends v2.3 PID. Add v2.5.1-specific fields here as needed.
 */
export class PID extends PID_base {
  /** PID-31 Identity Unknown Indicator (chainable). */
  identityUnknownIndicator(value: string): this {
    this.fields[30] = this.createField(value);
    return this;
  }
  /** PID-32 Identity Reliability Code (chainable). */
  identityReliabilityCode(value: string): this {
    this.fields[31] = this.createField(value);
    return this;
  }
  /** PID-33 Last Update Date/Time (chainable). */
  lastUpdateDateTime(value: string, format?: never): this;
  /** PID-33 Last Update Date/Time (chainable). */
  lastUpdateDateTime(value: Date, format?: HL7DateTimeLayout): this;
  lastUpdateDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[32] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }
  /** PID-34 Last Update Facility (chainable). */
  lastUpdateFacility(namespaceId: string): this {
    this.fields[33] = this.createField(namespaceId);
    return this;
  }
  /**
   * PID-35 Species Code (chainable).
   * @param code - PID-35.1 Identifier
   * @param text - PID-35.2 Text
   * @param codingSystem - PID-35.3 Name of Coding System
   */
  speciesCode({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[34] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }
  /**
   * PID-36 Breed Code (chainable).
   * @param code - PID-36.1 Identifier
   * @param text - PID-36.2 Text
   * @param codingSystem - PID-36.3 Name of Coding System
   */
  breedCode({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[35] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }
  /** PID-37 Strain (chainable). */
  strain(value: string): this {
    this.fields[36] = this.createField(value);
    return this;
  }
  /**
   * PID-38 Production Class Code (chainable).
   * @param code - PID-38.1 Identifier
   * @param text - PID-38.2 Text
   * @param codingSystem - PID-38.3 Name of Coding System
   */
  productionClassCode({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[37] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }
  /**
   * PID-39 Tribal Citizenship (chainable).
   * @param code - PID-39.1 Identifier
   * @param text - PID-39.2 Text
   * @param codingSystem - PID-39.3 Name of Coding System
   */
  tribalCitizenship({ code, text, codingSystem }: { code: string; text?: string; codingSystem?: string }): this {
    this.fields[38] = this.createComponentsField([code, text, codingSystem]);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<PID> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "PID") {
      return { ok: false, err: new Err(`Expected PID segment, got ${parts[0]}`) };
    }
    const seg = new PID();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
