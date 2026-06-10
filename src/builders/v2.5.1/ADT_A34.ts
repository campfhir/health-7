/**
 * Builder for ADT^A34 messages (HL7 v2.5.1).
 *
 * @module
 */
import type { MSH as MSH_base } from "../../segments/v2.3/MSH.ts";
import type { EVN as EVN_base } from "../../segments/v2.3/EVN.ts";
import type { PID as PID_base } from "../../segments/v2.3/PID.ts";
import type { PD1 as PD1_base } from "../../segments/v2.3/PD1.ts";
import type { MRG as MRG_base } from "../../segments/v2.3/MRG.ts";
import type { PV1 as PV1_base } from "../../segments/v2.3/PV1.ts";

import type { MSH } from "../../segments/v2.5.1/MSH.ts";
import type { EVN } from "../../segments/v2.5.1/EVN.ts";
import type { PID } from "../../segments/v2.5.1/PID.ts";
import type { PD1 } from "../../segments/v2.5.1/PD1.ts";
import type { MRG } from "../../segments/v2.5.1/MRG.ts";
import type { PV1 } from "../../segments/v2.5.1/PV1.ts";
import { type EncodingCharacters, DEFAULT_ENCODING } from "../../types/encoding.ts";

/** Builder for HL7 ADT^A34 (v2.5.1) messages. */
export class ADT_A34<
  TMSH extends MSH_base = MSH,
  TEVN extends EVN_base = EVN,
  TPID extends PID_base = PID,
  TPD1 extends PD1_base = PD1,
  TMRG extends MRG_base = MRG,
  TPV1 extends PV1_base = PV1,
> {
  /** Constructor. */
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

  /** Validates the message structure, returning a result. */
  verify(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.msh) errors.push("MSH segment is required");
    if (!this.pid) errors.push("PID segment is required");
    if (!this.mrg) errors.push("MRG segment is required");

    return { valid: errors.length === 0, errors };
  }

  /** Encodes this message to its HL7 wire string. */
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

/** Builds an HL7 ADT^A34 (v2.5.1) message. */
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
