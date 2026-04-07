import { Result } from "../../types/result";
import {
  SIU_S12_Parser,
  ParsedSIU_S12,
  ParsedSIUPatient,
  ParsedSIUResources,
  ParsedSIUService,
  ParsedSIUGeneralResource,
  ParsedSIULocationResource,
  ParsedSIUPersonnelResource,
} from "./SIU_S12_Parser";

export type {
  ParsedSIUPatient,
  ParsedSIUResources,
  ParsedSIUService,
  ParsedSIUGeneralResource,
  ParsedSIULocationResource,
  ParsedSIUPersonnelResource,
};
export type ParsedSIU_S13 = ParsedSIU_S12;

export class SIU_S13_Parser extends SIU_S12_Parser {}

export function parseSIU_S13(messageString: string): Result<ParsedSIU_S13> {
  return new SIU_S13_Parser().parse(messageString);
}
