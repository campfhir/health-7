/**
 * Builder for ADT^A01 messages (HL7 v2.5.1).
 *
 * @module
 */
import type { MSH as MSH_base } from "../../segments/v2.3/MSH.ts";
import type { EVN as EVN_base } from "../../segments/v2.3/EVN.ts";
import type { PID as PID_base } from "../../segments/v2.3/PID.ts";
import type { PD1 as PD1_base } from "../../segments/v2.3/PD1.ts";
import type { ROL as ROL_base } from "../../segments/v2.3/ROL.ts";
import type { NK1 as NK1_base } from "../../segments/v2.3/NK1.ts";
import type { PV1 as PV1_base } from "../../segments/v2.3/PV1.ts";
import type { PV2 as PV2_base } from "../../segments/v2.3/PV2.ts";
import type { DB1 as DB1_base } from "../../segments/v2.3/DB1.ts";
import type { OBX as OBX_base } from "../../segments/v2.3/OBX.ts";
import type { AL1 as AL1_base } from "../../segments/v2.3/AL1.ts";
import type { DG1 as DG1_base } from "../../segments/v2.3/DG1.ts";
import type { DRG as DRG_base } from "../../segments/v2.3/DRG.ts";
import type { PR1 as PR1_base } from "../../segments/v2.3/PR1.ts";
import type { GT1 as GT1_base } from "../../segments/v2.3/GT1.ts";
import type { IN1 as IN1_base } from "../../segments/v2.3/IN1.ts";
import type { IN2 as IN2_base } from "../../segments/v2.3/IN2.ts";
import type { IN3 as IN3_base } from "../../segments/v2.3/IN3.ts";
import type { ACC as ACC_base } from "../../segments/v2.3/ACC.ts";
import type { UB1 as UB1_base } from "../../segments/v2.3/UB1.ts";
import type { UB2 as UB2_base } from "../../segments/v2.3/UB2.ts";

import type { MSH } from "../../segments/v2.5.1/MSH.ts";
import type { EVN } from "../../segments/v2.5.1/EVN.ts";
import type { PID } from "../../segments/v2.5.1/PID.ts";
import type { PD1 } from "../../segments/v2.5.1/PD1.ts";
import type { ROL } from "../../segments/v2.5.1/ROL.ts";
import type { NK1 } from "../../segments/v2.5.1/NK1.ts";
import type { PV1 } from "../../segments/v2.5.1/PV1.ts";
import type { PV2 } from "../../segments/v2.5.1/PV2.ts";
import type { DB1 } from "../../segments/v2.5.1/DB1.ts";
import type { OBX } from "../../segments/v2.5.1/OBX.ts";
import type { AL1 } from "../../segments/v2.5.1/AL1.ts";
import type { DG1 } from "../../segments/v2.5.1/DG1.ts";
import type { DRG } from "../../segments/v2.5.1/DRG.ts";
import type { PR1 } from "../../segments/v2.5.1/PR1.ts";
import type { GT1 } from "../../segments/v2.5.1/GT1.ts";
import type { IN1 } from "../../segments/v2.5.1/IN1.ts";
import type { IN2 } from "../../segments/v2.5.1/IN2.ts";
import type { IN3 } from "../../segments/v2.5.1/IN3.ts";
import type { ACC } from "../../segments/v2.5.1/ACC.ts";
import type { UB1 } from "../../segments/v2.5.1/UB1.ts";
import type { UB2 } from "../../segments/v2.5.1/UB2.ts";
import { type EncodingCharacters, DEFAULT_ENCODING } from "../../types/encoding.ts";

/** ProcedureGroup — a data structure used to build an HL7 ADT^A01 (v2.5.1) message. */
export interface ProcedureGroup<
  TPR1 extends PR1_base = PR1,
  TROL extends ROL_base = ROL,
> {
  /** The pr1 value. */
  pr1: TPR1;
  /** The rol list value. */
  rolList?: TROL[];
}

/** InsuranceGroup — a data structure used to build an HL7 ADT^A01 (v2.5.1) message. */
export interface InsuranceGroup<
  TIN1 extends IN1_base = IN1,
  TIN2 extends IN2_base = IN2,
  TIN3 extends IN3_base = IN3,
> {
  /** The in1 value. */
  in1: TIN1;
  /** The in2 value. */
  in2?: TIN2;
  /** The in3 list value. */
  in3List?: TIN3[];
}

/** Builder for HL7 ADT^A01 (v2.5.1) messages. */
export class ADT_A01<
  TMSH extends MSH_base = MSH,
  TEVN extends EVN_base = EVN,
  TPID extends PID_base = PID,
  TPD1 extends PD1_base = PD1,
  TROL extends ROL_base = ROL,
  TNK1 extends NK1_base = NK1,
  TPV1 extends PV1_base = PV1,
  TPV2 extends PV2_base = PV2,
  TDB1 extends DB1_base = DB1,
  TOBX extends OBX_base = OBX,
  TAL1 extends AL1_base = AL1,
  TDG1 extends DG1_base = DG1,
  TDRG extends DRG_base = DRG,
  TPR1 extends PR1_base = PR1,
  TGT1 extends GT1_base = GT1,
  TIN1 extends IN1_base = IN1,
  TIN2 extends IN2_base = IN2,
  TIN3 extends IN3_base = IN3,
  TACC extends ACC_base = ACC,
  TUB1 extends UB1_base = UB1,
  TUB2 extends UB2_base = UB2,
