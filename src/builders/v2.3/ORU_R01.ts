/**
 * Builder for ORU^R01 messages (HL7 v2.3).
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
import {
  type ORU_R01 as ORU_R01_Base,
  type OBXWithNotes as OBXWithNotesBase,
  type OrderObservation as OrderObservationBase,
  type PatientResult as PatientResultBase,
  createORU_R01,
} from "../v2.5.1/ORU_R01.ts";

/** OBXWithNotes — a data structure used to build an HL7 ORU^R01 (v2.3) message. */
export type OBXWithNotes = OBXWithNotesBase<OBX, NTE>;
/** OrderObservation — a data structure used to build an HL7 ORU^R01 (v2.3) message. */
export type OrderObservation = OrderObservationBase<ORC, OBR, OBX, NTE>;
/** PatientResult — a data structure used to build an HL7 ORU^R01 (v2.3) message. */
export type PatientResult = PatientResultBase<PID, PD1, NK1, NTE, PV1, ORC, OBR, OBX>;
/** ORU_R01 — a data structure used to build an HL7 ORU^R01 (v2.3) message. */
export type ORU_R01 = ORU_R01_Base<MSH, PID, PD1, NK1, NTE, PV1, ORC, OBR, OBX>;

export { createORU_R01 };
