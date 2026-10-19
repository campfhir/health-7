/**
 * Builder for VXU^V04 messages (HL7 v2.5): unsolicited vaccination record update.
 *
 * Structure (HL7 v2.5):
 *   MSH [{SFT}] PID [PD1] [{NK1}] [ PV1 [PV2] ] [{GT1}] [{ IN1 [IN2] [IN3] }]
 *   [{ ORC [{ TQ1 [{TQ2}] }] RXA [RXR] [{ OBX [{NTE}] }] }]
 *
 * Compared with v2.4: SFT is new, ORC is required in each vaccination group, and the
 * ORC is followed by an optional repeating timing group (TQ1 with its TQ2 segments).
 *
 * @module
 */
import type { MSH } from "../../segments/v2.5/MSH.ts";
import type { SFT } from "../../segments/v2.5/SFT.ts";
import type { PID } from "../../segments/v2.5/PID.ts";
import type { PD1 } from "../../segments/v2.5/PD1.ts";
import type { NK1 } from "../../segments/v2.5/NK1.ts";
import type { PV1 } from "../../segments/v2.5/PV1.ts";
import type { PV2 } from "../../segments/v2.5/PV2.ts";
import type { GT1 } from "../../segments/v2.5/GT1.ts";
import type { IN1 } from "../../segments/v2.5/IN1.ts";
import type { IN2 } from "../../segments/v2.5/IN2.ts";
import type { IN3 } from "../../segments/v2.5/IN3.ts";
import type { ORC } from "../../segments/v2.5/ORC.ts";
import type { TQ1 } from "../../segments/v2.5/TQ1.ts";
import type { TQ2 } from "../../segments/v2.5/TQ2.ts";
import type { RXA } from "../../segments/v2.5/RXA.ts";
import type { RXR } from "../../segments/v2.5/RXR.ts";
import type { OBX } from "../../segments/v2.5/OBX.ts";
import type { NTE } from "../../segments/v2.5/NTE.ts";
import { type EncodingCharacters, DEFAULT_ENCODING } from "../../types/encoding.ts";

/** An OBX with the NTE segments that follow it. */
export interface ObservationGroup<TObx extends OBX = OBX> {
  /** The obx value. */
  obx: TObx;
  /** The notes value. */
  notes?: NTE[];
}

/** A repeating timing group: TQ1 with its TQ2 segments. */
export interface TimingGroup {
  /** The tq1 value. */
  tq1: TQ1;
  /** The TQ2 segments. */
  tq2List?: TQ2[];
}

/** A repeating vaccination group: ORC [timing] RXA [RXR] and its observations. */
export interface VaccinationGroup<TRxa extends RXA = RXA> {
  /** The orc value, required in v2.5. */
  orc: ORC;
  /** The timing groups. */
  timing?: TimingGroup[];
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
  /** Constructor. */
  constructor(
    public msh: TMsh,
    public pid: TPid,
    public options: {
      /** SFT segments, encoded between MSH and PID. */
      sftList?: SFT[];
      /** The pd1 value. */
      pd1?: PD1;
      /** The NK1 segments. */
      nk1List?: NK1[];
      /** The PV1 and optional PV2. */
      visit?: { pv1: PV1; pv2?: PV2 };
      /** The guarantor segments. */
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
    (o.insurance ?? []).forEach((ins, i) => {
      if (!ins.in1) errors.push(`Insurance group ${i + 1}: IN1 segment is required`);
    });
    (o.orders ?? []).forEach((order, i) => {
      if (!order.orc) errors.push(`Order ${i + 1}: ORC segment is required`);
      if (!order.rxa) errors.push(`Order ${i + 1}: RXA segment is required`);
      (order.timing ?? []).forEach((t, j) => {
        if (!t.tq1) errors.push(`Order ${i + 1}, timing ${j + 1}: TQ1 segment is required`);
      });
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
    o.sftList?.forEach(add);
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
      add(order.orc);
      for (const t of order.timing ?? []) {
        add(t.tq1);
        t.tq2List?.forEach(add);
      }
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
