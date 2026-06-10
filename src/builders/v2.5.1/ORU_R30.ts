import type { MSH } from "../../segments/v2.5.1/MSH.ts";
import type { PID } from "../../segments/v2.5.1/PID.ts";
import type { PV1 } from "../../segments/v2.5.1/PV1.ts";
import type { ORC } from "../../segments/v2.5.1/ORC.ts";
import type { OBR } from "../../segments/v2.5.1/OBR.ts";
import type { OBX } from "../../segments/v2.5.1/OBX.ts";
import { type EncodingCharacters, DEFAULT_ENCODING } from "../../types/encoding.ts";

export interface OrderObservationR30 {
  orc: ORC;
  obr: OBR;
  obxList: OBX[];
  observations?: OBX[]; // Alias for obxList
}

export interface PatientResultR30 {
  pid?: PID;
  pv1?: PV1;
  orderObservations: OrderObservationR30[];
}

// Simplified interface for convenience
export interface SimpleOrderObservationR30 {
  orc: ORC;
  obr: OBR;
  observations: OBX[];
}

export interface SimplePatientResultR30 {
  pid?: PID;
  pv1?: PV1;
  orderObservations: SimpleOrderObservationR30[];
}

export class ORU_R30 {
  protected readonly messageName: string = "ORU_R30";

  constructor(
    public msh: MSH,
    public patientResults: PatientResultR30[] = [],
    private encoding: EncodingCharacters = DEFAULT_ENCODING,
  ) {}

  verify(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.msh) {
      errors.push(`MSH segment is required for ${this.messageName} message`);
    }

    if (this.patientResults.length === 0) {
      errors.push(
        `At least one patient result is required for ${this.messageName} message`,
      );
    }

    for (let i = 0; i < this.patientResults.length; i++) {
      const patientResult = this.patientResults[i];

      if (patientResult.orderObservations.length === 0) {
        errors.push(
          `Patient result ${i + 1}: At least one order observation is required`,
        );
      }

      for (let j = 0; j < patientResult.orderObservations.length; j++) {
        const orderObs = patientResult.orderObservations[j];

        if (!orderObs.orc) {
          errors.push(
            `Patient result ${i + 1}, order observation ${j + 1}: ORC segment is required`,
          );
        }

        if (!orderObs.obr) {
          errors.push(
            `Patient result ${i + 1}, order observation ${j + 1}: OBR segment is required`,
          );
        }
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
        `Cannot encode invalid ORU_R30 message:\n${verification.errors.join("\n")}`,
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

      if (patientResult.pv1) {
        segments.push(patientResult.pv1.encode(this.encoding));
      }

      // Renumber OBR and OBX Set IDs if requested
      if (options?.renumberSetIds) {
        patientResult.orderObservations.forEach((orderObs, obrIndex) => {
          orderObs.obr.setId(String(obrIndex + 1));
          const obxList = orderObs.obxList || orderObs.observations || [];
          obxList.forEach((obx, obxIndex) => {
            obx.setId(String(obxIndex + 1));
          });
        });
      }

      for (const orderObs of patientResult.orderObservations) {
        segments.push(orderObs.orc.encode(this.encoding));
        segments.push(orderObs.obr.encode(this.encoding));

        // Support both obxList and observations
        const obxList = orderObs.obxList || orderObs.observations || [];
        for (const obx of obxList) {
          segments.push(obx.encode(this.encoding));
        }
      }
    }

    return segments.join("\r");
  }
}

export function createORU_R30(
  msh: MSH,
  patientResults: SimplePatientResultR30[] = [],
): ORU_R30 {
  // Convert SimplePatientResultR30 to PatientResultR30
  const convertedResults: PatientResultR30[] = patientResults.map((pr) => ({
    pid: pr.pid,
    pv1: pr.pv1,
    orderObservations: pr.orderObservations.map((oo) => ({
      orc: oo.orc,
      obr: oo.obr,
      obxList: oo.observations,
    })),
  }));

  return new ORU_R30(msh, convertedResults);
}


