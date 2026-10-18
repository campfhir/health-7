/**
 * Builder for ORM^O01 messages (HL7 v2.3).
 *
 * Structure:
 *   MSH [{NTE}]
 *   [ PID [PD1] [{NTE}] [ PV1 [PV2] ] [{ IN1 [IN2] [IN3] }] [GT1] [{AL1}] ]
 *   { ORC
 *     [ <OBR|RQD|RQ1|RXO|ODS|ODT> [{NTE}] [{DG1}] [{ OBX [{NTE}] }] ]
 *     [{CTI}] [BLG] }
 *
 * @module
 */
import type { MSH } from "../../segments/v2.3/MSH.ts";
import type { NTE } from "../../segments/v2.3/NTE.ts";
import type { PID } from "../../segments/v2.3/PID.ts";
import type { PD1 } from "../../segments/v2.3/PD1.ts";
import type { PV1 } from "../../segments/v2.3/PV1.ts";
import type { PV2 } from "../../segments/v2.3/PV2.ts";
import type { IN1 } from "../../segments/v2.3/IN1.ts";
import type { IN2 } from "../../segments/v2.3/IN2.ts";
import type { IN3 } from "../../segments/v2.3/IN3.ts";
import type { GT1 } from "../../segments/v2.3/GT1.ts";
import type { AL1 } from "../../segments/v2.3/AL1.ts";
import type { ORC } from "../../segments/v2.3/ORC.ts";
import type { OBR } from "../../segments/v2.3/OBR.ts";
import type { RQD } from "../../segments/v2.3/RQD.ts";
import type { RQ1 } from "../../segments/v2.3/RQ1.ts";
import type { RXO } from "../../segments/v2.3/RXO.ts";
import type { ODS } from "../../segments/v2.3/ODS.ts";
import type { ODT } from "../../segments/v2.3/ODT.ts";
import type { DG1 } from "../../segments/v2.3/DG1.ts";
import type { OBX } from "../../segments/v2.3/OBX.ts";
import type { CTI } from "../../segments/v2.3/CTI.ts";
import type { BLG } from "../../segments/v2.3/BLG.ts";
import { type EncodingCharacters, DEFAULT_ENCODING } from "../../types/encoding.ts";

/** The order detail segment of an order: one of OBR, RQD, RQ1, RXO, ODS or ODT. */
export type OrderDetailSegment = OBR | RQD | RQ1 | RXO | ODS | ODT;

/** An OBX with the NTE segments that follow it. */
export interface ObservationGroup<TObx extends OBX = OBX> {
  /** The obx value. */
  obx: TObx;
  /** The notes value. */
  notes?: NTE[];
}

/** The order detail segment with its notes, diagnoses and observations. */
export interface OrderDetailGroup<TDetail extends OrderDetailSegment = OrderDetailSegment> {
  /** The order detail segment. */
  segment: TDetail;
  /** The notes value. */
  notes?: NTE[];
  /** The diagnoses value. */
  diagnoses?: DG1[];
  /** The observations value. */
  observations?: ObservationGroup[];
}

/** A repeating ORC group. */
export interface OrderGroup<TOrc extends ORC = ORC> {
  /** The orc value. */
  orc: TOrc;
  /** The detail value. */
  detail?: OrderDetailGroup;
  /** The clinical trial identification segments. */
  ctiList?: CTI[];
  /** The blg value. */
  blg?: BLG;
}

/** An IN1 with its optional IN2 and IN3. */
export interface InsuranceGroup<TIn1 extends IN1 = IN1> {
  /** The in1 value. */
  in1: TIn1;
  /** The in2 value. */
  in2?: IN2;
  /** The in3 value. */
  in3?: IN3;
}

/** The optional patient group. */
export interface PatientGroup<TPid extends PID = PID> {
  /** The pid value. */
  pid: TPid;
  /** The pd1 value. */
  pd1?: PD1;
  /** The notes value. */
  notes?: NTE[];
  /** The PV1 and optional PV2. */
  visit?: { pv1: PV1; pv2?: PV2 };
  /** The insurance value. */
  insurance?: InsuranceGroup[];
  /** The gt1 value. */
  gt1?: GT1;
  /** The allergies value. */
  allergies?: AL1[];
}

