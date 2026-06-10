import type { MSH as MSH_base } from "../../segments/v2.3/MSH.ts";
import type { SCH as SCH_base } from "../../segments/v2.3/SCH.ts";
import type { NTE as NTE_base } from "../../segments/v2.3/NTE.ts";
import type { PID as PID_base } from "../../segments/v2.3/PID.ts";
import type { PD1 as PD1_base } from "../../segments/v2.3/PD1.ts";
import type { PV1 as PV1_base } from "../../segments/v2.3/PV1.ts";
import type { PV2 as PV2_base } from "../../segments/v2.3/PV2.ts";
import type { OBX as OBX_base } from "../../segments/v2.3/OBX.ts";
import type { DG1 as DG1_base } from "../../segments/v2.3/DG1.ts";
import type { RGS as RGS_base } from "../../segments/v2.3/RGS.ts";
import type { AIS as AIS_base } from "../../segments/v2.3/AIS.ts";
import type { AIG as AIG_base } from "../../segments/v2.3/AIG.ts";
import type { AIL as AIL_base } from "../../segments/v2.3/AIL.ts";
import type { AIP as AIP_base } from "../../segments/v2.3/AIP.ts";

import type { MSH } from "../../segments/v2.5.1/MSH.ts";
import type { SCH } from "../../segments/v2.5.1/SCH.ts";
import type { NTE } from "../../segments/v2.5.1/NTE.ts";
import type { PID } from "../../segments/v2.5.1/PID.ts";
import type { PD1 } from "../../segments/v2.5.1/PD1.ts";
import type { PV1 } from "../../segments/v2.5.1/PV1.ts";
import type { PV2 } from "../../segments/v2.5.1/PV2.ts";
import type { OBX } from "../../segments/v2.5.1/OBX.ts";
import type { DG1 } from "../../segments/v2.5.1/DG1.ts";
import type { RGS } from "../../segments/v2.5.1/RGS.ts";
import type { AIS } from "../../segments/v2.5.1/AIS.ts";
import type { AIG } from "../../segments/v2.5.1/AIG.ts";
import type { AIL } from "../../segments/v2.5.1/AIL.ts";
import type { AIP } from "../../segments/v2.5.1/AIP.ts";
import type { EncodingCharacters, DEFAULT_ENCODING } from "../../types/encoding.ts";
import {
  type SIUPatientGroup,
  type SIUServiceGroup,
  type SIUGeneralResourceGroup,
  type SIULocationResourceGroup,
  type SIUPersonnelResourceGroup,
  type SIUResourcesGroup,
  SIU_S12 as SIU_S12_base,
  type createSIU_S12 as createSIU_S12_base,
} from "../v2.3/SIU_S12.ts";

export type {
  SIUPatientGroup,
  SIUServiceGroup,
  SIUGeneralResourceGroup,
  SIULocationResourceGroup,
  SIUPersonnelResourceGroup,
  SIUResourcesGroup,
};

export class SIU_S12<
  TMSH extends MSH_base = MSH,
  TSCH extends SCH_base = SCH,
  TNTE extends NTE_base = NTE,
  TPID extends PID_base = PID,
  TPD1 extends PD1_base = PD1,
  TPV1 extends PV1_base = PV1,
  TPV2 extends PV2_base = PV2,
  TOBX extends OBX_base = OBX,
  TDG1 extends DG1_base = DG1,
  TRGS extends RGS_base = RGS,
  TAIS extends AIS_base = AIS,
  TAIG extends AIG_base = AIG,
  TAIL extends AIL_base = AIL,
  TAIP extends AIP_base = AIP,
> extends SIU_S12_base<TMSH, TSCH, TNTE, TPID, TPD1, TPV1, TPV2, TOBX, TDG1, TRGS, TAIS, TAIG, TAIL, TAIP> {}

export function createSIU_S12<
  TMSH extends MSH_base = MSH,
  TSCH extends SCH_base = SCH,
  TNTE extends NTE_base = NTE,
  TPID extends PID_base = PID,
  TPD1 extends PD1_base = PD1,
  TPV1 extends PV1_base = PV1,
  TPV2 extends PV2_base = PV2,
  TOBX extends OBX_base = OBX,
  TDG1 extends DG1_base = DG1,
  TRGS extends RGS_base = RGS,
  TAIS extends AIS_base = AIS,
  TAIG extends AIG_base = AIG,
  TAIL extends AIL_base = AIL,
  TAIP extends AIP_base = AIP,
>(
  msh: TMSH,
  sch: TSCH,
  nteList?: TNTE[],
  patients?: SIUPatientGroup<TPID, TPD1, TPV1, TPV2, TOBX, TDG1>[],
  resources?: SIUResourcesGroup<TRGS, TAIS, TAIG, TAIL, TAIP, TNTE>[],
  encoding?: EncodingCharacters,
): SIU_S12<TMSH, TSCH, TNTE, TPID, TPD1, TPV1, TPV2, TOBX, TDG1, TRGS, TAIS, TAIG, TAIL, TAIP> {
  return new SIU_S12(msh, sch, nteList ?? [], patients ?? [], resources ?? [], encoding);
}
