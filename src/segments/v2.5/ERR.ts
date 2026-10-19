/**
 * ERR segment definition for HL7 v2.5.
 *
 * position-tests: hand-written (repeating and typed-object fields; see ERR.test.ts)
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import type { Field } from "../../types/segment.ts";
import { components, cweParts, type CodedElement } from "../../utils/composites.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { ERR as ERR_base } from "../v2.4/ERR.ts";

/** ERR-2 Error Location (ERL). */
export interface ErrorLocation {
  /** ERL.1 Segment ID */
  segmentId: string;
  /** ERL.2 Segment Sequence */
  segmentSequence?: string;
  /** ERL.3 Field Position */
  fieldPosition?: string;
  /** ERL.4 Field Repetition */
  fieldRepetition?: string;
  /** ERL.5 Component Number */
  componentNumber?: string;
  /** ERL.6 Sub-Component Number */
  subComponentNumber?: string;
}

/** ERR-12 Help Desk Contact Point (XTN). */
export interface ExtendedTelecommunicationNumber {
  /** XTN.1 Telephone Number */
  telephoneNumber?: string;
  /** XTN.2 Telecommunication Use Code */
  telecommunicationUseCode?: string;
  /** XTN.3 Telecommunication Equipment Type */
  telecommunicationEquipmentType?: string;
  /** XTN.4 Email Address */
  emailAddress?: string;
  /** XTN.5 Country Code */
  countryCode?: string;
  /** XTN.6 Area/City Code */
  areaCityCode?: string;
  /** XTN.7 Local Number */
  localNumber?: string;
  /** XTN.8 Extension */
  extension?: string;
  /** XTN.9 Any Text */
  anyText?: string;
  /** XTN.10 Extension Prefix */
  extensionPrefix?: string;
  /** XTN.11 Speed Dial Code */
  speedDialCode?: string;
  /** XTN.12 Unformatted Telephone number */
  unformattedTelephoneNumber?: string;
}

/**
 * ERR - Error Segment (HL7 v2.5)
 *
 * Adds ERR-2 to ERR-12 to the v2.4 segment; ERR-1 (Error Code and Location) is retained
 * for backward compatibility. Repeating fields take one argument per repetition, and a
 * string argument is used verbatim as the raw text of that repetition.
 */
export class ERR extends ERR_base {
  /** ERR-2 Error Location (ERL, repeating) (chainable). */
  errorLocation(...locations: (string | ErrorLocation)[]): this {
    this.fields[1] = this.createRepeatingField(
      locations.map((l) =>
        typeof l === "string"
          ? this.createField(l)
          : this.createComponentsField([
              l.segmentId,
              l.segmentSequence,
              l.fieldPosition,
              l.fieldRepetition,
              l.componentNumber,
              l.subComponentNumber,
            ]),
      ),
    );
    return this;
  }

  /** ERR-3 HL7 Error Code (CWE, table 0357) (chainable). */
  hl7ErrorCode(value: CodedElement): this {
    this.fields[2] = this.cwe(value);
    return this;
  }

  /** ERR-4 Severity (ID, table 0516) (chainable). */
  severity(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** ERR-5 Application Error Code (CWE, table 0533) (chainable). */
  applicationErrorCode(value: CodedElement): this {
    this.fields[4] = this.cwe(value);
    return this;
  }

  /** ERR-6 Application Error Parameter (ST, repeating) (chainable). */
  applicationErrorParameter(...values: string[]): this {
    this.fields[5] = this.createRepeatingField(values.map((v) => this.createField(v)));
    return this;
  }

  /** ERR-7 Diagnostic Information (TX) (chainable). */
  diagnosticInfo(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** ERR-8 User Message (TX) (chainable). */
  userMessage(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }

  /** ERR-9 Inform Person Indicator (IS, repeating, table 0517) (chainable). */
  informPersonIndicator(...values: string[]): this {
    this.fields[8] = this.createRepeatingField(values.map((v) => this.createField(v)));
    return this;
  }

  /** ERR-10 Override Type (CWE, table 0518) (chainable). */
  overrideType(value: CodedElement): this {
    this.fields[9] = this.cwe(value);
    return this;
  }

  /** ERR-11 Override Reason Code (CWE, repeating, table 0519) (chainable). */
  overrideReasonCode(...values: CodedElement[]): this {
    this.fields[10] = this.createRepeatingField(values.map((v) => this.cwe(v)));
    return this;
  }

  /** ERR-12 Help Desk Contact Point (XTN, repeating) (chainable). */
  helpDeskContactPoint(...values: (string | ExtendedTelecommunicationNumber)[]): this {
    this.fields[11] = this.createRepeatingField(
      values.map((v) =>
        typeof v === "string"
          ? this.createField(v)
          : this.createComponentsField([
              v.telephoneNumber,
              v.telecommunicationUseCode,
              v.telecommunicationEquipmentType,
              v.emailAddress,
              v.countryCode,
              v.areaCityCode,
              v.localNumber,
              v.extension,
              v.anyText,
              v.extensionPrefix,
              v.speedDialCode,
              v.unformattedTelephoneNumber,
            ]),
      ),
    );
    return this;
  }

  /** Builds one CWE value. */
  private cwe(v: CodedElement): Field {
    return this.createField(components(cweParts(v)));
  }

  /** Parses the input string into a structured instance. */
  static override parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<ERR> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "ERR") {
      return { ok: false, err: new Err(`Expected ERR segment, got ${parts[0]}`) };
    }
    const seg = new ERR();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
