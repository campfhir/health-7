import { MSH } from "../../segments/v2.3/MSH";
import { PID } from "../../segments/v2.3/PID";
import { PD1 } from "../../segments/v2.3/PD1";
import { NK1 } from "../../segments/v2.3/NK1";
import { NTE } from "../../segments/v2.3/NTE";
import { PV1 } from "../../segments/v2.3/PV1";
import { ORC } from "../../segments/v2.3/ORC";
import { OBR } from "../../segments/v2.3/OBR";
import { OBX } from "../../segments/v2.3/OBX";
// v2.5.1 imports for defaults
import { PID as PID_251 } from "../../segments/v2.5.1/PID";
import { PD1 as PD1_251 } from "../../segments/v2.5.1/PD1";
import { NK1 as NK1_251 } from "../../segments/v2.5.1/NK1";
import { NTE as NTE_251 } from "../../segments/v2.5.1/NTE";
import { PV1 as PV1_251 } from "../../segments/v2.5.1/PV1";
import { ORC as ORC_251 } from "../../segments/v2.5.1/ORC";
import { OBR as OBR_251 } from "../../segments/v2.5.1/OBR";
import { OBX as OBX_251 } from "../../segments/v2.5.1/OBX";
import { MSH as MSH_251 } from "../../segments/v2.5.1/MSH";
import { EncodingCharacters, DEFAULT_ENCODING } from "../../types/encoding";

export interface OBXWithNotes<TOBX extends OBX = OBX_251, TNTE extends NTE = NTE_251> {
  obx: TOBX;
  nteList?: TNTE[];
}

export interface OrderObservation<
  TORC extends ORC = ORC_251,
  TOBR extends OBR = OBR_251,
  TOBX extends OBX = OBX_251,
  TNTE extends NTE = NTE_251,
> {
  orc?: TORC;
  obr: TOBR;
  obrNteList?: TNTE[];
  obxList: TOBX[] | OBXWithNotes<TOBX, TNTE>[];
  obxNteMap?: Map<number, TNTE[]>; // Alternative way to associate NTE with OBX
}

export interface PatientResult<
  TPID extends PID = PID_251,
  TPD1 extends PD1 = PD1_251,
  TNK1 extends NK1 = NK1_251,
  TNTE extends NTE = NTE_251,
  TPV1 extends PV1 = PV1_251,
  TORC extends ORC = ORC_251,
  TOBR extends OBR = OBR_251,
  TOBX extends OBX = OBX_251,
> {
  pid?: TPID;
  pd1?: TPD1;
  nk1List?: TNK1[];
  nteList?: TNTE[];
  pv1?: TPV1;
  orderObservations: OrderObservation<TORC, TOBR, TOBX, TNTE>[];
}

export class ORU_R01<
  TMSH extends MSH = MSH_251,
  TPID extends PID = PID_251,
  TPD1 extends PD1 = PD1_251,
  TNK1 extends NK1 = NK1_251,
  TNTE extends NTE = NTE_251,
  TPV1 extends PV1 = PV1_251,
  TORC extends ORC = ORC_251,
  TOBR extends OBR = OBR_251,
  TOBX extends OBX = OBX_251,
