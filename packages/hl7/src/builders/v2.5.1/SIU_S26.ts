/**
 * Builder for SIU^S26 messages (HL7 v2.5.1).
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
  SIU_S12 as SIU_S26,
  createSIU_S12 as createSIU_S26,
} from "./SIU_S12.ts";
