import { VersionSchema } from "../../../src/types/schema";

/**
 * v2.5 — re-exports v2.4, plus the SPM (Specimen) and TQ1 (Timing/Quantity) segments introduced in 2.5.
 */
export const V2_5: VersionSchema = {
  version: "v2.5",
  baseVersion: "v2.4",
  reexport: true,
  ownSegments: ["SPM", "TQ1"],
  segments: [],
  messages: [],
};
