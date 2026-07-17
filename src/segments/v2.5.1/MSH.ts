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
  /** MSH-20 Alternate Character Set Handling Scheme (chainable). */
  alternateCharacterSetHandlingScheme(value: string): this {
    this.fields[18] = this.createField(value);
    return this;
  }

  /**
   * MSH-21 Message Profile Identifier (chainable).
   * @param entityIdentifier - MSH-21.1 Entity Identifier
   * @param namespaceId - MSH-21.2 Namespace ID
   */
  messageProfileIdentifier({ entityIdentifier, namespaceId }: { entityIdentifier: string; namespaceId?: string }): this {
    this.fields[19] = this.createComponentsField([entityIdentifier, namespaceId]);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static override parse(segmentString: string): Result<MSH> {
    return MSH_base.parse(segmentString) as Result<MSH>;
  }
}
