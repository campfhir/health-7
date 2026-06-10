/**
 * Builder for ORU^R01 messages (HL7 v2.5.1).
 *
 * @module
 */
import type { MSH } from "../../segments/v2.3/MSH.ts";
import type { PID } from "../../segments/v2.3/PID.ts";
import type { PD1 } from "../../segments/v2.3/PD1.ts";
import type { NK1 } from "../../segments/v2.3/NK1.ts";
import type { NTE } from "../../segments/v2.3/NTE.ts";
import type { PV1 } from "../../segments/v2.3/PV1.ts";
import type { ORC } from "../../segments/v2.3/ORC.ts";
import type { OBR } from "../../segments/v2.3/OBR.ts";
import type { OBX } from "../../segments/v2.3/OBX.ts";
// v2.5.1 imports for defaults
import type { PID as PID_251 } from "../../segments/v2.5.1/PID.ts";
import type { PD1 as PD1_251 } from "../../segments/v2.5.1/PD1.ts";
import type { NK1 as NK1_251 } from "../../segments/v2.5.1/NK1.ts";
import type { NTE as NTE_251 } from "../../segments/v2.5.1/NTE.ts";
import type { PV1 as PV1_251 } from "../../segments/v2.5.1/PV1.ts";
import type { ORC as ORC_251 } from "../../segments/v2.5.1/ORC.ts";
import type { OBR as OBR_251 } from "../../segments/v2.5.1/OBR.ts";
import type { OBX as OBX_251 } from "../../segments/v2.5.1/OBX.ts";
import type { MSH as MSH_251 } from "../../segments/v2.5.1/MSH.ts";
import type { CTI } from "../../segments/v2.3/CTI.ts";
import type { CTI as CTI_251 } from "../../segments/v2.5.1/CTI.ts";
import { type EncodingCharacters, DEFAULT_ENCODING } from "../../types/encoding.ts";

/** OBXWithNotes — a data structure used to build an HL7 ORU^R01 (v2.5.1) message. */
export interface OBXWithNotes<TOBX extends OBX = OBX_251, TNTE extends NTE = NTE_251> {
  /** The obx value. */
  obx: TOBX;
  /** The nte list value. */
  nteList?: TNTE[];
}

/** OrderObservation — a data structure used to build an HL7 ORU^R01 (v2.5.1) message. */
export interface OrderObservation<
  TORC extends ORC = ORC_251,
  TOBR extends OBR = OBR_251,
  TOBX extends OBX = OBX_251,
  TNTE extends NTE = NTE_251,
  TCTI extends CTI = CTI_251,
> {
  /** The orc value. */
  orc?: TORC;
  /** The obr value. */
  obr: TOBR;
  /** The obr nte list value. */
  obrNteList?: TNTE[];
  /** The obx list value. */
  obxList: TOBX[] | OBXWithNotes<TOBX, TNTE>[];
  /** The obx nte map value. */
  obxNteMap?: Map<number, TNTE[]>; // Alternative way to associate NTE with OBX
  /** The cti list value. */
  ctiList?: TCTI[];
}

/** PatientResult — a data structure used to build an HL7 ORU^R01 (v2.5.1) message. */
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
  /** The pid value. */
  pid?: TPID;
  /** The pd1 value. */
  pd1?: TPD1;
  /** The nk1 list value. */
  nk1List?: TNK1[];
  /** The nte list value. */
  nteList?: TNTE[];
  /** The pv1 value. */
  pv1?: TPV1;
  /** The order observations value. */
  orderObservations: OrderObservation<TORC, TOBR, TOBX, TNTE>[];
}

/** Builder for HL7 ORU^R01 (v2.5.1) messages. */
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
  /** Constructor. */
  constructor(
    public msh: TMSH,
    public patientResults: PatientResult<TPID, TPD1, TNK1, TNTE, TPV1, TORC, TOBR, TOBX>[] = [],
    private encoding: EncodingCharacters = DEFAULT_ENCODING,
  ) {}

  /** Validates the message structure, returning a result. */
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

  /** Encodes this message to its HL7 wire string. */
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

        if (orderObs.ctiList) {
          for (const cti of orderObs.ctiList) {
            segments.push(cti.encode(this.encoding));
          }
        }
      }
    }

    return segments.join("\r");
  }
}

/** Builds an HL7 ORU^R01 (v2.5.1) message. */
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
