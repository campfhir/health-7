/**
 * ERR segment definition for HL7 v2.3.
 *
 * position-tests: hand-written (repeating and typed-object fields; see ERR.test.ts)
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment, type Field } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";

/** One repetition of ERR-1 (ELD): where the error is and which error it is. */
export interface ErrorCodeAndLocation {
  /** ERR-1.1 Segment ID */
  segmentId: string;
  /** ERR-1.2 Sequence */
  sequence?: string;
  /** ERR-1.3 Field Position */
  fieldPosition?: string;
  /** ERR-1.4 Code Identifying Error (CE); its components are sub-components of ERR-1.4. */
  codeIdentifyingError?: {
    /** ERR-1.4.1 Identifier */
    identifier: string;
    /** ERR-1.4.2 Text */
    text?: string;
    /** ERR-1.4.3 Name of Coding System */
    nameOfCodingSystem?: string;
    /** ERR-1.4.4 Alternate Identifier */
    alternateIdentifier?: string;
    /** ERR-1.4.5 Alternate Text */
    alternateText?: string;
    /** ERR-1.4.6 Name of Alternate Coding System */
    nameOfAlternateCodingSystem?: string;
  };
}

/**
 * ERR - Error Segment (HL7 v2.3)
 *
 * The v2.3 segment has a single, required, repeating field: ERR-1 Error Code and Location.
 * The fields ERR-2 to ERR-12 were added in v2.5 (see segments/v2.5/ERR.ts).
 */
export class ERR extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "ERR";

  constructor() {
    super();
    this.fields = [];
  }

  /**
   * ERR-1 Error Code and Location (chainable). This field repeats: pass one argument per
   * repetition. A string is used verbatim as the raw field text.
   *
   * @example
   * err.errorCodeAndLocation({ segmentId: "PID", sequence: "1", fieldPosition: "5",
   *   codeIdentifyingError: { identifier: "101", text: "Required field missing" } });
   */
  errorCodeAndLocation(...locations: (string | ErrorCodeAndLocation)[]): this {
    this.fields[0] = this.createRepeatingField(
      locations.map((loc) => (typeof loc === "string" ? this.createField(loc) : this.eld(loc))),
    );
    return this;
  }

  /** Builds one ELD repetition; trailing empty components are trimmed, interior gaps kept. */
  private eld(loc: ErrorCodeAndLocation): Field {
    const ce = loc.codeIdentifyingError;
    const code = ce
      ? trim([
          ce.identifier,
          ce.text,
          ce.nameOfCodingSystem,
          ce.alternateIdentifier,
          ce.alternateText,
          ce.nameOfAlternateCodingSystem,
        ])
      : [];
    const components = [[loc.segmentId], [loc.sequence ?? ""], [loc.fieldPosition ?? ""], code];
    while (components.length > 1 && components[components.length - 1].every((v) => v === "")) components.pop();
    return this.createField(components);
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<ERR> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "ERR") {
      return {
        ok: false,
        err: new Err(`Expected ERR segment, got ${parts[0]}`),
      };
    }
    const seg = new ERR();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}

/** Drops trailing empty entries and turns undefined into "". */
function trim(values: (string | undefined)[]): string[] {
  const out = values.map((v) => v ?? "");
  while (out.length > 0 && out[out.length - 1] === "") out.pop();
  return out;
}
