/**
 * FT1 segment definition for HL7 v2.3.
 *
 * position-tests: hand-written (composite and repeating fields; see FT1.test.ts)
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment, type Repeated, repetitions } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { ceParts, components, cpParts, eiParts, plParts, xcnParts, type CE, type CP, type EI, type PL, type XCN } from "../../utils/composites.ts";
import {
  formatHL7Date,
  DateTimeLayout,
  type HL7DateTimeLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * FT1 - Financial Transaction Segment (HL7 v2.3)
 *
 * Contains the detail data necessary to post charges, payments, adjustments, etc. to patient accounting records.
 */
export class FT1 extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "FT1";

  constructor() {
    super();
    this.fields = [];
  }

  /** FT1-1 Set ID - FT1 (chainable). */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** FT1-2 Transaction ID (chainable). */
  transactionId(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** FT1-3 Transaction Batch ID (chainable). */
  transactionBatchId(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** FT1-4 Transaction Date (chainable). */
  transactionDate(value: string, format?: never): this;
  /** FT1-4 Transaction Date (chainable). */
  transactionDate(value: Date, format?: HL7DateTimeLayout): this;
  transactionDate(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[3] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** FT1-5 Transaction Posting Date (chainable). */
  transactionPostingDate(value: string, format?: never): this;
  /** FT1-5 Transaction Posting Date (chainable). */
  transactionPostingDate(value: Date, format?: HL7DateTimeLayout): this;
  transactionPostingDate(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[4] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** FT1-6 Transaction Type (chainable). */
  transactionType(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** FT1-7 Transaction Code (chainable). A string is used verbatim as the raw field text. */
  transactionCode(value: CE | string): this {
    this.fields[6] = this.createField(typeof value === "string" ? value : components(ceParts(value)));
    return this;
  }

  /** FT1-8 Transaction Description (chainable). */
  transactionDescription(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }

  /** FT1-9 Transaction Description - Alternate (chainable). */
  transactionDescriptionAlternate(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /** FT1-10 Transaction Quantity (chainable). */
  transactionQuantity(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }

  /** FT1-11 Transaction Amount - Extended (chainable). A string is used verbatim as the raw field text. */
  transactionAmountExtended(value: CP | string): this {
    this.fields[10] = this.createField(typeof value === "string" ? value : components(cpParts(value)));
    return this;
  }

  /** FT1-12 Transaction Amount - Unit (chainable). A string is used verbatim as the raw field text. */
  transactionAmountUnit(value: CP | string): this {
    this.fields[11] = this.createField(typeof value === "string" ? value : components(cpParts(value)));
    return this;
  }

  /** FT1-13 Department Code (chainable). A string is used verbatim as the raw field text. */
  departmentCode(value: CE | string): this {
    this.fields[12] = this.createField(typeof value === "string" ? value : components(ceParts(value)));
    return this;
  }

  /** FT1-14 Insurance Plan ID (chainable). A string is used verbatim as the raw field text. */
  insurancePlanId(value: CE | string): this {
    this.fields[13] = this.createField(typeof value === "string" ? value : components(ceParts(value)));
    return this;
  }

  /** FT1-15 Insurance Amount (chainable). A string is used verbatim as the raw field text. */
  insuranceAmount(value: CP | string): this {
    this.fields[14] = this.createField(typeof value === "string" ? value : components(cpParts(value)));
    return this;
  }

  /** FT1-16 Assigned Patient Location (chainable). A string is used verbatim as the raw field text. */
  assignedPatientLocation(value: PL | string): this {
    this.fields[15] = this.createField(typeof value === "string" ? value : components(plParts(value)));
    return this;
  }

  /** FT1-17 Fee Schedule (chainable). */
  feeSchedule(value: string): this {
    this.fields[16] = this.createField(value);
    return this;
  }

  /** FT1-18 Patient Type (chainable). */
  patientType(value: string): this {
    this.fields[17] = this.createField(value);
    return this;
  }

  /**
   * FT1-19 Diagnosis Code (chainable). The field repeats: pass one argument per repetition.
   * A string is used verbatim as the raw text of that repetition.
   */
  diagnosisCode(...values: Repeated<(CE | string)>[]): this {
    this.fields[18] = this.createRepeatingField(
      repetitions(values).map((v) => this.createField(typeof v === "string" ? v : components(ceParts(v)))),
    );
    return this;
  }

  /** FT1-20 Performed By Code (chainable). A string is used verbatim as the raw field text. */
  performedByCode(value: XCN | string): this {
    this.fields[19] = this.createField(typeof value === "string" ? value : components(xcnParts(value)));
    return this;
  }

  /** FT1-21 Ordered By Code (chainable). A string is used verbatim as the raw field text. */
  orderedByCode(value: XCN | string): this {
    this.fields[20] = this.createField(typeof value === "string" ? value : components(xcnParts(value)));
    return this;
  }

  /** FT1-22 Unit Cost (chainable). */
  unitCost(value: string): this {
    this.fields[21] = this.createField(value);
    return this;
  }

  /** FT1-23 Filler Order Number (chainable). A string is used verbatim as the raw field text. */
  fillerOrderNumber(value: EI | string): this {
    this.fields[22] = this.createField(typeof value === "string" ? value : components(eiParts(value)));
    return this;
  }

  /** FT1-24 Entered By Code (chainable). A string is used verbatim as the raw field text. */
  enteredByCode(value: XCN | string): this {
    this.fields[23] = this.createField(typeof value === "string" ? value : components(xcnParts(value)));
    return this;
  }

  /** FT1-25 Procedure Code (chainable). A string is used verbatim as the raw field text. */
  procedureCode(value: CE | string): this {
    this.fields[24] = this.createField(typeof value === "string" ? value : components(ceParts(value)));
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(segmentString: string, encoding: EncodingCharacters): Result<FT1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "FT1") {
      return { ok: false, err: new Err(`Expected FT1 segment, got ${parts[0]}`) };
    }
    const seg = new FT1();
    for (let i = 1; i < parts.length; i++) {
      if (parts[i] !== undefined) {
        seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
      }
    }
    return { ok: true, val: seg };
  }
}
