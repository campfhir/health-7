import { MSH as MSH_base } from "../../segments/v2.3/MSH";
import { SCH as SCH_base } from "../../segments/v2.3/SCH";
import { NTE as NTE_base } from "../../segments/v2.3/NTE";
import { PID as PID_base } from "../../segments/v2.3/PID";
import { PD1 as PD1_base } from "../../segments/v2.3/PD1";
import { PV1 as PV1_base } from "../../segments/v2.3/PV1";
import { PV2 as PV2_base } from "../../segments/v2.3/PV2";
import { OBX as OBX_base } from "../../segments/v2.3/OBX";
import { DG1 as DG1_base } from "../../segments/v2.3/DG1";
import { RGS as RGS_base } from "../../segments/v2.3/RGS";
import { AIS as AIS_base } from "../../segments/v2.3/AIS";
import { AIG as AIG_base } from "../../segments/v2.3/AIG";
import { AIL as AIL_base } from "../../segments/v2.3/AIL";
import { AIP as AIP_base } from "../../segments/v2.3/AIP";

import { MSH } from "../../segments/v2.5.1/MSH";
import { SCH } from "../../segments/v2.5.1/SCH";
import { NTE } from "../../segments/v2.5.1/NTE";
import { PID } from "../../segments/v2.5.1/PID";
import { PD1 } from "../../segments/v2.5.1/PD1";
import { PV1 } from "../../segments/v2.5.1/PV1";
import { PV2 } from "../../segments/v2.5.1/PV2";
import { OBX } from "../../segments/v2.5.1/OBX";
import { DG1 } from "../../segments/v2.5.1/DG1";
import { RGS } from "../../segments/v2.5.1/RGS";
import { AIS } from "../../segments/v2.5.1/AIS";
import { AIG } from "../../segments/v2.5.1/AIG";
import { AIL } from "../../segments/v2.5.1/AIL";
import { AIP } from "../../segments/v2.5.1/AIP";
import { EncodingCharacters, DEFAULT_ENCODING } from "../../types/encoding";
import {
  SIUPatientGroup,
  SIUServiceGroup,
  SIUGeneralResourceGroup,
  SIULocationResourceGroup,
  SIUPersonnelResourceGroup,
  SIUResourcesGroup,
  SIU_S12 as SIU_S12_base,
  createSIU_S12 as createSIU_S12_base,
} from "../v2.3/SIU_S12";

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
