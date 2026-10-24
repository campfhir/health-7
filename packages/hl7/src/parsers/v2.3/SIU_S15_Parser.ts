/**
 * Parser for SIU^S15 messages (HL7 v2.3).
 *
 * @module
 */
import type { Result } from "../../types/result.ts";
import {
  SIU_S12_Parser,
  type ParsedSIU_S12,
  type ParsedSIUPatient,
  type ParsedSIUResources,
  type ParsedSIUService,
  type ParsedSIUGeneralResource,
  type ParsedSIULocationResource,
  type ParsedSIUPersonnelResource,
} from "./SIU_S12_Parser.ts";

export type {
  ParsedSIUPatient,
  ParsedSIUResources,
  ParsedSIUService,
  ParsedSIUGeneralResource,
  ParsedSIULocationResource,
  ParsedSIUPersonnelResource,
};
/** Structured result of parsing an HL7 SIU^S15 (v2.3) message. */
export type ParsedSIU_S15 = ParsedSIU_S12;

/** Parser for HL7 SIU^S15 (v2.3) messages. */
export class SIU_S15_Parser extends SIU_S12_Parser {}

/** Parses an HL7 SIU^S15 (v2.3) message string into a structured result. */
export function parseSIU_S15(messageString: string): Result<ParsedSIU_S15> {
  return new SIU_S15_Parser().parse(messageString);
}
