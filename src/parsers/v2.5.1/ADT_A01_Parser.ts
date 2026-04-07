import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { MSH } from "../../segments/v2.5.1/MSH";
import { EVN } from "../../segments/v2.5.1/EVN";
import { PID } from "../../segments/v2.5.1/PID";
import { PD1 } from "../../segments/v2.5.1/PD1";
import { ROL } from "../../segments/v2.5.1/ROL";
import { NK1 } from "../../segments/v2.5.1/NK1";
import { PV1 } from "../../segments/v2.5.1/PV1";
import { PV2 } from "../../segments/v2.5.1/PV2";
import { DB1 } from "../../segments/v2.5.1/DB1";
import { OBX } from "../../segments/v2.5.1/OBX";
import { AL1 } from "../../segments/v2.5.1/AL1";
import { DG1 } from "../../segments/v2.5.1/DG1";
import { DRG } from "../../segments/v2.5.1/DRG";
import { PR1 } from "../../segments/v2.5.1/PR1";
import { GT1 } from "../../segments/v2.5.1/GT1";
import { IN1 } from "../../segments/v2.5.1/IN1";
import { IN2 } from "../../segments/v2.5.1/IN2";
import { IN3 } from "../../segments/v2.5.1/IN3";
import { ACC } from "../../segments/v2.5.1/ACC";
import { UB1 } from "../../segments/v2.5.1/UB1";
import { UB2 } from "../../segments/v2.5.1/UB2";
import {
  ADT_A01_Parser as ADT_A01_Parser_base,
  ParsedADT_A01,
  ParsedProcedure,
  ParsedInsuranceGroup,
} from "../v2.3/ADT_A01_Parser";

export type { ParsedADT_A01, ParsedProcedure, ParsedInsuranceGroup };

export class ADT_A01_Parser extends ADT_A01_Parser_base {
  protected override parseMSH(s: string): Result<MSH> {
    return MSH.parse(s);
  }

  protected override parseEVN(s: string, e: EncodingCharacters): Result<EVN> {
    return EVN.parse(s, e);
  }

  protected override parsePID(s: string, e: EncodingCharacters): Result<PID> {
    return PID.parse(s, e);
  }

  protected override parsePD1(s: string, e: EncodingCharacters): Result<PD1> {
    return PD1.parse(s, e);
  }

  protected override parseROL(s: string, e: EncodingCharacters): Result<ROL> {
    return ROL.parse(s, e);
  }

  protected override parseNK1(s: string, e: EncodingCharacters): Result<NK1> {
    return NK1.parse(s, e);
  }

  protected override parsePV1(s: string, e: EncodingCharacters): Result<PV1> {
    return PV1.parse(s, e);
  }

  protected override parsePV2(s: string, e: EncodingCharacters): Result<PV2> {
    return PV2.parse(s, e);
  }

  protected override parseDB1(s: string, e: EncodingCharacters): Result<DB1> {
    return DB1.parse(s, e);
  }

  protected override parseOBX(s: string, e: EncodingCharacters): Result<OBX> {
    return OBX.parse(s, e);
  }

  protected override parseAL1(s: string, e: EncodingCharacters): Result<AL1> {
    return AL1.parse(s, e);
  }

  protected override parseDG1(s: string, e: EncodingCharacters): Result<DG1> {
    return DG1.parse(s, e);
  }

  protected override parseDRG(s: string, e: EncodingCharacters): Result<DRG> {
    return DRG.parse(s, e);
  }

  protected override parsePR1(s: string, e: EncodingCharacters): Result<PR1> {
    return PR1.parse(s, e);
  }

  protected override parseGT1(s: string, e: EncodingCharacters): Result<GT1> {
    return GT1.parse(s, e);
  }

  protected override parseIN1(s: string, e: EncodingCharacters): Result<IN1> {
    return IN1.parse(s, e);
  }

  protected override parseIN2(s: string, e: EncodingCharacters): Result<IN2> {
    return IN2.parse(s, e);
  }

  protected override parseIN3(s: string, e: EncodingCharacters): Result<IN3> {
    return IN3.parse(s, e);
  }

  protected override parseACC(s: string, e: EncodingCharacters): Result<ACC> {
    return ACC.parse(s, e);
  }

  protected override parseUB1(s: string, e: EncodingCharacters): Result<UB1> {
    return UB1.parse(s, e);
  }

  protected override parseUB2(s: string, e: EncodingCharacters): Result<UB2> {
    return UB2.parse(s, e);
  }
}

export function parseADT_A01(messageString: string): Result<ParsedADT_A01> {
  return new ADT_A01_Parser().parse(messageString);
}
