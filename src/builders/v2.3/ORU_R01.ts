import { MSH } from "../../segments/v2.3/MSH";
import { PID } from "../../segments/v2.3/PID";
import { PD1 } from "../../segments/v2.3/PD1";
import { NK1 } from "../../segments/v2.3/NK1";
import { NTE } from "../../segments/v2.3/NTE";
import { PV1 } from "../../segments/v2.3/PV1";
import { ORC } from "../../segments/v2.3/ORC";
import { OBR } from "../../segments/v2.3/OBR";
import { OBX } from "../../segments/v2.3/OBX";
import {
  ORU_R01 as ORU_R01_Base,
  OBXWithNotes as OBXWithNotesBase,
  OrderObservation as OrderObservationBase,
  PatientResult as PatientResultBase,
  createORU_R01,
} from "../v2.5.1/ORU_R01";

export type OBXWithNotes = OBXWithNotesBase<OBX, NTE>;
export type OrderObservation = OrderObservationBase<ORC, OBR, OBX, NTE>;
export type PatientResult = PatientResultBase<PID, PD1, NK1, NTE, PV1, ORC, OBR, OBX>;
export type ORU_R01 = ORU_R01_Base<MSH, PID, PD1, NK1, NTE, PV1, ORC, OBR, OBX>;

export { createORU_R01 };
