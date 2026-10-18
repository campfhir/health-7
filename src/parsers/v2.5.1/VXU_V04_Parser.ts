import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { MSH } from "../../segments/v2.5.1/MSH";
import { SFT } from "../../segments/v2.5.1/SFT";
import { PID } from "../../segments/v2.5.1/PID";
import { PD1 } from "../../segments/v2.5.1/PD1";
import { NK1 } from "../../segments/v2.5.1/NK1";
import { PV1 } from "../../segments/v2.5.1/PV1";
import { PV2 } from "../../segments/v2.5.1/PV2";
import { GT1 } from "../../segments/v2.5.1/GT1";
import { IN1 } from "../../segments/v2.5.1/IN1";
import { IN2 } from "../../segments/v2.5.1/IN2";
import { IN3 } from "../../segments/v2.5.1/IN3";
import { ORC } from "../../segments/v2.5.1/ORC";
import { TQ1 } from "../../segments/v2.5.1/TQ1";
import { TQ2 } from "../../segments/v2.5.1/TQ2";
import { RXA } from "../../segments/v2.5.1/RXA";
import { RXR } from "../../segments/v2.5.1/RXR";
import { OBX } from "../../segments/v2.5.1/OBX";
import { NTE } from "../../segments/v2.5.1/NTE";
import {
  VXU_V04_Parser as VXU_V04_Parser_base,
  ParsedVXU_V04,
  ParsedVisit,
  ParsedInsurance,
  ParsedVaccination,
  ParsedTiming,
  ParsedObservation,
} from "../v2.5/VXU_V04_Parser";

export type { ParsedVXU_V04, ParsedVisit, ParsedInsurance, ParsedVaccination, ParsedTiming, ParsedObservation };

export class VXU_V04_Parser extends VXU_V04_Parser_base {
  protected override parseMSH(s: string): Result<MSH> {
    return MSH.parse(s);
  }

  protected override parseSFT(s: string, e: EncodingCharacters): Result<SFT> {
    return SFT.parse(s, e);
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

  protected override parsePV1(s: string, e: EncodingCharacters): Result<PV1> {
    return PV1.parse(s, e);
  }

  protected override parsePV2(s: string, e: EncodingCharacters): Result<PV2> {
    return PV2.parse(s, e);
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

  protected override parseORC(s: string, e: EncodingCharacters): Result<ORC> {
    return ORC.parse(s, e);
  }

  protected override parseTQ1(s: string, e: EncodingCharacters): Result<TQ1> {
    return TQ1.parse(s, e);
  }

  protected override parseTQ2(s: string, e: EncodingCharacters): Result<TQ2> {
    return TQ2.parse(s, e);
  }

  protected override parseRXA(s: string, e: EncodingCharacters): Result<RXA> {
    return RXA.parse(s, e);
  }

  protected override parseRXR(s: string, e: EncodingCharacters): Result<RXR> {
    return RXR.parse(s, e);
  }

  protected override parseOBX(s: string, e: EncodingCharacters): Result<OBX> {
    return OBX.parse(s, e);
  }

  protected override parseNTE(s: string, e: EncodingCharacters): Result<NTE> {
    return NTE.parse(s, e);
  }
}

export function parseVXU_V04(messageString: string): Result<ParsedVXU_V04> {
  return new VXU_V04_Parser().parse(messageString);
}
