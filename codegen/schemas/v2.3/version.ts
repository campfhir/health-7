import { VersionSchema } from "../../../src/types/schema";
import { ORU_R01_SCHEMA } from "./ORU_R01";
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

/**
 * v2.3 is the base version — no baseVersion, no segment wrappers to generate.
 * Codegen generates base parser stubs and builder stubs only.
 */
export const V2_3: VersionSchema = {
  version: "v2.3",
  segments: [],
  messages: [
    ORU_R01_SCHEMA,
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
