import {
  MSH,
  PID,
  PV1,
  OBR,
  OBX,
  ORC,
  NTE,
  NK1,
  PD1,
} from "../../segments/v2.5.1";
import { EncodingCharacters, DEFAULT_ENCODING } from "../../types/encoding";

export interface OBXWithNotes {
  obx: OBX;
  nteList?: NTE[];
}

export interface OrderObservation {
  orc?: ORC;
  obr: OBR;
  obrNteList?: NTE[];
  obxList: OBX[] | OBXWithNotes[];
  obxNteMap?: Map<number, NTE[]>; // Alternative way to associate NTE with OBX
}

export interface PatientResult {
  pid?: PID;
  pd1?: PD1;
  nk1List?: NK1[];
  nteList?: NTE[];
  pv1?: PV1;
  orderObservations: OrderObservation[];
}

export interface ORU_R01_Message {
  msh: MSH;
  patientResults: PatientResult[];
}

export class ORU_R01 {
  constructor(
    public msh: MSH,
    public patientResults: PatientResult[] = [],
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

export function createORU_R01(
  msh: MSH,
  patientResults: PatientResult[] = [],
): ORU_R01 {
  return new ORU_R01(msh, patientResults);
}
