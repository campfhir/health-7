import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { BaseSegment } from "../../types/segment";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";

/**
 * MFI - Master File Identification Segment
 *
 * Identifies the master file being updated and the type of operation.
 * Appears once per MFN message, immediately after MSH.
 *
 * HL7 v2.3 Specification
 */
export class MFI extends BaseSegment {
  name = "MFI";

  constructor() {
    super();
    this.fields = [];
  }

  /** MFI-1: Master File Identifier (CE) e.g., "STF" for Staff Master */
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

  /** MFI-2: Master File Application Identifier (HD) */
  masterFileApplicationIdentifier(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** MFI-3: File-Level Event Code (ID) e.g., "UPD" (Update), "REP" (Replace) */
  fileLevelEventCode(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** MFI-4: Entered Date/Time (TS) */
  enteredDateTime(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** MFI-5: Effective Date/Time (TS) */
  effectiveDateTime(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** MFI-6: Response Level Code (ID) e.g., "NE" (Never), "ER" (Error/reject only), "AL" (Always) */
  responseLevelCode(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  getMasterFileIdentifier(): string {
    return this.fields[0]?.components[0]?.subComponents[0] ?? "";
  }

  getFileLevelEventCode(): string {
    return this.fields[2]?.components[0]?.subComponents[0] ?? "";
  }

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
