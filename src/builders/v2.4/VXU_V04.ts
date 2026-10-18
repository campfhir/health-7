/**
 * Builder for VXU^V04 messages (HL7 v2.4): the v2.3 structure plus `[{GT1}]` between the
 * visit and the insurance groups.
 *
 * @module
 */
import type { MSH } from "../../segments/v2.4/MSH.ts";
import type { PID } from "../../segments/v2.4/PID.ts";
import type { RXA } from "../../segments/v2.4/RXA.ts";
import { VXU_V04 as VXU_V04_Base } from "../v2.3/VXU_V04.ts";

export type {
  InsuranceGroup,
  ObservationGroup,
  VaccinationGroup,
} from "../v2.3/VXU_V04.ts";

/** Builder for HL7 VXU^V04 (v2.4) messages. */
export class VXU_V04<
  TMsh extends MSH = MSH,
  TPid extends PID = PID,
  TRxa extends RXA = RXA,
> extends VXU_V04_Base<TMsh, TPid, TRxa> {
  /** GT1 is part of the structure from v2.4. */
  protected override readonly allowGT1: boolean = true;
}

/** Builds an HL7 VXU^V04 (v2.4) message. */
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
