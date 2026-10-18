import { VersionSchema } from "../../../src/types/schema";

/**
 * v2.4 — re-exports v2.3.1, plus the SFT (Software) segment introduced in 2.4.
 */
export const V2_4: VersionSchema = {
  version: "v2.4",
  baseVersion: "v2.3.1",
  reexport: true,
  ownSegments: ["SFT"],
  segments: [],
  messages: [],
};
