import { MFI } from "../../segments/v2.5.1/MFI";
import { MFE } from "../../segments/v2.5.1/MFE";
import { STF } from "../../segments/v2.5.1/STF";
import { PRA } from "../../segments/v2.5.1/PRA";
import {
  MFN_M02 as MFN_M02_Base,
  StaffEntry as StaffEntryBase,
  createMFN_M02,
} from "../v2.3/MFN_M02";

// v2.5.1 types — StaffEntry and MFN_M02 are the same class/logic,
// just narrowed to v2.5.1 segment types.
export type StaffEntry = StaffEntryBase<MFE, STF, PRA>;
export type MFN_M02 = MFN_M02_Base<MFI, MFE, STF, PRA>;

export { createMFN_M02 };
