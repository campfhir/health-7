import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { MSH } from "../../segments/v2.5.1/MSH";
import { SCH } from "../../segments/v2.5.1/SCH";
import { NTE } from "../../segments/v2.5.1/NTE";
import { PID } from "../../segments/v2.5.1/PID";
import { PD1 } from "../../segments/v2.5.1/PD1";
import { PV1 } from "../../segments/v2.5.1/PV1";
import { PV2 } from "../../segments/v2.5.1/PV2";
import { OBX } from "../../segments/v2.5.1/OBX";
import { DG1 } from "../../segments/v2.5.1/DG1";
import { RGS } from "../../segments/v2.5.1/RGS";
import { AIS } from "../../segments/v2.5.1/AIS";
import { AIG } from "../../segments/v2.5.1/AIG";
import { AIL } from "../../segments/v2.5.1/AIL";
import { AIP } from "../../segments/v2.5.1/AIP";
import {
  SIU_S17_Parser as SIU_S17_Parser_base,
  ParsedSIU_S17,
  ParsedSIUPatient,
  ParsedSIUResources,
  ParsedSIUService,
  ParsedSIUGeneralResource,
  ParsedSIULocationResource,
  ParsedSIUPersonnelResource,
} from "../v2.3/SIU_S17_Parser";

export type { ParsedSIU_S17, ParsedSIUPatient, ParsedSIUResources, ParsedSIUService, ParsedSIUGeneralResource, ParsedSIULocationResource, ParsedSIUPersonnelResource };

export class SIU_S17_Parser extends SIU_S17_Parser_base {
  protected override parseMSH(s: string): Result<MSH> {
    return MSH.parse(s);
  }

  protected override parseSCH(s: string, e: EncodingCharacters): Result<SCH> {
    return SCH.parse(s, e);
  }

  protected override parseNTE(s: string, e: EncodingCharacters): Result<NTE> {
    return NTE.parse(s, e);
  }

  protected override parsePID(s: string, e: EncodingCharacters): Result<PID> {
    return PID.parse(s, e);
  }

  protected override parsePD1(s: string, e: EncodingCharacters): Result<PD1> {
    return PD1.parse(s, e);
  }

  protected override parsePV1(s: string, e: EncodingCharacters): Result<PV1> {
    return PV1.parse(s, e);
  }

  protected override parsePV2(s: string, e: EncodingCharacters): Result<PV2> {
    return PV2.parse(s, e);
  }

  protected override parseOBX(s: string, e: EncodingCharacters): Result<OBX> {
    return OBX.parse(s, e);
  }

  protected override parseDG1(s: string, e: EncodingCharacters): Result<DG1> {
    return DG1.parse(s, e);
  }

  protected override parseRGS(s: string, e: EncodingCharacters): Result<RGS> {
    return RGS.parse(s, e);
  }

  protected override parseAIS(s: string, e: EncodingCharacters): Result<AIS> {
    return AIS.parse(s, e);
  }

  protected override parseAIG(s: string, e: EncodingCharacters): Result<AIG> {
    return AIG.parse(s, e);
  }

  protected override parseAIL(s: string, e: EncodingCharacters): Result<AIL> {
    return AIL.parse(s, e);
  }

  protected override parseAIP(s: string, e: EncodingCharacters): Result<AIP> {
    return AIP.parse(s, e);
  }
}

export function parseSIU_S17(messageString: string): Result<ParsedSIU_S17> {
  return new SIU_S17_Parser().parse(messageString);
}
