/**
 * MSH segment definition for HL7 v2.5.1.
 *
 * @module
 */
import type { Result } from "../../types/result.ts";
import { MSH as MSH_base } from "../v2.3/MSH.ts";

/**
 * MSH segment (HL7 v2.5.1)
 * Extends v2.3 MSH. Add v2.5.1-specific fields here as needed.
 */
export class MSH extends MSH_base {
  /** Parses the input string into a structured instance. */
  static override parse(segmentString: string): Result<MSH> {
    return MSH_base.parse(segmentString) as Result<MSH>;
  }
}
