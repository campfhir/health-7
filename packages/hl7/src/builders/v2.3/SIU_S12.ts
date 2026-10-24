/**
 * Builder for SIU^S12 messages (HL7 v2.3).
 *
 * @module
 */
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

import type { MSH } from "../../segments/v2.3/MSH.ts";
import type { SCH } from "../../segments/v2.3/SCH.ts";
import type { NTE } from "../../segments/v2.3/NTE.ts";
import type { PID } from "../../segments/v2.3/PID.ts";
import type { PD1 } from "../../segments/v2.3/PD1.ts";
import type { PV1 } from "../../segments/v2.3/PV1.ts";
import type { PV2 } from "../../segments/v2.3/PV2.ts";
import type { OBX } from "../../segments/v2.3/OBX.ts";
import type { DG1 } from "../../segments/v2.3/DG1.ts";
import type { RGS } from "../../segments/v2.3/RGS.ts";
import type { AIS } from "../../segments/v2.3/AIS.ts";
import type { AIG } from "../../segments/v2.3/AIG.ts";
import type { AIL } from "../../segments/v2.3/AIL.ts";
import type { AIP } from "../../segments/v2.3/AIP.ts";
import { type EncodingCharacters, DEFAULT_ENCODING } from "../../types/encoding.ts";

/** SIUPatientGroup — a data structure used to build an HL7 SIU^S12 (v2.3) message. */
export interface SIUPatientGroup<
  TPID extends PID_base = PID,
  TPD1 extends PD1_base = PD1,
  TPV1 extends PV1_base = PV1,
  TPV2 extends PV2_base = PV2,
  TOBX extends OBX_base = OBX,
  TDG1 extends DG1_base = DG1,
> {
  /** The pid value. */
  pid: TPID;
  /** The pd1 value. */
  pd1?: TPD1;
  /** The pv1 value. */
  pv1?: TPV1;
  /** The pv2 value. */
  pv2?: TPV2;
  /** The obx list value. */
  obxList?: TOBX[];
  /** The dg1 list value. */
  dg1List?: TDG1[];
}

/** SIUServiceGroup — a data structure used to build an HL7 SIU^S12 (v2.3) message. */
export interface SIUServiceGroup<
  TAIS extends AIS_base = AIS,
  TNTE extends NTE_base = NTE,
> {
  /** The ais value. */
  ais: TAIS;
  /** The nte list value. */
  nteList?: TNTE[];
}

/** SIUGeneralResourceGroup — a data structure used to build an HL7 SIU^S12 (v2.3) message. */
export interface SIUGeneralResourceGroup<
  TAIG extends AIG_base = AIG,
  TNTE extends NTE_base = NTE,
> {
  /** The aig value. */
  aig: TAIG;
  /** The nte list value. */
  nteList?: TNTE[];
}

/** SIULocationResourceGroup — a data structure used to build an HL7 SIU^S12 (v2.3) message. */
export interface SIULocationResourceGroup<
  TAIL extends AIL_base = AIL,
  TNTE extends NTE_base = NTE,
> {
  /** The ail value. */
  ail: TAIL;
  /** The nte list value. */
  nteList?: TNTE[];
}

/** SIUPersonnelResourceGroup — a data structure used to build an HL7 SIU^S12 (v2.3) message. */
export interface SIUPersonnelResourceGroup<
  TAIP extends AIP_base = AIP,
  TNTE extends NTE_base = NTE,
> {
  /** The aip value. */
  aip: TAIP;
  /** The nte list value. */
  nteList?: TNTE[];
}

/** SIUResourcesGroup — a data structure used to build an HL7 SIU^S12 (v2.3) message. */
export interface SIUResourcesGroup<
  TRGS extends RGS_base = RGS,
  TAIS extends AIS_base = AIS,
  TAIG extends AIG_base = AIG,
  TAIL extends AIL_base = AIL,
  TAIP extends AIP_base = AIP,
  TNTE extends NTE_base = NTE,
