import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { BaseSegment } from "../../types/segment";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";
import {
  formatHL7Date,
  DateTimeLayout,
  HL7DateTimeLayout,
} from "../../utils/hl7DateUtils";

/**
 * DRG - Diagnosis Related Group Segment (HL7 v2.3)
 * Communicates the DRG assignment and associated financial information.
 */
export class DRG extends BaseSegment {
  name = "DRG";

  constructor() {
    super();
    this.fields = [];
  }

  /** DRG-1: Diagnostic Related Group (CE) */
  diagnosticRelatedGroup(
    code: string,
    text?: string,
    codingSystem?: string,
  ): this {
    this.fields[0] = this.createField([code, text || "", codingSystem || ""]);
    return this;
  }

  /** DRG-2: DRG Assigned Date/Time (TS) */
  drgAssignedDateTime(value: string, format?: never): this;
  drgAssignedDateTime(value: Date, format?: HL7DateTimeLayout): this;
  drgAssignedDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[1] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** DRG-3: DRG Approval Indicator (ID) - Y/N */
  drgApprovalIndicator(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** DRG-4: DRG Grouper Review Code (IS) */
  drgGrouperReviewCode(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** DRG-5: Outlier Type (CE) */
  outlierType(code: string, text?: string): this {
    this.fields[4] = this.createField([code, text || ""]);
    return this;
  }

  /** DRG-6: Outlier Days (NM) */
  outlierDays(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** DRG-7: Outlier Cost (CP) */
  outlierCost(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** DRG-8: DRG Payor (IS) - e.g. C=Champus, G=Medicare, H=HMO */
  drgPayor(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }

  /** DRG-9: Outlier Reimbursement (CP) */
  outlierReimbursement(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /** DRG-10: Confidential Indicator (ID) - Y/N */
  confidentialIndicator(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }

  /** DRG-11: DRG Transfer Type (IS) - e.g. E=Transfer to another institution */
  drgTransferType(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<DRG> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "DRG") {
      return {
        ok: false,
        err: new Err(`Expected DRG segment, got ${parts[0]}`),
      };
    }
    const seg = new DRG();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
