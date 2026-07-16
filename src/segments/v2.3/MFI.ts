/**
 * MFI segment definition for HL7 v2.3.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import {
  formatHL7Date,
  DateTimeLayout,
  type HL7DateTimeLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * MFI - Master File Identification Segment
 *
 * Identifies the master file being updated and the type of operation.
 * Appears once per MFN message, immediately after MSH.
 *
 * HL7 v2.3 Specification
 */
export class MFI extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "MFI";

  constructor() {
    super();
    this.fields = [];
  }

  /**
   * MFI-1 Master File Identifier (chainable).
   * @param identifier - MFI-1.1 Identifier
   * @param text - MFI-1.2 Text
   * @param codingSystem - MFI-1.3 Coding System
   */
  masterFileIdentifier(
    identifier: string,
    text?: string,
    codingSystem?: string,
  ): this {
    if (text || codingSystem) {
      this.fields[0] = this.createField([
        [identifier, text || "", codingSystem || ""],
      ]);
    } else {
      this.fields[0] = this.createField(identifier);
    }
    return this;
  }

  /** MFI-2 Master File Application Identifier (chainable). */
  masterFileApplicationIdentifier(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** MFI-3 File-Level Event Code (chainable). */
  fileLevelEventCode(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** MFI-4 Entered Date/Time (chainable). */
  enteredDateTime(value: string, format?: never): this;
  /** MFI-4 Entered Date/Time (chainable). */
  enteredDateTime(value: Date, format?: HL7DateTimeLayout): this;
  enteredDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[3] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** MFI-5 Effective Date/Time (chainable). */
  effectiveDateTime(value: string, format?: never): this;
  /** MFI-5 Effective Date/Time (chainable). */
  effectiveDateTime(value: Date, format?: HL7DateTimeLayout): this;
  effectiveDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[4] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** MFI-6 Response Level Code (chainable). */
  responseLevelCode(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** Get master file identifier. */
  getMasterFileIdentifier(): string {
    return this.fields[0]?.components[0]?.subComponents[0] ?? "";
  }

  /** Get file level event code. */
  getFileLevelEventCode(): string {
    return this.fields[2]?.components[0]?.subComponents[0] ?? "";
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<MFI> {
    const parts = segmentString.split(encoding.fieldSeparator);

    if (parts[0] !== "MFI") {
      return {
        ok: false,
        err: new Err(`Expected MFI segment, got ${parts[0]}`),
      };
    }

    const mfi = new MFI();
    for (let i = 1; i < parts.length; i++) {
      mfi.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }

    return { ok: true, val: mfi };
  }
}
