/**
 * Builder for SIU^S16 messages (HL7 v2.3).
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
  SIU_S12 as SIU_S16,
  createSIU_S12 as createSIU_S16,
} from "./SIU_S12.ts";
