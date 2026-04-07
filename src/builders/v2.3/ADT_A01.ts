import { MSH } from "../../segments/v2.3/MSH";
import { EVN } from "../../segments/v2.3/EVN";
import { PID } from "../../segments/v2.3/PID";
import { PD1 } from "../../segments/v2.3/PD1";
import { ROL } from "../../segments/v2.3/ROL";
import { NK1 } from "../../segments/v2.3/NK1";
import { PV1 } from "../../segments/v2.3/PV1";
import { PV2 } from "../../segments/v2.3/PV2";
import { DB1 } from "../../segments/v2.3/DB1";
import { OBX } from "../../segments/v2.3/OBX";
import { AL1 } from "../../segments/v2.3/AL1";
import { DG1 } from "../../segments/v2.3/DG1";
import { DRG } from "../../segments/v2.3/DRG";
import { PR1 } from "../../segments/v2.3/PR1";
import { GT1 } from "../../segments/v2.3/GT1";
import { IN1 } from "../../segments/v2.3/IN1";
import { IN2 } from "../../segments/v2.3/IN2";
import { IN3 } from "../../segments/v2.3/IN3";
import { ACC } from "../../segments/v2.3/ACC";
import { UB1 } from "../../segments/v2.3/UB1";
import { UB2 } from "../../segments/v2.3/UB2";
import { EncodingCharacters, DEFAULT_ENCODING } from "../../types/encoding";

export interface ProcedureGroup<TPR1 extends PR1 = PR1> {
  pr1: TPR1;
  rolList?: ROL[];
}

export interface InsuranceGroup<TIN1 extends IN1 = IN1> {
  in1: TIN1;
  in2?: IN2;
  in3List?: IN3[];
}

export class ADT_A01<
  TMSH extends MSH = MSH,
  TEVN extends EVN = EVN,
  TPID extends PID = PID,
  TPV1 extends PV1 = PV1,
  TPR1 extends PR1 = PR1,
  TIN1 extends IN1 = IN1,
> {
  constructor(
    public msh: TMSH,
    public evn: TEVN,
    public pid: TPID,
    public pv1: TPV1,
    public options: {
      pd1?: PD1;
      rolList?: ROL[];
      nk1List?: NK1[];
      pv2?: PV2;
      db1List?: DB1[];
      obxList?: OBX[];
      al1List?: AL1[];
      dg1List?: DG1[];
      drg?: DRG;
      procedures?: ProcedureGroup<TPR1>[];
      gt1List?: GT1[];
      insuranceGroups?: InsuranceGroup<TIN1>[];
      acc?: ACC;
      ub1?: UB1;
      ub2?: UB2;
    } = {},
    private encoding: EncodingCharacters = DEFAULT_ENCODING,
  ) {}

  verify(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.msh) errors.push("MSH segment is required");
    if (!this.evn) errors.push("EVN segment is required");
    if (!this.pid) errors.push("PID segment is required");
    if (!this.pv1) errors.push("PV1 segment is required");

    return { valid: errors.length === 0, errors };
  }

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

export function createADT_A01<
  TMSH extends MSH = MSH,
  TEVN extends EVN = EVN,
  TPID extends PID = PID,
  TPV1 extends PV1 = PV1,
  TPR1 extends PR1 = PR1,
  TIN1 extends IN1 = IN1,
>(
  msh: TMSH,
  evn: TEVN,
  pid: TPID,
  pv1: TPV1,
  options: ADT_A01<TMSH, TEVN, TPID, TPV1, TPR1, TIN1>["options"] = {},
): ADT_A01<TMSH, TEVN, TPID, TPV1, TPR1, TIN1> {
  return new ADT_A01(msh, evn, pid, pv1, options);
}
