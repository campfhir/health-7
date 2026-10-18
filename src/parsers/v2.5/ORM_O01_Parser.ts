/**
 * Parser for ORM^O01 messages (HL7 v2.5): the v2.4 structure with IN3 repeating in each
 * insurance group.
 *
 * @module
 */
import type { Result } from "../../types/result.ts";
import {
  ORM_O01_Parser as ORM_O01_Parser_base,
  type ParsedORM_O01,
} from "../v2.4/ORM_O01_Parser.ts";

export type {
  OrderDetailSegment,
  ParsedInsurance,
  ParsedObservation,
  ParsedOrder,
  ParsedOrderDetail,
  ParsedOrderPatient,
  ParsedORM_O01,
  ParsedVisit,
} from "../v2.4/ORM_O01_Parser.ts";

/** Parser for HL7 ORM^O01 (v2.5) messages. */
export class ORM_O01_Parser extends ORM_O01_Parser_base {
  /** IN3 repeats from v2.5. */
  protected override readonly maxIn3PerInsurance: number = Number.POSITIVE_INFINITY;
}

/** Parses an HL7 ORM^O01 (v2.5) message string into a structured result. */
export function parseORM_O01(messageString: string): Result<ParsedORM_O01> {
  return new ORM_O01_Parser().parse(messageString);
}
