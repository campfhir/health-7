/**
 * Builder for ORU^R31 messages (HL7 v2.5.1).
 *
 * @module
 */
import {
  ORU_R30,
  type PatientResultR30,
  type SimplePatientResultR30,
} from "./ORU_R30.ts";
import type { MSH } from "../../segments/v2.5.1/MSH.ts";

export type {
  PatientResultR30 as PatientResultR31,
  OrderObservationR30 as OrderObservationR31,
  SimplePatientResultR30 as SimplePatientResultR31,
  SimpleOrderObservationR30 as SimpleOrderObservationR31,
} from "./ORU_R30.ts";

/** Builder for HL7 ORU^R31 (v2.5.1) messages. */
export class ORU_R31 extends ORU_R30 {
  /** The message name value. */
  protected override readonly messageName = "ORU_R31";

  /** Validates the message structure, returning a result. */
  verify(): { valid: boolean; errors: string[] } {
    const result = super.verify();
    if (this.msh) {
      const { triggerEvent } = this.msh.getMessageType();
      if (triggerEvent && triggerEvent !== "R31") {
        result.errors.push(`MSH-9 trigger event must be "R31", got "${triggerEvent}"`);
      }
    }
    return { valid: result.errors.length === 0, errors: result.errors };
  }

  /** Encodes this message to its HL7 wire string. */
  encode(options?: { renumberSetIds?: boolean }): string {
    const verification = this.verify();
    if (!verification.valid) {
      throw new Error(
        `Cannot encode invalid ORU_R31 message:\n${verification.errors.join("\n")}`,
      );
    }
    return super.encode(options);
  }
}

/** Builds an HL7 ORU^R31 (v2.5.1) message. */
export function createORU_R31(
  msh: MSH,
  patientResults: SimplePatientResultR30[] = [],
): ORU_R31 {
  const convertedResults: PatientResultR30[] = patientResults.map((pr) => ({
    pid: pr.pid,
    pv1: pr.pv1,
    orderObservations: pr.orderObservations.map((oo) => ({
      orc: oo.orc,
      obr: oo.obr,
      obxList: oo.observations,
    })),
  }));
  return new ORU_R31(msh, convertedResults);
}
