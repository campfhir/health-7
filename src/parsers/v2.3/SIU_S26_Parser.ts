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
export type ParsedSIU_S26 = ParsedSIU_S12;

export class SIU_S26_Parser extends SIU_S12_Parser {}

export function parseSIU_S26(messageString: string): Result<ParsedSIU_S26> {
  return new SIU_S26_Parser().parse(messageString);
}