> {
  constructor(
    public msh: TMSH,
    public patientResults: PatientResult<TPID, TPD1, TNK1, TNTE, TPV1, TORC, TOBR, TOBX>[] = [],
    private encoding: EncodingCharacters = DEFAULT_ENCODING,
  ) {}

  verify(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.msh) {
      errors.push("MSH segment is required for ORU_R01 message");
    }

    if (this.patientResults.length === 0) {
      errors.push(
        "At least one patient result is required for ORU_R01 message",
      );
    }

    for (let i = 0; i < this.patientResults.length; i++) {
      const patientResult = this.patientResults[i];

      if (patientResult.orderObservations.length === 0) {
        errors.push(
          `Patient result ${i + 1}: At least one order observation is required`,
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  encode(options?: { renumberSetIds?: boolean }): string {
    const verification = this.verify();
    if (!verification.valid) {
      throw new Error(
        `Cannot encode invalid ORU_R01 message:\n${verification.errors.join("\n")}`,
      );
    }

    const segments: string[] = [];

    // Add MSH segment
    segments.push(this.msh.encode(this.encoding));

    // Add patient results
    for (const patientResult of this.patientResults) {
      if (patientResult.pid) {
        segments.push(patientResult.pid.encode(this.encoding));
      }

      // Add PD1 after PID
      if (patientResult.pd1) {
        segments.push(patientResult.pd1.encode(this.encoding));
      }

      // Add NK1 segments after PD1
      if (patientResult.nk1List) {
        for (const nk1 of patientResult.nk1List) {
          segments.push(nk1.encode(this.encoding));
        }
      }

      // Add NTE segments after NK1 (patient notes)
      if (patientResult.nteList) {
        for (const nte of patientResult.nteList) {
          segments.push(nte.encode(this.encoding));
        }
      }

      if (patientResult.pv1) {
        segments.push(patientResult.pv1.encode(this.encoding));
      }

      // Renumber OBR and OBX Set IDs if requested
      if (options?.renumberSetIds) {
        patientResult.orderObservations.forEach((orderObs, obrIndex) => {
          orderObs.obr.setId(String(obrIndex + 1));
          orderObs.obxList.forEach((obxItem, obxIndex) => {
            // Handle both OBX and OBXWithNotes
            const obx = "obx" in obxItem ? obxItem.obx : obxItem;
            obx.setId(String(obxIndex + 1));
          });
        });
      }

      for (const orderObs of patientResult.orderObservations) {
        // Add ORC if present (typically before OBR)
        if (orderObs.orc) {
          segments.push(orderObs.orc.encode(this.encoding));
        }

        segments.push(orderObs.obr.encode(this.encoding));

        // Add NTE segments after OBR (order notes)
        if (orderObs.obrNteList) {
          for (const nte of orderObs.obrNteList) {
            segments.push(nte.encode(this.encoding));
          }
        }

        for (let obxIdx = 0; obxIdx < orderObs.obxList.length; obxIdx++) {
          const obxItem = orderObs.obxList[obxIdx];

          // Handle both OBX and OBXWithNotes formats
          if ("obx" in obxItem) {
            // OBXWithNotes format
            segments.push(obxItem.obx.encode(this.encoding));
            // Add NTE segments after OBX (observation notes)
            if (obxItem.nteList) {
              for (const nte of obxItem.nteList) {
                segments.push(nte.encode(this.encoding));
              }
            }
          } else {
            // Plain OBX format (backwards compatibility)
            segments.push(obxItem.encode(this.encoding));

            // Check if there are NTE segments for this OBX in the map
            if (orderObs.obxNteMap) {
              const nteList = orderObs.obxNteMap.get(obxIdx);
              if (nteList) {
                for (const nte of nteList) {
                  segments.push(nte.encode(this.encoding));
                }
              }
            }
          }
        }
      }
    }

    return segments.join("\r");
  }
}

export function createORU_R01<
  TMSH extends MSH = MSH_251,
  TPID extends PID = PID_251,
  TPD1 extends PD1 = PD1_251,
  TNK1 extends NK1 = NK1_251,
  TNTE extends NTE = NTE_251,
  TPV1 extends PV1 = PV1_251,
  TORC extends ORC = ORC_251,
  TOBR extends OBR = OBR_251,
  TOBX extends OBX = OBX_251,
>(
  msh: TMSH,
  patientResults: PatientResult<TPID, TPD1, TNK1, TNTE, TPV1, TORC, TOBR, TOBX>[] = [],
): ORU_R01<TMSH, TPID, TPD1, TNK1, TNTE, TPV1, TORC, TOBR, TOBX> {
  return new ORU_R01(msh, patientResults);
}