/** Builder for HL7 ORM^O01 (v2.3) messages. */
export class ORM_O01<
  TMsh extends MSH = MSH,
  TPid extends PID = PID,
  TOrc extends ORC = ORC,
> {
  /** Constructor. */
  constructor(
    public msh: TMsh,
    public orders: OrderGroup<TOrc>[],
    public options: {
      /** NTE segments that follow MSH. */
      notes?: NTE[];
      /** The patient group; only needed when entering orders for a specific patient. */
      patient?: PatientGroup<TPid>;
    } = {},
    private encoding: EncodingCharacters = DEFAULT_ENCODING,
  ) {}

  /** Validates the message structure, returning a result. */
  verify(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.msh) errors.push("MSH segment is required");
    if (!this.orders || this.orders.length === 0) {
      errors.push("At least one order (ORC) is required");
    }

    const patient = this.options.patient;
    if (patient) {
      if (!patient.pid) errors.push("Patient group: PID segment is required");
      if (patient.visit && !patient.visit.pv1) {
        errors.push("Patient group: PV1 segment is required when a visit is present");
      }
      (patient.insurance ?? []).forEach((ins, i) => {
        if (!ins.in1) errors.push(`Insurance group ${i + 1}: IN1 segment is required`);
      });
    }

    (this.orders ?? []).forEach((order, i) => {
      if (!order.orc) errors.push(`Order ${i + 1}: ORC segment is required`);
      if (order.detail && !order.detail.segment) {
        errors.push(`Order ${i + 1}: order detail segment is required when a detail group is present`);
      }
      (order.detail?.observations ?? []).forEach((o, j) => {
        if (!o.obx) errors.push(`Order ${i + 1}, observation ${j + 1}: OBX segment is required`);
      });
    });

    return { valid: errors.length === 0, errors };
  }

  /** Encodes this message to its HL7 wire string. */
  encode(): string {
    const verification = this.verify();
    if (!verification.valid) {
      throw new Error(
        `Cannot encode invalid ORM_O01 message:\n${verification.errors.join("\n")}`,
      );
    }

    const enc = this.encoding;
    const segments: string[] = [this.msh.encode(enc)];
    const add = (seg: { encode(e?: EncodingCharacters): string }) => segments.push(seg.encode(enc));

    this.options.notes?.forEach(add);

    const patient = this.options.patient;
    if (patient) {
      add(patient.pid);
      if (patient.pd1) add(patient.pd1);
      patient.notes?.forEach(add);
      if (patient.visit) {
        add(patient.visit.pv1);
        if (patient.visit.pv2) add(patient.visit.pv2);
      }
      for (const ins of patient.insurance ?? []) {
        add(ins.in1);
        if (ins.in2) add(ins.in2);
        if (ins.in3) add(ins.in3);
      }
      if (patient.gt1) add(patient.gt1);
      patient.allergies?.forEach(add);
    }

    for (const order of this.orders) {
      add(order.orc);
      if (order.detail) {
        add(order.detail.segment);
        order.detail.notes?.forEach(add);
        order.detail.diagnoses?.forEach(add);
        for (const obs of order.detail.observations ?? []) {
          add(obs.obx);
          obs.notes?.forEach(add);
        }
      }
      order.ctiList?.forEach(add);
      if (order.blg) add(order.blg);
    }

    return segments.join("\r");
  }
}

/** Builds an HL7 ORM^O01 (v2.3) message. */
export function createORM_O01<
  TMsh extends MSH = MSH,
  TPid extends PID = PID,
  TOrc extends ORC = ORC,
>(
  msh: TMsh,
  orders: OrderGroup<TOrc>[],
  options: ORM_O01<TMsh, TPid, TOrc>["options"] = {},
): ORM_O01<TMsh, TPid, TOrc> {
  return new ORM_O01(msh, orders, options);
}
