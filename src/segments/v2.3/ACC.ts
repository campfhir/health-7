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
 * ACC - Accident Segment (HL7 v2.3)
 * Contains information about an accident that caused the patient's injury.
 */
export class ACC extends BaseSegment {
  name = "ACC";

  constructor() {
    super();
    this.fields = [];
  }

  /** ACC-1: Accident Date/Time (TS) */
  accidentDateTime(value: string, format?: never): this;
  accidentDateTime(value: Date, format?: HL7DateTimeLayout): this;
  accidentDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[0] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** ACC-2: Accident Code (CE) - Coded value describing the accident */
  accidentCode(code: string, text?: string, codingSystem?: string): this {
    this.fields[1] = this.createField([code, text || "", codingSystem || ""]);
    return this;
  }

  /** ACC-3: Accident Location (ST) - Where the accident occurred */
  accidentLocation(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** ACC-4: Auto Accident State (CE) - State in which an auto accident occurred */
  autoAccidentState(code: string, text?: string): this {
    this.fields[3] = this.createField([code, text || ""]);
    return this;
  }

  /** ACC-5: Accident Job Related Indicator (ID) - e.g. Y/N */
  accidentJobRelated(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** ACC-6: Accident Death Indicator (ID) - e.g. Y/N */
  accidentDeath(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** ACC-7: Entered By (XCN) - Person who entered the accident information */
  enteredBy(id: string, familyName?: string, givenName?: string): this {
    this.fields[6] = this.createField([id, familyName || "", givenName || ""]);
    return this;
  }

  /** ACC-8: Accident Description (ST) - Free-text description of the accident */
  accidentDescription(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }

  /** ACC-9: Brought In By (ST) - Person or organization that brought the patient in */
  broughtInBy(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /** ACC-10: Police Notified Indicator (ID) - e.g. Y/N */
  policeNotified(value: string): this {
    this.fields[9] = this.createField(value);
    return this;
  }

  /** ACC-11: Accident Address (XAD) - Address where the accident occurred */
  accidentAddress(
    street: string,
    city?: string,
    state?: string,
    zip?: string,
  ): this {
    this.fields[10] = this.createField([
      [street, "", city || "", state || "", zip || ""],
    ]);
    return this;
  }

  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<ACC> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "ACC") {
      return {
        ok: false,
        err: new Err(`Expected ACC segment, got ${parts[0]}`),
      };
    }
    const seg = new ACC();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
