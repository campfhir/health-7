/**
 * RXA segment definition for HL7 v2.3.
 *
 * position-tests: hand-written (composite and repeating fields; see RXA.test.ts)
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
  DateLayout,
  type HL7DateLayout,
  DateTimeLayout,
  type HL7DateTimeLayout,
} from "../../utils/hl7DateUtils.ts";
import {
  codedParts, components, la2Parts, xcnInputParts,
  type CodedInput, type LA2, type XcnInput,
} from "../../utils/composites.ts";

/**
 * RXA - Pharmacy/Treatment Administration Segment (HL7 v2.3, 22 fields)
 *
 * Repeating fields (RXA-9, 15, 16, 17, 18, 19) take one argument per repetition; the CE fields
 * take a CE or the shorter `code`/`text`/`codingSystem` shape; a string argument where
 * offered is used verbatim as the raw field text. RXA-10 repeats from v2.3.1, and RXA-23 to
 * RXA-26 were added in v2.5.
 */
export class RXA extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "RXA";

  constructor() {
    super();
    this.fields = [];
  }

  /** RXA-1 Give Sub-ID Counter (chainable). */
  giveSubIdCounter(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** RXA-2 Administration Sub-ID Counter (chainable). */
  administrationSubIdCounter(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** RXA-3 Date/Time Start of Administration (chainable). */
  dateTimeStartOfAdministration(value: string, format?: never): this;
  /** RXA-3 Date/Time Start of Administration (chainable). */
  dateTimeStartOfAdministration(value: Date, format?: HL7DateTimeLayout): this;
  dateTimeStartOfAdministration(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[2] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** RXA-4 Date/Time End of Administration (chainable). */
  dateTimeEndOfAdministration(value: string, format?: never): this;
  /** RXA-4 Date/Time End of Administration (chainable). */
  dateTimeEndOfAdministration(value: Date, format?: HL7DateTimeLayout): this;
  dateTimeEndOfAdministration(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[3] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** RXA-5 Administered Code (CE) (chainable). Takes a CE, or the `code`/`text`/`codingSystem` shape. */
  administeredCode(value: CodedInput): this {
    this.fields[4] = this.createField(components(codedParts(value, 6)));
    return this;
  }

  /** RXA-6 Administered Amount (chainable). */
  administeredAmount(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** RXA-7 Administered Units (CE) (chainable). Takes a CE, or the `code`/`text`/`codingSystem` shape. */
  administeredUnits(value: CodedInput): this {
    this.fields[6] = this.createField(components(codedParts(value, 6)));
    return this;
  }

  /** RXA-8 Administered Dosage Form (CE) (chainable). Takes a CE, or the `code`/`text`/`codingSystem` shape. */
  administeredDosageForm(value: CodedInput): this {
    this.fields[7] = this.createField(components(codedParts(value, 6)));
    return this;
  }

  /**
   * RXA-9 Administration Notes (CE, repeating) (chainable). One argument per repetition.
   */
  administrationNotes(...values: CodedInput[]): this {
    this.fields[8] = this.createRepeatingField(
      values.map((v) => this.createField(components(codedParts(v, 6)))),
    );
    return this;
  }

  /**
   * RXA-10 Administering Provider (XCN) (chainable). Takes an XCN (its first fourteen
   * components are modelled) or the short `id`/`familyName`/`givenName` shape; a string is used verbatim. Repeats from
   * v2.3.1: the v2.3.1 class takes one argument per repetition.
   */
  administeringProvider(value: XcnInput | string): this {
    this.fields[9] = this.createField(typeof value === "string" ? value : components(xcnInputParts(value)));
    return this;
  }

  /**
   * RXA-11 Administered-at Location (chainable): sixteen components, the first eight as in
   * PV1-3 and the last eight an address. Takes the full location (facility as an HD or
   * string); the earlier four-component call still works.
   */
  administeredAtLocation(value: LA2): this {
    this.fields[10] = this.createField(components(la2Parts(value)));
    return this;
  }

  /** RXA-12 Administered Per (Time Unit) (chainable). */
  administeredPer(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }

  /** RXA-13 Administered Strength (chainable). */
  administeredStrength(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }

  /** RXA-14 Administered Strength Units (CE) (chainable). Takes a CE, or the `code`/`text`/`codingSystem` shape. */
  administeredStrengthUnits(value: CodedInput): this {
    this.fields[13] = this.createField(components(codedParts(value, 6)));
    return this;
  }

  /** RXA-15 Substance Lot Number (ST, repeating) (chainable). One argument per repetition. */
  substanceLotNumber(...values: string[]): this {
    this.fields[14] = this.createRepeatingField(values.map((v) => this.createField(v)));
    return this;
  }

  /** RXA-16 Substance Expiration Date (chainable). */
  substanceExpirationDate(...values: (string | Date | { value: string | Date; format?: HL7DateLayout })[]): this {
    this.fields[15] = this.createRepeatingField(
      values.map((v) =>
        this.createField(
          v instanceof Date || typeof v === "string"
            ? formatHL7Date(v, DateLayout)
            : formatHL7Date(v.value, v.format ?? DateLayout),
        ),
      ),
    );
    return this;
  }

  /**
   * RXA-16 Substance Expiration Date, all repetitions (chainable). Dates are formatted with the date layout.
   */
  substanceExpirationDates(...values: (string | Date)[]): this {
    this.fields[15] = this.createRepeatingField(
      values.map((v) => this.createField(formatHL7Date(v, DateLayout))),
    );
    return this;
  }

  /**
   * RXA-17 Substance Manufacturer Name (CE, repeating) (chainable). One argument per repetition.
   */
  substanceManufacturerName(...values: CodedInput[]): this {
    this.fields[16] = this.createRepeatingField(
      values.map((v) => this.createField(components(codedParts(v, 6)))),
    );
    return this;
  }

  /**
   * RXA-18 Substance/Treatment Refusal Reason (CE, repeating) (chainable). One argument per repetition.
   */
  substanceRefusalReason(...values: CodedInput[]): this {
    this.fields[17] = this.createRepeatingField(
      values.map((v) => this.createField(components(codedParts(v, 6)))),
    );
    return this;
  }

  /**
   * RXA-19 Indication (CE, repeating) (chainable). One argument per repetition.
   */
  indication(...values: CodedInput[]): this {
    this.fields[18] = this.createRepeatingField(
      values.map((v) => this.createField(components(codedParts(v, 6)))),
    );
    return this;
  }

  /** RXA-20 Completion Status (chainable). */
  completionStatus(value: string): this {
    this.fields[19] = this.createField(value);
    return this;
  }

  /** RXA-21 Action Code (chainable). */
  actionCode(value: string): this {
    this.fields[20] = this.createField(value);
    return this;
  }

  /** RXA-22 System Entry Date/Time (chainable). */
  systemEntryDateTime(value: string, format?: never): this;
  /** RXA-22 System Entry Date/Time (chainable). */
  systemEntryDateTime(value: Date, format?: HL7DateTimeLayout): this;
  systemEntryDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[21] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(segmentString: string, encoding: EncodingCharacters): Result<RXA> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "RXA") {
      return { ok: false, err: new Err(`Expected RXA segment, got ${parts[0]}`) };
    }
    const seg = new RXA();
    for (let i = 1; i < parts.length; i++) {
      if (parts[i] !== undefined) {
        seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
      }
    }
    return { ok: true, val: seg };
  }
}
