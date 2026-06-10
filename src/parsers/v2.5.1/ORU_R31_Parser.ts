import { parseORU_R30 } from "./ORU_R30_Parser.ts";
import type { Result } from "../../types/result.ts";

export type {
  ParsedORU_R30 as ParsedORU_R31,
  ParsedPatientResultR30 as ParsedPatientResultR31,
  ParsedOrderObservationR30 as ParsedOrderObservationR31,
  ORU_R30_Parser as ORU_R31_Parser,
} from "./ORU_R30_Parser.ts";

export function parseORU_R31(
  messageString: string,
): ReturnType<typeof parseORU_R30> {
  return parseORU_R30(messageString);
}
