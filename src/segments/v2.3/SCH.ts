import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";

/**
 * SCH - Scheduling Activity Information Segment (HL7 v2.3)
 */
export class SCH extends BaseSegment {
  name = "SCH";

  constructor() {
    super();
    this.fields = [];
  }

  /** SCH-1: Placer Appointment ID (EI) */
  placerAppointmentId(entityId: string, namespaceId?: string): this {
    this.fields[0] = this.createField([[entityId, namespaceId || ""]]);
    return this;
  }

  /** SCH-2: Filler Appointment ID (EI) */
  fillerAppointmentId(entityId: string, namespaceId?: string): this {
    this.fields[1] = this.createField([[entityId, namespaceId || ""]]);
    return this;
  }

  /** SCH-3: Occurrence Number (NM) */
  occurrenceNumber(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** SCH-5: Schedule ID (CE) */
  scheduleId(code: string, text?: string): this {
    if (text) {
      this.fields[4] = this.createField([[code, text]]);
    } else {
      this.fields[4] = this.createField(code);
    }
    return this;
  }

  /** SCH-6: Event Reason (CE, required) */
  eventReason(code: string, text?: string, codingSystem?: string): this {
    if (text || codingSystem) {
      this.fields[5] = this.createField([[code, text || "", codingSystem || ""]]);
    } else {
      this.fields[5] = this.createField(code);
    }
    return this;
  }

  /** SCH-7: Appointment Reason (CE) */
  appointmentReason(code: string, text?: string, codingSystem?: string): this {
    if (text || codingSystem) {
      this.fields[6] = this.createField([[code, text || "", codingSystem || ""]]);
    } else {
      this.fields[6] = this.createField(code);
    }
    return this;
  }

  /** SCH-8: Appointment Type (CE) */
  appointmentType(code: string, text?: string): this {
    if (text) {
      this.fields[7] = this.createField([[code, text]]);
    } else {
      this.fields[7] = this.createField(code);
    }
    return this;
  }

  /** SCH-9: Appointment Duration (NM) */
  appointmentDuration(value: string): this {
    this.fields[8] = this.createField(value);
    return this;
  }

  /** SCH-10: Appointment Duration Units (CE) */
  appointmentDurationUnits(code: string, text?: string): this {
    if (text) {
      this.fields[9] = this.createField([[code, text]]);
    } else {
      this.fields[9] = this.createField(code);
    }
    return this;
  }

  /** SCH-11: Appointment Timing Quantity (TQ) */
  appointmentTimingQuantity(value: string): this {
    this.fields[10] = this.createField(value);
    return this;
  }

  /** SCH-12: Placer Contact Person (XCN) */
  placerContactPerson(id: string, familyName?: string, givenName?: string): this {
    if (familyName || givenName) {
      this.fields[11] = this.createField([[id, familyName || "", givenName || ""]]);
    } else {
      this.fields[11] = this.createField(id);
    }
    return this;
  }

  /** SCH-16: Filler Contact Person (XCN) */
  fillerContactPerson(id: string, familyName?: string, givenName?: string): this {
    if (familyName || givenName) {
      this.fields[15] = this.createField([[id, familyName || "", givenName || ""]]);
    } else {
      this.fields[15] = this.createField(id);
    }
    return this;
  }

  /** SCH-20: Entered By Person (XCN) */
  enteredByPerson(id: string, familyName?: string, givenName?: string): this {
    if (familyName || givenName) {
      this.fields[19] = this.createField([[id, familyName || "", givenName || ""]]);
    } else {
      this.fields[19] = this.createField(id);
    }
    return this;
  }

  /** SCH-25: Filler Status Code (CE) */
  fillerStatusCode(code: string, text?: string): this {
    if (text) {
      this.fields[24] = this.createField([[code, text]]);
    } else {
      this.fields[24] = this.createField(code);
    }
    return this;
  }

  static parse(segmentString: string, encoding: EncodingCharacters): Result<SCH> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "SCH") {
      return { ok: false, err: new Err(`Expected SCH segment, got ${parts[0]}`) };
    }
    const seg = new SCH();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
