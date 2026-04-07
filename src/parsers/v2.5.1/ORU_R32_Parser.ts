import { parseORU_R30 } from "./ORU_R30_Parser";
import type { Result } from "../../types/result";

export type {
  ParsedORU_R30 as ParsedORU_R32,
  ParsedPatientResultR30 as ParsedPatientResultR32,
  ParsedOrderObservationR30 as ParsedOrderObservationR32,
  ORU_R30_Parser as ORU_R32_Parser,
} from "./ORU_R30_Parser";

export function parseORU_R32(
  messageString: string,
): ReturnType<typeof parseORU_R30> {
  return parseORU_R30(messageString);
}
