import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { BaseSegment } from "../../types/segment";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";

/**
 * DB1 - Disability Information Segment (HL7 v2.3)
 * Contains information about a person's disability status and related dates.
 */
export class DB1 extends BaseSegment {
  name = "DB1";

  constructor() {
    super();
    this.fields = [];
  }

  /** DB1-1: Set ID (SI) - Sequence number of this segment */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** DB1-2: Disabled Person Code (IS) - e.g. PT=Patient, GT=Guarantor, IN=Insured, AP=Authorized Person */
  disabledPersonCode(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** DB1-3: Disabled Person Identifier (CX) - Identifier of the disabled person */
  disabledPersonIdentifier(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** DB1-4: Disability Indicator (ID) - e.g. Y/N */
  disabilityIndicator(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** DB1-5: Disability Start Date (DT) */
  disabilityStartDate(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** DB1-6: Disability End Date (DT) */
  disabilityEndDate(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** DB1-7: Disability Return to Work Date (DT) */
  disabilityReturnToWorkDate(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** DB1-8: Disability Unable to Work Date (DT) */
  disabilityUnableToWorkDate(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }

  static parse(segmentString: string, encoding: EncodingCharacters): Result<DB1> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "DB1") {
      return { ok: false, err: new Err(`Expected DB1 segment, got ${parts[0]}`) };
    }
    const seg = new DB1();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
