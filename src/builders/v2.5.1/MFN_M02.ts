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
export type StaffEntry = StaffEntryBase<MFE, STF, PRA>;
export type MFN_M02 = MFN_M02_Base<MFI, MFE, STF, PRA>;

export { createMFN_M02 };
