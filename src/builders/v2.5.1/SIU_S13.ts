/**
 * Builder for SIU^S13 messages (HL7 v2.5.1).
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
  SIU_S12 as SIU_S13,
  createSIU_S12 as createSIU_S13,
} from "./SIU_S12.ts";
