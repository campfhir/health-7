/**
 * Builder for SIU^S17 messages (HL7 v2.3).
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
  SIU_S12 as SIU_S17,
  createSIU_S12 as createSIU_S17,
} from "./SIU_S12.ts";
