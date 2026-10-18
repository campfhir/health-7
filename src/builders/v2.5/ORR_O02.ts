/**
 * Builder for ORR^O02 messages (HL7 v2.5).
 *
 * Structure (HL7 v2.5):
 *   MSH MSA [{ERR}] [{NTE}]
 *   [ [ PID [{NTE}] ] { ORC <OBR|RQD|RQ1|RXO|ODS|ODT> [{NTE}] [{CTI}] } ]
 *
 * Every order needs its detail segment, as in the specification; the patient is optional.
 *
 * @module
 */
import type { MSH } from "../../segments/v2.5/MSH.ts";
import type { MSA } from "../../segments/v2.5/MSA.ts";
import type { ERR } from "../../segments/v2.5/ERR.ts";
import type { NTE } from "../../segments/v2.5/NTE.ts";
import type { PID } from "../../segments/v2.5/PID.ts";
import type { ORC } from "../../segments/v2.5/ORC.ts";
import type { OBR } from "../../segments/v2.5/OBR.ts";
import type { RQD } from "../../segments/v2.5/RQD.ts";
import type { RQ1 } from "../../segments/v2.5/RQ1.ts";
import type { RXO } from "../../segments/v2.5/RXO.ts";
import type { ODS } from "../../segments/v2.5/ODS.ts";
import type { ODT } from "../../segments/v2.5/ODT.ts";
import type { CTI } from "../../segments/v2.5/CTI.ts";
import { type EncodingCharacters, DEFAULT_ENCODING } from "../../types/encoding.ts";

/** The order detail segment of an order: one of OBR, RQD, RQ1, RXO, ODS or ODT. */
export type ResponseDetailSegment = OBR | RQD | RQ1 | RXO | ODS | ODT;

/** The order detail segment with its notes and clinical trial identification segments. */
export interface ResponseDetailGroup {
  /** The order detail segment. */
  segment: ResponseDetailSegment;
  /** The notes value. */
  notes?: NTE[];
  /** The clinical trial identification segments. */
  ctiList?: CTI[];
}

/** A repeating ORC group. */
export interface ResponseOrderGroup<TOrc extends ORC = ORC> {
  /** The orc value. */
  orc: TOrc;
  /** The order detail group; required in each order. */
  detail: ResponseDetailGroup;
}

/** The PID segment and the notes that follow it. */
export interface ResponsePatientGroup<TPid extends PID = PID> {
  /** The pid value. */
  pid: TPid;
  /** The notes value. */
  notes?: NTE[];
}

/** Builder for HL7 ORR^O02 (v2.5) messages. */
export class ORR_O02<
  TMsh extends MSH = MSH,
  TMsa extends MSA = MSA,
  TPid extends PID = PID,
  TOrc extends ORC = ORC,
> {
  /** Constructor. */
  constructor(
    public msh: TMsh,
    public msa: TMsa,
    public options: {
      /** The ERR segments. */
      errList?: ERR[];
      /** NTE segments that follow MSA/ERR. */
      notes?: NTE[];
      /** The PID segment with its notes. */
      patient?: ResponsePatientGroup<TPid>;
      /** The ORC groups. */
      orders?: ResponseOrderGroup<TOrc>[];
    } = {},
    private encoding: EncodingCharacters = DEFAULT_ENCODING,
  ) {}

  /** Validates the message structure, returning a result. */
  verify(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.msh) errors.push("MSH segment is required");
    if (!this.msa) errors.push("MSA segment is required");
    if (this.options.patient && !this.options.patient.pid) {
      errors.push("Patient group: PID segment is required");
    }
    (this.options.orders ?? []).forEach((order, i) => {
      if (!order.orc) errors.push(`Order ${i + 1}: ORC segment is required`);
      if (!order.detail?.segment) {
        errors.push(`Order ${i + 1}: order detail segment (OBR, RQD, RQ1, RXO, ODS or ODT) is required`);
      }
    });

    return { valid: errors.length === 0, errors };
  }

  /** Encodes this message to its HL7 wire string. */
  encode(): string {
    const verification = this.verify();
    if (!verification.valid) {
      throw new Error(
        `Cannot encode invalid ORR_O02 message:\n${verification.errors.join("\n")}`,
      );
    }

    const enc = this.encoding;
    const segments: string[] = [];
    const add = (seg: { encode(e?: EncodingCharacters): string }) => segments.push(seg.encode(enc));

    add(this.msh);
    add(this.msa);
    this.options.errList?.forEach(add);
    this.options.notes?.forEach(add);

    if (this.options.patient) {
      add(this.options.patient.pid);
      this.options.patient.notes?.forEach(add);
    }

    for (const order of this.options.orders ?? []) {
      add(order.orc);
      add(order.detail.segment);
      order.detail.notes?.forEach(add);
      order.detail.ctiList?.forEach(add);
    }

    return segments.join("\r");
  }
}

/** Builds an HL7 ORR^O02 (v2.5) message. */
export function createORR_O02<
  TMsh extends MSH = MSH,
  TMsa extends MSA = MSA,
  TPid extends PID = PID,
  TOrc extends ORC = ORC,
>(
  msh: TMsh,
  msa: TMsa,
  options: ORR_O02<TMsh, TMsa, TPid, TOrc>["options"] = {},
): ORR_O02<TMsh, TMsa, TPid, TOrc> {
  return new ORR_O02(msh, msa, options);
}
