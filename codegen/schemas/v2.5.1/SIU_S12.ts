import { MessageSchema } from "../../../src/types/schema";
import {
  SIU_S12_SCHEMA as SIU_S12_V2_3,
  SIU_S13_SCHEMA as SIU_S13_V2_3,
  SIU_S14_SCHEMA as SIU_S14_V2_3,
  SIU_S15_SCHEMA as SIU_S15_V2_3,
  SIU_S16_SCHEMA as SIU_S16_V2_3,
  SIU_S17_SCHEMA as SIU_S17_V2_3,
  SIU_S26_SCHEMA as SIU_S26_V2_3,
} from "../v2.3/SIU_S12";

export const SIU_S12_SCHEMA: MessageSchema = { ...SIU_S12_V2_3, version: "2.5.1" };
export const SIU_S13_SCHEMA: MessageSchema = { ...SIU_S13_V2_3, version: "2.5.1" };
export const SIU_S14_SCHEMA: MessageSchema = { ...SIU_S14_V2_3, version: "2.5.1" };
export const SIU_S15_SCHEMA: MessageSchema = { ...SIU_S15_V2_3, version: "2.5.1" };
export const SIU_S16_SCHEMA: MessageSchema = { ...SIU_S16_V2_3, version: "2.5.1" };
export const SIU_S17_SCHEMA: MessageSchema = { ...SIU_S17_V2_3, version: "2.5.1" };
export const SIU_S26_SCHEMA: MessageSchema = { ...SIU_S26_V2_3, version: "2.5.1" };
