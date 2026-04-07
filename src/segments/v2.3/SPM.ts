import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { BaseSegment } from "../../types/segment";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";

/**
 * SPM - Specimen Segment (HL7 v2.3)
 */
export class SPM extends BaseSegment {
  name = "SPM";

  constructor() {
    super();
    this.fields = [];
  }

  /** SPM-1: Set ID (SI) */
  setId(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** SPM-2: Specimen ID (EIP) */
  specimenId(placerAssignedId: string, fillerAssignedId?: string): this {
    this.fields[1] = this.createField([[placerAssignedId, fillerAssignedId || ""]]);
    return this;
  }

  /** SPM-3: Specimen Parent IDs (EIP) */
  specimenParentIds(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** SPM-4: Specimen Type (CWE, required) e.g. BLD=Blood, SER=Serum, URN=Urine, CSF=Cerebrospinal fluid */
  specimenType(code: string, text?: string, codingSystem?: string): this {
    this.fields[3] = this.createField([[code, text || "", codingSystem || ""]]);
    return this;
  }

  /** SPM-5: Specimen Type Modifier (CWE) */
  specimenTypeModifier(code: string, text?: string): this {
    this.fields[4] = this.createField([[code, text || ""]]);
    return this;
  }

  /** SPM-6: Specimen Additives (CWE) */
  specimenAdditives(code: string, text?: string): this {
    this.fields[5] = this.createField([[code, text || ""]]);
    return this;
  }

  /** SPM-7: Specimen Collection Method (CWE) */
  specimenCollectionMethod(code: string, text?: string): this {
    this.fields[6] = this.createField([[code, text || ""]]);
    return this;
  }

  /** SPM-8: Specimen Source Site (CWE) */
  specimenSourceSite(code: string, text?: string, codingSystem?: string): this {
    this.fields[7] = this.createField([[code, text || "", codingSystem || ""]]);
    return this;
  }

  /** SPM-9: Specimen Source Site Modifier (CWE) */
  specimenSourceSiteModifier(code: string, text?: string): this {
    this.fields[8] = this.createField([[code, text || ""]]);
    return this;
  }

  /** SPM-10: Specimen Collection Site (CWE) */
  specimenCollectionSite(code: string, text?: string): this {
    this.fields[9] = this.createField([[code, text || ""]]);
    return this;
  }

  /** SPM-11: Specimen Role (CWE) */
  specimenRole(code: string, text?: string): this {
    this.fields[10] = this.createField([[code, text || ""]]);
    return this;
  }

  /** SPM-12: Specimen Collection Amount (CQ) */
  specimenCollectionAmount(value: string, units?: string): this {
    this.fields[11] = this.createField([[value, units || ""]]);
    return this;
  }

  /** SPM-13: Grouped Specimen Count (NM) */
  groupedSpecimenCount(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }

  /** SPM-14: Specimen Description (ST) */
  specimenDescription(value: string): this {
    this.fields[13] = this.createField(value);
    return this;
  }

  /** SPM-17: Specimen Collection Date/Time (DR) */
  specimenCollectionDateTime(rangeStart: string, rangeEnd?: string): this {
    this.fields[16] = this.createField([[rangeStart, rangeEnd || ""]]);
    return this;
  }

  /** SPM-18: Specimen Received Date/Time (TS) */
  specimenReceivedDateTime(value: string): this {
    this.fields[17] = this.createField(value);
    return this;
  }

  /** SPM-20: Specimen Availability (ID) e.g. Y/N */
  specimenAvailability(value: string): this {
    this.fields[19] = this.createField(value);
    return this;
  }

  /** SPM-24: Specimen Current Quantity (CQ) */
  specimenCurrentQuantity(value: string, units?: string): this {
    this.fields[23] = this.createField([[value, units || ""]]);
    return this;
  }

  /** SPM-27: Specimen Condition (CWE) */
  specimenCondition(code: string, text?: string): this {
    this.fields[26] = this.createField([[code, text || ""]]);
    return this;
  }

  /** SPM-32: Specimen Reject Reason (CWE) */
  specimenRejectReason(code: string, text?: string): this {
    this.fields[31] = this.createField([[code, text || ""]]);
    return this;
  }

  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<SPM> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "SPM") {
      return {
        ok: false,
        err: new Err(`Expected SPM segment, got ${parts[0]}`),
      };
    }
    const seg = new SPM();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
