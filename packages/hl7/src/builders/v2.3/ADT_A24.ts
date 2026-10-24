/**
 * Builder for ADT^A24 messages (HL7 2.3).
 *
 * @module
 */
import type { MSH } from "../../segments/v2.3/MSH.ts";
import type { EVN } from "../../segments/v2.3/EVN.ts";
import type { PID } from "../../segments/v2.3/PID.ts";
import type { PD1 } from "../../segments/v2.3/PD1.ts";
import type { PV1 } from "../../segments/v2.3/PV1.ts";
import type { DB1 } from "../../segments/v2.3/DB1.ts";
import { type EncodingCharacters, DEFAULT_ENCODING } from "../../types/encoding.ts";

/** LinkedPatient — one of the two patients being linked in an HL7 ADT^A24 (2.3) message. */
export interface LinkedPatient<TPID extends PID = PID, TPV1 extends PV1 = PV1> {
  /** The pid value. */
  pid: TPID;
  /** The pd1 value. */
  pd1?: PD1;
  /** The pv1 value. */
  pv1?: TPV1;
  /** The db1 list value. */
  db1List?: DB1[];
}

/** Builder for HL7 ADT^A24 (2.3) messages. */
export class ADT_A24<
  TMSH extends MSH = MSH,
  TEVN extends EVN = EVN,
  TPID extends PID = PID,
  TPV1 extends PV1 = PV1,
> {
  /** Constructor. */
  constructor(
    public msh: TMSH,
    public evn: TEVN,
    public patient1: LinkedPatient<TPID, TPV1>,
    public patient2: LinkedPatient<TPID, TPV1>,
    private encoding: EncodingCharacters = DEFAULT_ENCODING,
  ) {}

  /** Validates the message structure, returning a result. */
  verify(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.msh) errors.push("MSH segment is required");
    if (!this.evn) errors.push("EVN segment is required");
    if (!this.patient1?.pid) errors.push("PID segment is required for patient 1");
    if (!this.patient2?.pid) errors.push("PID segment is required for patient 2");

    return { valid: errors.length === 0, errors };
  }

  /** Encodes this message to its HL7 wire string. */
  encode(): string {
    const verification = this.verify();
    if (!verification.valid) {
      throw new Error(
        `Cannot encode invalid ADT_A24 message:\n${verification.errors.join("\n")}`,
      );
    }

    const segments: string[] = [];
    const enc = this.encoding;

    segments.push(this.msh.encode(enc));
    segments.push(this.evn.encode(enc));
    for (const p of [this.patient1, this.patient2]) {
      segments.push(p.pid.encode(enc));
      if (p.pd1) segments.push(p.pd1.encode(enc));
      if (p.pv1) segments.push(p.pv1.encode(enc));
      if (p.db1List) p.db1List.forEach((x) => segments.push(x.encode(enc)));
    }

    return segments.join("\r");
  }
}

/** Builds an HL7 ADT^A24 (2.3) message. */
export function createADT_A24<
  TMSH extends MSH = MSH,
  TEVN extends EVN = EVN,
  TPID extends PID = PID,
  TPV1 extends PV1 = PV1,
>(
  msh: TMSH,
  evn: TEVN,
  patient1: LinkedPatient<TPID, TPV1>,
  patient2: LinkedPatient<TPID, TPV1>,
): ADT_A24<TMSH, TEVN, TPID, TPV1> {
  return new ADT_A24(msh, evn, patient1, patient2);
}
