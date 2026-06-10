/**
 * Builder for MFN^M02 messages (HL7 v2.5.1).
 *
 * @module
 */
import type { MFI } from "../../segments/v2.5.1/MFI.ts";
import type { MFE } from "../../segments/v2.5.1/MFE.ts";
import type { STF } from "../../segments/v2.5.1/STF.ts";
import type { PRA } from "../../segments/v2.5.1/PRA.ts";
import {
  type MFN_M02 as MFN_M02_Base,
  type StaffEntry as StaffEntryBase,
  createMFN_M02,
} from "../v2.3/MFN_M02.ts";

// v2.5.1 types — StaffEntry and MFN_M02 are the same class/logic,
// just narrowed to v2.5.1 segment types.
/** StaffEntry — a data structure used to build an HL7 MFN^M02 (v2.5.1) message. */
export type StaffEntry = StaffEntryBase<MFE, STF, PRA>;
/** MFN_M02 — a data structure used to build an HL7 MFN^M02 (v2.5.1) message. */
export type MFN_M02 = MFN_M02_Base<MFI, MFE, STF, PRA>;

export { createMFN_M02 };
