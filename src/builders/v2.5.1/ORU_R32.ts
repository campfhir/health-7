import {
  ORU_R30,
  type PatientResultR30,
  type SimplePatientResultR30,
} from "./ORU_R30.ts";
import type { MSH } from "../../segments/v2.5.1/MSH.ts";

export type {
  PatientResultR30 as PatientResultR32,
  OrderObservationR30 as OrderObservationR32,
  SimplePatientResultR30 as SimplePatientResultR32,
  SimpleOrderObservationR30 as SimpleOrderObservationR32,
} from "./ORU_R30.ts";

export class ORU_R32 extends ORU_R30 {
  protected override readonly messageName = "ORU_R32";

  verify(): { valid: boolean; errors: string[] } {
    const result = super.verify();
    if (this.msh) {
      const { triggerEvent } = this.msh.getMessageType();
      if (triggerEvent && triggerEvent !== "R32") {
        result.errors.push(`MSH-9 trigger event must be "R32", got "${triggerEvent}"`);
      }
    }
    return { valid: result.errors.length === 0, errors: result.errors };
  }

  encode(options?: { renumberSetIds?: boolean }): string {
    const verification = this.verify();
    if (!verification.valid) {
      throw new Error(
        `Cannot encode invalid ORU_R32 message:\n${verification.errors.join("\n")}`,
      );
    }
    return super.encode(options);
  }
}

export function createORU_R32(
  msh: MSH,
  patientResults: SimplePatientResultR30[] = [],
): ORU_R32 {
  const convertedResults: PatientResultR30[] = patientResults.map((pr) => ({
    pid: pr.pid,
    pv1: pr.pv1,
    orderObservations: pr.orderObservations.map((oo) => ({
      orc: oo.orc,
      obr: oo.obr,
      obxList: oo.observations,
    })),
  }));
  return new ORU_R32(msh, convertedResults);
}
