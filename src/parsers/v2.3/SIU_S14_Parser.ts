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
export type ParsedSIU_S14 = ParsedSIU_S12;

export class SIU_S14_Parser extends SIU_S12_Parser {}

export function parseSIU_S14(messageString: string): Result<ParsedSIU_S14> {
  return new SIU_S14_Parser().parse(messageString);
}
