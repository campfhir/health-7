/**
 * BLG segment definition for HL7 v2.3.
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
} from "../../utils/hl7DateUtils.ts";

/**
 * BLG - Billing Segment (HL7 v2.3)
 *
 * Billing information on the ordered service for the filling application.
 */
export class BLG extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "BLG";

  constructor() {
    super();
    this.fields = [];
  }

  /**
   * BLG-1 When to Charge (chainable).
   * @param whenToChargeCode - BLG-1.1 When to Charge Code (table 0100)
   * @param dateTime - BLG-1.2 Date/Time (used only when the code is T); a Date is formatted as an HL7 timestamp
   */
  whenToCharge({ whenToChargeCode, dateTime }: { whenToChargeCode: string; dateTime?: string | Date }): this {
    const ts = dateTime instanceof Date ? formatHL7Date(dateTime, DateTimeLayout) : dateTime;
    this.fields[0] = this.createComponentsField([whenToChargeCode, ts]);
    return this;
  }

  /** BLG-2 Charge Type (chainable). */
  chargeType(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /**
   * BLG-3 Account ID (chainable).
   * @param idNumber - BLG-3.1 ID Number
   * @param checkDigit - BLG-3.2 Check Digit
   * @param checkDigitScheme - BLG-3.3 Code Identifying the Check Digit Scheme Employed
   * @param assigningAuthority - BLG-3.4 Assigning Authority
   */
  accountId({ idNumber, checkDigit, checkDigitScheme, assigningAuthority }: { idNumber: string; checkDigit?: string; checkDigitScheme?: string; assigningAuthority?: string }): this {
    this.fields[2] = this.createComponentsField([idNumber, checkDigit, checkDigitScheme, assigningAuthority]);
    return this;
  }

  /** Get when to charge. */
  getWhenToCharge(): string {
    return this.fields[0]?.components?.[0]?.subComponents?.[0] ?? "";
  }

  /** Parses the input string into a structured instance. */
  static parse(segmentString: string, encoding: EncodingCharacters): Result<BLG> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "BLG") {
      return { ok: false, err: new Err(`Expected BLG segment, got ${parts[0]}`) };
    }
    const seg = new BLG();
    for (let i = 1; i < parts.length; i++) {
      if (parts[i] !== undefined) {
        seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
      }
    }
    return { ok: true, val: seg };
  }
}
