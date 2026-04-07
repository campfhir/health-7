import { MSH as MSH_base } from "../../segments/v2.3/MSH";
import { EVN as EVN_base } from "../../segments/v2.3/EVN";
import { PID as PID_base } from "../../segments/v2.3/PID";
import { PD1 as PD1_base } from "../../segments/v2.3/PD1";
import { MRG as MRG_base } from "../../segments/v2.3/MRG";
import { PV1 as PV1_base } from "../../segments/v2.3/PV1";

import { MSH } from "../../segments/v2.5.1/MSH";
import { EVN } from "../../segments/v2.5.1/EVN";
import { PID } from "../../segments/v2.5.1/PID";
import { PD1 } from "../../segments/v2.5.1/PD1";
import { MRG } from "../../segments/v2.5.1/MRG";
import { PV1 } from "../../segments/v2.5.1/PV1";
import { EncodingCharacters, DEFAULT_ENCODING } from "../../types/encoding";

export class ADT_A34<
  TMSH extends MSH_base = MSH,
  TEVN extends EVN_base = EVN,
  TPID extends PID_base = PID,
  TPD1 extends PD1_base = PD1,
  TMRG extends MRG_base = MRG,
  TPV1 extends PV1_base = PV1,
> {
  constructor(
    public msh: TMSH,
    public pid: TPID,
    public mrg: TMRG,
    public options: {
      evn?: TEVN;
      pd1?: TPD1;
      pv1?: TPV1;
    } = {},
    private encoding: EncodingCharacters = DEFAULT_ENCODING,
  ) {}

  verify(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.msh) errors.push("MSH segment is required");
    if (!this.pid) errors.push("PID segment is required");
    if (!this.mrg) errors.push("MRG segment is required");

    return { valid: errors.length === 0, errors };
  }

  encode(): string {
    const verification = this.verify();
    if (!verification.valid) {
      throw new Error(
        `Cannot encode invalid ADT_A34 message:\n${verification.errors.join("\n")}`,
      );
    }

    const segments: string[] = [];
    const { options: o, encoding: enc } = this;

    segments.push(this.msh.encode(enc));
    if (o.evn) segments.push(o.evn.encode(enc));
    segments.push(this.pid.encode(enc));
    if (o.pd1) segments.push(o.pd1.encode(enc));
    segments.push(this.mrg.encode(enc));
    if (o.pv1) segments.push(o.pv1.encode(enc));

    return segments.join("\r");
  }
}

export function createADT_A34<
  TMSH extends MSH_base = MSH,
  TEVN extends EVN_base = EVN,
  TPID extends PID_base = PID,
  TPD1 extends PD1_base = PD1,
  TMRG extends MRG_base = MRG,
  TPV1 extends PV1_base = PV1,
>(
  msh: TMSH,
  pid: TPID,
  mrg: TMRG,
  options: ADT_A34<TMSH, TEVN, TPID, TPD1, TMRG, TPV1>["options"] = {},
): ADT_A34<TMSH, TEVN, TPID, TPD1, TMRG, TPV1> {
  return new ADT_A34(msh, pid, mrg, options);
}
