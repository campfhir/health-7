/**
 * Builder for SIU^S15 messages (HL7 v2.3).
 *
 * @module
 */
export {
  type SIUPatientGroup,
  type SIUServiceGroup,
  type SIUGeneralResourceGroup,
  type SIULocationResourceGroup,
  type SIUPersonnelResourceGroup,
  type SIUResourcesGroup,
  SIU_S12 as SIU_S15,
  createSIU_S12 as createSIU_S15,
} from "./SIU_S12.ts";
