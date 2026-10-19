/**
 * Builder for ORM^O01 messages (HL7 v2.5): the v2.4 structure with IN3 repeating in each
 * insurance group.
 *
 * @module
 */
import type { MSH } from "../../segments/v2.5/MSH.ts";
import type { PID } from "../../segments/v2.5/PID.ts";
import type { ORC } from "../../segments/v2.5/ORC.ts";
import { ORM_O01 as ORM_O01_Base, type OrderGroup } from "../v2.4/ORM_O01.ts";

export type {
  InsuranceGroup,
  ObservationGroup,
  OrderDetailGroup,
  OrderDetailSegment,
  OrderGroup,
  PatientGroup,
} from "../v2.4/ORM_O01.ts";

/** Builder for HL7 ORM^O01 (v2.5) messages. */
export class ORM_O01<
  TMsh extends MSH = MSH,
  TPid extends PID = PID,
  TOrc extends ORC = ORC,
> extends ORM_O01_Base<TMsh, TPid, TOrc> {
  /** IN3 repeats from v2.5. */
  protected override readonly maxIn3PerInsurance: number = Number.POSITIVE_INFINITY;
}

/** Builds an HL7 ORM^O01 (v2.5) message. */
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
