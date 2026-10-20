/**
 * PRA segment definition for HL7 v2.4.
 *
 * position-tests: hand-written (overrides of the v2.3.1 PRA; see PRA.test.ts)
 *
 * @module
 */
import { PRA as PRA_base } from "../v2.3.1/PRA.ts";
import {
  formatHL7Date,
  DateLayout,
  type HL7DateLayout,
} from "../../utils/hl7DateUtils.ts";

/**
 * PRA segment (HL7 v2.4)
 *
 * Extends v2.3.1 PRA with PRA-8 Date Entered Practice. The v2.3 table has seven fields (hl7.eu
 * and HAPI); the eighth is a v2.4 addition.
 */
export class PRA extends PRA_base {
  /** PRA-8 Date Entered Practice (chainable). */
  dateEnteredPractice(value: string, format?: never): this;
  /** PRA-8 Date Entered Practice (chainable). */
  dateEnteredPractice(value: Date, format?: HL7DateLayout): this;
  dateEnteredPractice(value: string | Date, format?: HL7DateLayout): this {
    this.fields[7] = this.createField(
      formatHL7Date(value, format ?? DateLayout),
    );
    return this;
  }
}
