/**
 * Builder for VXU^V04 messages (HL7 v2.3): unsolicited vaccination record update.
 *
 * Structure:
 *   MSH PID [PD1] [{NK1}] [ PV1 [PV2] ] [{ IN1 [IN2] [IN3] }]
 *   [{ [ORC] RXA [RXR] {[ OBX [{NTE}] ]} }]
 *
 * v2.4 adds `[{GT1}]` between the visit and the insurance groups; `gt1List` is only accepted
 * when a subclass sets `allowGT1` (the v2.4 builder does).
 *
 * @module
 */
import type { MSH } from "../../segments/v2.3/MSH.ts";
import type { PID } from "../../segments/v2.3/PID.ts";
import type { PD1 } from "../../segments/v2.3/PD1.ts";
import type { NK1 } from "../../segments/v2.3/NK1.ts";
import type { PV1 } from "../../segments/v2.3/PV1.ts";
import type { PV2 } from "../../segments/v2.3/PV2.ts";
import type { GT1 } from "../../segments/v2.3/GT1.ts";
import type { IN1 } from "../../segments/v2.3/IN1.ts";
import type { IN2 } from "../../segments/v2.3/IN2.ts";
import type { IN3 } from "../../segments/v2.3/IN3.ts";
import type { ORC } from "../../segments/v2.3/ORC.ts";
import type { RXA } from "../../segments/v2.3/RXA.ts";
import type { RXR } from "../../segments/v2.3/RXR.ts";
import type { OBX } from "../../segments/v2.3/OBX.ts";
import type { NTE } from "../../segments/v2.3/NTE.ts";
import { type EncodingCharacters, DEFAULT_ENCODING } from "../../types/encoding.ts";

/** An OBX with the NTE segments that follow it. */
export interface ObservationGroup<TObx extends OBX = OBX> {
  /** The obx value. */
  obx: TObx;
  /** The notes value. */
  notes?: NTE[];
}

/** A repeating vaccination group: [ORC] RXA [RXR] and its observations. */
export interface VaccinationGroup<TRxa extends RXA = RXA> {
  /** The orc value (optional in v2.3 and v2.4). */
  orc?: ORC;
  /** The rxa value. */
  rxa: TRxa;
  /** The rxr value. */
  rxr?: RXR;
  /** The observations value. */
  observations?: ObservationGroup[];
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

/** Builder for HL7 VXU^V04 (v2.3) messages. */
export class VXU_V04<
  TMsh extends MSH = MSH,
  TPid extends PID = PID,
  TRxa extends RXA = RXA,
> {
  /** Whether GT1 is part of the structure: false in v2.3, true from v2.4. */
  protected readonly allowGT1: boolean = false;

  /** Constructor. */
  constructor(
    public msh: TMsh,
    public pid: TPid,
    public options: {
      /** The pd1 value. */
      pd1?: PD1;
      /** The NK1 segments. */
      nk1List?: NK1[];
      /** The PV1 and optional PV2. */
      visit?: { pv1: PV1; pv2?: PV2 };
      /** The guarantor segments (v2.4 and later). */
      gt1List?: GT1[];
      /** The insurance value. */
      insurance?: InsuranceGroup[];
      /** The vaccination groups. */
      orders?: VaccinationGroup<TRxa>[];
    } = {},
    private encoding: EncodingCharacters = DEFAULT_ENCODING,
  ) {}

  /** Validates the message structure, returning a result. */
  verify(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const o = this.options;

    if (!this.msh) errors.push("MSH segment is required");
    if (!this.pid) errors.push("PID segment is required");
    if (o.visit && !o.visit.pv1) errors.push("PV1 segment is required when a visit is present");
    if (o.gt1List?.length && !this.allowGT1) {
      errors.push("GT1 segments are not part of VXU^V04 in this version");
    }
    (o.insurance ?? []).forEach((ins, i) => {
      if (!ins.in1) errors.push(`Insurance group ${i + 1}: IN1 segment is required`);
    });
    (o.orders ?? []).forEach((order, i) => {
      if (!order.rxa) errors.push(`Order ${i + 1}: RXA segment is required`);
      (order.observations ?? []).forEach((obs, j) => {
        if (!obs.obx) errors.push(`Order ${i + 1}, observation ${j + 1}: OBX segment is required`);
      });
    });

    return { valid: errors.length === 0, errors };
  }

  /** Encodes this message to its HL7 wire string. */
  encode(): string {
    const verification = this.verify();
    if (!verification.valid) {
      throw new Error(
        `Cannot encode invalid VXU_V04 message:\n${verification.errors.join("\n")}`,
      );
    }

    const enc = this.encoding;
    const o = this.options;
    const segments: string[] = [];
    const add = (seg: { encode(e?: EncodingCharacters): string }) => segments.push(seg.encode(enc));

    add(this.msh);
    add(this.pid);
    if (o.pd1) add(o.pd1);
    o.nk1List?.forEach(add);
    if (o.visit) {
      add(o.visit.pv1);
      if (o.visit.pv2) add(o.visit.pv2);
    }
    o.gt1List?.forEach(add);
    for (const ins of o.insurance ?? []) {
      add(ins.in1);
      if (ins.in2) add(ins.in2);
      if (ins.in3) add(ins.in3);
    }
    for (const order of o.orders ?? []) {
      if (order.orc) add(order.orc);
      add(order.rxa);
      if (order.rxr) add(order.rxr);
      for (const obs of order.observations ?? []) {
        add(obs.obx);
        obs.notes?.forEach(add);
      }
    }

    return segments.join("\r");
  }
}

/** Builds an HL7 VXU^V04 (v2.3) message. */
export function createVXU_V04<
  TMsh extends MSH = MSH,
  TPid extends PID = PID,
  TRxa extends RXA = RXA,
>(
  msh: TMsh,
  pid: TPid,
  options: VXU_V04<TMsh, TPid, TRxa>["options"] = {},
): VXU_V04<TMsh, TPid, TRxa> {
  return new VXU_V04(msh, pid, options);
}
