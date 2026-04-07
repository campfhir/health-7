import { VersionSchema } from "../../../src/types/schema";
import { ORU_R01_SCHEMA } from "./ORU_R01";
import { ORU_R30_SCHEMA, ORU_R31_SCHEMA, ORU_R32_SCHEMA } from "./ORU_R30";
import { MFN_M02_SCHEMA } from "./MFN_M02";
import { ADT_A28_SCHEMA } from "./ADT_A28";
import {
  SIU_S12_SCHEMA,
  SIU_S13_SCHEMA,
  SIU_S14_SCHEMA,
  SIU_S15_SCHEMA,
  SIU_S16_SCHEMA,
  SIU_S17_SCHEMA,
  SIU_S26_SCHEMA,
} from "./SIU_S12";

export const V2_5_1: VersionSchema = {
  version: "v2.5.1",
  baseVersion: "v2.3",
  segments: [
    // Core
    "MSH", "NTE", "SFT",
    // Patient
    "PID", "PD1", "NK1", "AL1", "DB1", "GT1",
    // Visit
    "PV1", "PV2", "ROL", "EVN", "MRG",
    // Clinical
    "DG1", "PR1", "OBX", "OBR", "ORC",
    // Insurance / Finance
    "IN1", "IN2", "IN3", "ACC", "DRG", "UB1", "UB2",
    // Messaging
    "MSA", "ERR",
    // Pharmacy
    "RXO", "RXE", "RXD", "RXA", "RXR",
    // Timing / Specimen
    "TQ1", "SPM",
    // Master files / Staff
    "MFI", "MFE", "STF", "PRA",
    // Scheduling
    "SCH", "RGS", "AIS", "AIL", "AIG", "AIP",
  ],
  messages: [
    ORU_R01_SCHEMA,
    ORU_R30_SCHEMA,
    ORU_R31_SCHEMA,
    ORU_R32_SCHEMA,
    MFN_M02_SCHEMA,
    ADT_A28_SCHEMA,
    SIU_S12_SCHEMA,
    SIU_S13_SCHEMA,
    SIU_S14_SCHEMA,
    SIU_S15_SCHEMA,
    SIU_S16_SCHEMA,
    SIU_S17_SCHEMA,
    SIU_S26_SCHEMA,
  ],
};
