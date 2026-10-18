/**
 * TQ2 segment definition for HL7 v2.5.
 *
 * position-tests: hand-written (composite and repeating fields; see TQ2.test.ts)
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { components, eiParts, type EI } from "../../utils/composites.ts";

/**
 * TQ2 - Timing/Quantity Relationship Segment (HL7 v2.5)
 *
 * Relates a timing/quantity (TQ1) to other orders and sets conditions for the sequence in
 * which the orders run. Repeating fields take one argument per repetition; a string
 * argument is used verbatim as the raw text of that repetition.
 */
export class TQ2 extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "TQ2";

  constructor() {
    super();
    this.fields = [];
  }

  /** TQ2-1 Set ID - TQ2 (chainable). */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** TQ2-2 Sequence/Results Flag (ID, table 0503) (chainable). */
  sequenceResultsFlag(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** TQ2-3 Related Placer Number (EI, repeating) (chainable). */
  relatedPlacerNumber(...values: (EI | string)[]): this {
    this.fields[2] = this.eiRepetitions(values);
    return this;
  }

  /** TQ2-4 Related Filler Number (EI, repeating) (chainable). */
  relatedFillerNumber(...values: (EI | string)[]): this {
    this.fields[3] = this.eiRepetitions(values);
    return this;
  }

  /** TQ2-5 Related Placer Group Number (EI, repeating) (chainable). */
  relatedPlacerGroupNumber(...values: (EI | string)[]): this {
    this.fields[4] = this.eiRepetitions(values);
    return this;
  }

  /** TQ2-6 Sequence Condition Code (ID, table 0504) (chainable). */
  sequenceConditionCode(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** TQ2-7 Cyclic Entry/Exit Indicator (ID, table 0505) (chainable). */
  cyclicEntryExitIndicator(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /**
   * TQ2-8 Sequence Condition Time Interval (CQ) (chainable).
   * @param value - TQ2-8.1 Quantity
   * @param units - TQ2-8.2 Units
   */
  sequenceConditionTimeInterval({ value, units }: { value: string; units?: string }): this {
    this.fields[7] = this.createComponentsField([value, units]);
    return this;
  }

  /** TQ2-9 Cyclic Group Maximum Number of Repeats (NM) (chainable). */
  cyclicGroupMaximumNumberOfRepeats(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /** TQ2-10 Special Service Request Relationship (ID, table 0506) (chainable). */
  specialServiceRequestRelationship(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }

  private eiRepetitions(values: (EI | string)[]) {
    return this.createRepeatingField(
      values.map((v) => this.createField(typeof v === "string" ? v : components(eiParts(v)))),
    );
  }

  /** Parses the input string into a structured instance. */
  static parse(segmentString: string, encoding: EncodingCharacters): Result<TQ2> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "TQ2") {
      return { ok: false, err: new Err(`Expected TQ2 segment, got ${parts[0]}`) };
    }
    const seg = new TQ2();
    for (let i = 1; i < parts.length; i++) {
      if (parts[i] !== undefined) {
        seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
      }
    }
    return { ok: true, val: seg };
  }
}