> {
  /** The rgs value. */
  rgs: TRGS;
  /** The services value. */
  services?: SIUServiceGroup<TAIS, TNTE>[];
  /** The general resources value. */
  generalResources?: SIUGeneralResourceGroup<TAIG, TNTE>[];
  /** The location resources value. */
  locationResources?: SIULocationResourceGroup<TAIL, TNTE>[];
  /** The personnel resources value. */
  personnelResources?: SIUPersonnelResourceGroup<TAIP, TNTE>[];
}

/** Builder for HL7 SIU^S12 (v2.3) messages. */
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
> {
  /** The message name value. */
  protected readonly messageName: string = "SIU_S12";

  /** Constructor. */
  constructor(
    public msh: TMSH,
    public sch: TSCH,
    public nteList: TNTE[] = [],
    public patients: SIUPatientGroup<TPID, TPD1, TPV1, TPV2, TOBX, TDG1>[] = [],
    public resources: SIUResourcesGroup<TRGS, TAIS, TAIG, TAIL, TAIP, TNTE>[] = [],
    private encoding: EncodingCharacters = DEFAULT_ENCODING,
  ) {}

  /** Validates the message structure, returning a result. */
  verify(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.msh) {
      errors.push(`MSH segment is required for ${this.messageName} message`);
    }

    if (!this.sch) {
      errors.push(`SCH segment is required for ${this.messageName} message`);
    }

    if (this.resources.length === 0) {
      errors.push(`At least one RESOURCES group is required for ${this.messageName} message`);
    }

    for (let i = 0; i < this.resources.length; i++) {
      const rg = this.resources[i];
      if (!rg.rgs) {
        errors.push(`RESOURCES group ${i + 1}: RGS segment is required`);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /** Encodes this message to its HL7 wire string. */
  encode(): string {
    const verification = this.verify();
    if (!verification.valid) {
      throw new Error(
        `Cannot encode invalid ${this.messageName} message:\n${verification.errors.join("\n")}`,
      );
    }

    const segments: string[] = [];

    segments.push(this.msh.encode(this.encoding));
    segments.push(this.sch.encode(this.encoding));

    for (const nte of this.nteList) {
      segments.push(nte.encode(this.encoding));
    }

    for (const patient of this.patients) {
      segments.push(patient.pid.encode(this.encoding));
      if (patient.pd1) segments.push(patient.pd1.encode(this.encoding));
      if (patient.pv1) segments.push(patient.pv1.encode(this.encoding));
      if (patient.pv2) segments.push(patient.pv2.encode(this.encoding));
      for (const obx of patient.obxList ?? []) {
        segments.push(obx.encode(this.encoding));
      }
      for (const dg1 of patient.dg1List ?? []) {
        segments.push(dg1.encode(this.encoding));
      }
    }

    for (const rg of this.resources) {
      segments.push(rg.rgs.encode(this.encoding));
      for (const svc of rg.services ?? []) {
        segments.push(svc.ais.encode(this.encoding));
        for (const nte of svc.nteList ?? []) {
          segments.push(nte.encode(this.encoding));
        }
      }
      for (const gen of rg.generalResources ?? []) {
        segments.push(gen.aig.encode(this.encoding));
        for (const nte of gen.nteList ?? []) {
          segments.push(nte.encode(this.encoding));
        }
      }
      for (const loc of rg.locationResources ?? []) {
        segments.push(loc.ail.encode(this.encoding));
        for (const nte of loc.nteList ?? []) {
          segments.push(nte.encode(this.encoding));
        }
      }
      for (const per of rg.personnelResources ?? []) {
        segments.push(per.aip.encode(this.encoding));
        for (const nte of per.nteList ?? []) {
          segments.push(nte.encode(this.encoding));
        }
      }
    }

    return segments.join("\r");
  }
}

/** Builds an HL7 SIU^S12 (v2.3) message. */
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
