/**
 * Parser for VXU^V04 messages (HL7 v2.4): the v2.3 structure plus `[{GT1}]` between the
 * visit and the insurance groups.
 *
 * @module
 */
import type { Result } from "../../types/result.ts";
import {
  VXU_V04_Parser as VXU_V04_Parser_base,
  type ParsedVXU_V04,
} from "../v2.3/VXU_V04_Parser.ts";

export type {
  ParsedInsurance,
  ParsedObservation,
  ParsedVaccination,
  ParsedVisit,
  ParsedVXU_V04,
} from "../v2.3/VXU_V04_Parser.ts";

/** Parser for HL7 VXU^V04 (v2.4) messages. */
export class VXU_V04_Parser extends VXU_V04_Parser_base {
  /** GT1 is part of the structure from v2.4. */
  protected override readonly allowGT1: boolean = true;
}

/** Parses an HL7 VXU^V04 (v2.4) message string into a structured result. */
export function parseVXU_V04(messageString: string): Result<ParsedVXU_V04> {
  return new VXU_V04_Parser().parse(messageString);
}
