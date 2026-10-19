/**
 * QRD segment definition for HL7 v2.3.
 *
 * position-tests: hand-written
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

/** A person in XCN form: ID, family name, given name. */
export interface QrdPerson {
  id: string;
  familyName?: string;
  givenName?: string;
}

/** A coded element in CE form: identifier, text, coding system. */
export interface QrdCodedElement {
  code: string;
  text?: string;
  codingSystem?: string;
}

/**
 * QRD - Original-Style Query Definition Segment (HL7 v2.3)
 * Defines a query: what is being asked for, by whom, and about which subjects.
 */
export class QRD extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "QRD";

  constructor() {
    super();
    this.fields = [];
  }

  /** QRD-1 Query Date/Time (chainable). */
  queryDateTime(value: string, format?: never): this;
  /** QRD-1 Query Date/Time (chainable). */
  queryDateTime(value: Date, format?: HL7DateTimeLayout): this;
  queryDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[0] = this.createField(formatHL7Date(value, format ?? DateTimeLayout));
    return this;
  }

  /** QRD-2 Query Format Code (chainable). */
  queryFormatCode(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** QRD-3 Query Priority (chainable). */
  queryPriority(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** QRD-4 Query ID (chainable). */
  queryId(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** QRD-5 Deferred Response Type (chainable). */
  deferredResponseType(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** QRD-6 Deferred Response Date/Time (chainable). */
  deferredResponseDateTime(value: string, format?: never): this;
  /** QRD-6 Deferred Response Date/Time (chainable). */
  deferredResponseDateTime(value: Date, format?: HL7DateTimeLayout): this;
  deferredResponseDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[5] = this.createField(formatHL7Date(value, format ?? DateTimeLayout));
    return this;
  }

  /**
   * QRD-7 Quantity Limited Request (chainable).
   * @param quantity - QRD-7.1 Quantity
   * @param units - QRD-7.2 Units
   */
  quantityLimitedRequest({ quantity, units }: { quantity: string; units?: string }): this {
    this.fields[6] = this.createComponentsField([quantity, units]);
    return this;
  }

  /**
   * QRD-8 Who Subject Filter (chainable, repeating).
   * @param persons - One XCN entry per repetition
   */
  whoSubjectFilter(persons: readonly QrdPerson[]): this {
    this.fields[7] = this.createRepeatingField(
      persons.map((p) => this.createComponentsField([p.id, p.familyName, p.givenName])),
    );
    return this;
  }

  /**
   * QRD-9 What Subject Filter (chainable, repeating).
   * @param codes - One CE entry per repetition
   */
  whatSubjectFilter(codes: readonly QrdCodedElement[]): this {
    this.fields[8] = this.createRepeatingField(
      codes.map((c) => this.createComponentsField([c.code, c.text, c.codingSystem])),
    );
    return this;
  }

  /**
   * QRD-10 What Department Data Code (chainable, repeating).
   * @param codes - One CE entry per repetition
   */
  whatDepartmentDataCode(codes: readonly QrdCodedElement[]): this {
    this.fields[9] = this.createRepeatingField(
      codes.map((c) => this.createComponentsField([c.code, c.text, c.codingSystem])),
    );
    return this;
  }

  /**
   * QRD-11 What Data Code Value Qualifier (chainable, repeating).
   * Each value is written as a single component; the CM composite layout is not yet modelled.
   * @param values - One entry per repetition
   */
  whatDataCodeValueQualifier(values: readonly string[]): this {
    this.fields[10] = this.createRepeatingField(values.map((v) => this.createField(v)));
    return this;
  }

  /** QRD-12 Query Results Level (chainable). */
  queryResultsLevel(value: string): this {
    this.fields[11] = this.createField(value);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(segmentString: string, encoding: EncodingCharacters): Result<QRD> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "QRD") {
      return {
        ok: false,
        err: new Err(`Expected QRD segment, got ${parts[0]}`),
      };
    }
    const seg = new QRD();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