> {
  /** Constructor. */
  constructor(
    public msh: TMSH,
    public evn: TEVN,
    public pid: TPID,
    public pv1: TPV1,
    public options: {
      pd1?: TPD1;
      rolList?: TROL[];
      nk1List?: TNK1[];
      pv2?: TPV2;
      db1List?: TDB1[];
      obxList?: TOBX[];
      al1List?: TAL1[];
      dg1List?: TDG1[];
      drg?: TDRG;
      procedures?: ProcedureGroup<TPR1, TROL>[];
      gt1List?: TGT1[];
      insuranceGroups?: InsuranceGroup<TIN1, TIN2, TIN3>[];
      acc?: TACC;
      ub1?: TUB1;
      ub2?: TUB2;
    } = {},
    private encoding: EncodingCharacters = DEFAULT_ENCODING,
  ) {}

  /** Validates the message structure, returning a result. */
  verify(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.msh) errors.push("MSH segment is required");
    if (!this.evn) errors.push("EVN segment is required");
    if (!this.pid) errors.push("PID segment is required");
    if (!this.pv1) errors.push("PV1 segment is required");

    return { valid: errors.length === 0, errors };
  }

  /** Encodes this message to its HL7 wire string. */
  encode(): string {
    const verification = this.verify();
    if (!verification.valid) {
      throw new Error(
        `Cannot encode invalid ADT_A01 message:\n${verification.errors.join("\n")}`,
      );
    }

    const segments: string[] = [];
    const { options: o, encoding: enc } = this;

    segments.push(this.msh.encode(enc));
    segments.push(this.evn.encode(enc));
    segments.push(this.pid.encode(enc));

    if (o.pd1) segments.push(o.pd1.encode(enc));
    if (o.rolList) o.rolList.forEach((r) => segments.push(r.encode(enc)));
    if (o.nk1List) o.nk1List.forEach((n) => segments.push(n.encode(enc)));

    segments.push(this.pv1.encode(enc));

    if (o.pv2) segments.push(o.pv2.encode(enc));
    if (o.db1List) o.db1List.forEach((d) => segments.push(d.encode(enc)));
    if (o.obxList) o.obxList.forEach((x) => segments.push(x.encode(enc)));
    if (o.al1List) o.al1List.forEach((a) => segments.push(a.encode(enc)));
    if (o.dg1List) o.dg1List.forEach((d) => segments.push(d.encode(enc)));
    if (o.drg) segments.push(o.drg.encode(enc));

    if (o.procedures) {
      for (const proc of o.procedures) {
        segments.push(proc.pr1.encode(enc));
        if (proc.rolList) proc.rolList.forEach((r) => segments.push(r.encode(enc)));
      }
    }

    if (o.gt1List) o.gt1List.forEach((g) => segments.push(g.encode(enc)));

    if (o.insuranceGroups) {
      for (const ins of o.insuranceGroups) {
        segments.push(ins.in1.encode(enc));
        if (ins.in2) segments.push(ins.in2.encode(enc));
        if (ins.in3List) ins.in3List.forEach((i3) => segments.push(i3.encode(enc)));
      }
    }

    if (o.acc) segments.push(o.acc.encode(enc));
    if (o.ub1) segments.push(o.ub1.encode(enc));
    if (o.ub2) segments.push(o.ub2.encode(enc));

    return segments.join("\r");
  }
}

/** Builds an HL7 ADT^A01 (v2.5.1) message. */
export function createADT_A01<
  TMSH extends MSH_base = MSH,
  TEVN extends EVN_base = EVN,
  TPID extends PID_base = PID,
  TPD1 extends PD1_base = PD1,
  TROL extends ROL_base = ROL,
  TNK1 extends NK1_base = NK1,
  TPV1 extends PV1_base = PV1,
  TPV2 extends PV2_base = PV2,
  TDB1 extends DB1_base = DB1,
  TOBX extends OBX_base = OBX,
  TAL1 extends AL1_base = AL1,
  TDG1 extends DG1_base = DG1,
  TDRG extends DRG_base = DRG,
  TPR1 extends PR1_base = PR1,
  TGT1 extends GT1_base = GT1,
  TIN1 extends IN1_base = IN1,
  TIN2 extends IN2_base = IN2,
  TIN3 extends IN3_base = IN3,
  TACC extends ACC_base = ACC,
  TUB1 extends UB1_base = UB1,
  TUB2 extends UB2_base = UB2,
>(
  msh: TMSH,
  evn: TEVN,
  pid: TPID,
  pv1: TPV1,
  options: ADT_A01<TMSH, TEVN, TPID, TPD1, TROL, TNK1, TPV1, TPV2, TDB1, TOBX, TAL1, TDG1, TDRG, TPR1, TGT1, TIN1, TIN2, TIN3, TACC, TUB1, TUB2>["options"] = {},
): ADT_A01<TMSH, TEVN, TPID, TPD1, TROL, TNK1, TPV1, TPV2, TDB1, TOBX, TAL1, TDG1, TDRG, TPR1, TGT1, TIN1, TIN2, TIN3, TACC, TUB1, TUB2> {
  return new ADT_A01(msh, evn, pid, pv1, options);
}
