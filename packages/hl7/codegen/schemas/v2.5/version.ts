import { VersionSchema } from "../../../src/types/schema";

/**
 * v2.5 — re-exports v2.4, plus the SFT (Software), SPM (Specimen), TQ1 (Timing/Quantity) and TQ2 (Timing/Quantity Relationship) segments introduced in 2.5.
 */
export const V2_5: VersionSchema = {
  version: "v2.5",
  baseVersion: "v2.4",
  reexport: true,
  ownSegments: ["SFT", "SPM", "TQ1", "TQ2"],
  segments: [],
  messages: [],
};
