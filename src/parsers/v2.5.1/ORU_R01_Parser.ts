import { Result } from "../../types/result";
import { MSH } from "../../segments/v2.5.1/MSH";
import { PID } from "../../segments/v2.5.1/PID";
import { PV1 } from "../../segments/v2.5.1/PV1";
import { ORC } from "../../segments/v2.5.1/ORC";
import { OBR } from "../../segments/v2.5.1/OBR";
import { OBX } from "../../segments/v2.5.1/OBX";
import { NTE } from "../../segments/v2.5.1/NTE";
import { NK1 } from "../../segments/v2.5.1/NK1";
import { PD1 } from "../../segments/v2.5.1/PD1";
import { EncodingCharacters } from "../../types/encoding";
import {
  ORU_R01_Parser as ORU_R01_Parser_v23,
  ParsedOrderObservation,
  ParsedPatientResult,
  ParsedORU_R01,
} from "../v2.3/ORU_R01_Parser";

export type { ParsedOrderObservation, ParsedPatientResult, ParsedORU_R01 };

export class ORU_R01_Parser extends ORU_R01_Parser_v23 {
  protected override parseMSH(s: string): Result<MSH> {
    return MSH.parse(s);
  }
  protected override parsePID(s: string, e: EncodingCharacters): Result<PID> {
    return PID.parse(s, e);
  }
  protected override parsePD1(s: string, e: EncodingCharacters): Result<PD1> {
    return PD1.parse(s, e);
  }
  protected override parseNK1(s: string, e: EncodingCharacters): Result<NK1> {
    return NK1.parse(s, e);
  }
  protected override parseNTE(s: string, e: EncodingCharacters): Result<NTE> {
    return NTE.parse(s, e);
  }
  protected override parsePV1(s: string, e: EncodingCharacters): Result<PV1> {
    return PV1.parse(s, e);
  }
  protected override parseORC(s: string, e: EncodingCharacters): Result<ORC> {
    return ORC.parse(s, e);
  }
  protected override parseOBR(s: string, e: EncodingCharacters): Result<OBR> {
    return OBR.parse(s, e);
  }
  protected override parseOBX(s: string, e: EncodingCharacters): Result<OBX> {
    return OBX.parse(s, e);
  }
}

export function parseORU_R01(messageString: string): Result<ParsedORU_R01> {
  return new ORU_R01_Parser().parse(messageString);
}
