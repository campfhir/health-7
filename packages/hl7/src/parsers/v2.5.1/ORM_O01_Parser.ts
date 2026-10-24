import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { MSH } from "../../segments/v2.5.1/MSH";
import { NTE } from "../../segments/v2.5.1/NTE";
import { PID } from "../../segments/v2.5.1/PID";
import { PD1 } from "../../segments/v2.5.1/PD1";
import { PV1 } from "../../segments/v2.5.1/PV1";
import { PV2 } from "../../segments/v2.5.1/PV2";
import { IN1 } from "../../segments/v2.5.1/IN1";
import { IN2 } from "../../segments/v2.5.1/IN2";
import { IN3 } from "../../segments/v2.5.1/IN3";
import { GT1 } from "../../segments/v2.5.1/GT1";
import { AL1 } from "../../segments/v2.5.1/AL1";
import { ORC } from "../../segments/v2.5.1/ORC";
import { OBR } from "../../segments/v2.5.1/OBR";
import { RQD } from "../../segments/v2.5.1/RQD";
import { RQ1 } from "../../segments/v2.5.1/RQ1";
import { RXO } from "../../segments/v2.5.1/RXO";
import { ODS } from "../../segments/v2.5.1/ODS";
import { ODT } from "../../segments/v2.5.1/ODT";
import { CTD } from "../../segments/v2.5.1/CTD";
import { DG1 } from "../../segments/v2.5.1/DG1";
import { OBX } from "../../segments/v2.5.1/OBX";
import { FT1 } from "../../segments/v2.5.1/FT1";
import { CTI } from "../../segments/v2.5.1/CTI";
import { BLG } from "../../segments/v2.5.1/BLG";
import {
  ORM_O01_Parser as ORM_O01_Parser_base,
  ParsedORM_O01,
  ParsedOrderPatient,
  ParsedVisit,
  ParsedInsurance,
  ParsedOrder,
  ParsedOrderDetail,
  ParsedObservation,
} from "../v2.5/ORM_O01_Parser";

export type { ParsedORM_O01, ParsedOrderPatient, ParsedVisit, ParsedInsurance, ParsedOrder, ParsedOrderDetail, ParsedObservation };

export class ORM_O01_Parser extends ORM_O01_Parser_base {
  protected override parseMSH(s: string): Result<MSH> {
    return MSH.parse(s);
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

  protected override parseIN1(s: string, e: EncodingCharacters): Result<IN1> {
    return IN1.parse(s, e);
  }

  protected override parseIN2(s: string, e: EncodingCharacters): Result<IN2> {
    return IN2.parse(s, e);
  }

  protected override parseIN3(s: string, e: EncodingCharacters): Result<IN3> {
    return IN3.parse(s, e);
  }

  protected override parseGT1(s: string, e: EncodingCharacters): Result<GT1> {
    return GT1.parse(s, e);
  }

  protected override parseAL1(s: string, e: EncodingCharacters): Result<AL1> {
    return AL1.parse(s, e);
  }

  protected override parseORC(s: string, e: EncodingCharacters): Result<ORC> {
    return ORC.parse(s, e);
  }

  protected override parseOBR(s: string, e: EncodingCharacters): Result<OBR> {
    return OBR.parse(s, e);
  }

  protected override parseRQD(s: string, e: EncodingCharacters): Result<RQD> {
    return RQD.parse(s, e);
  }

  protected override parseRQ1(s: string, e: EncodingCharacters): Result<RQ1> {
    return RQ1.parse(s, e);
  }

  protected override parseRXO(s: string, e: EncodingCharacters): Result<RXO> {
    return RXO.parse(s, e);
  }

  protected override parseODS(s: string, e: EncodingCharacters): Result<ODS> {
    return ODS.parse(s, e);
  }

  protected override parseODT(s: string, e: EncodingCharacters): Result<ODT> {
    return ODT.parse(s, e);
  }

  protected override parseCTD(s: string, e: EncodingCharacters): Result<CTD> {
    return CTD.parse(s, e);
  }

  protected override parseDG1(s: string, e: EncodingCharacters): Result<DG1> {
    return DG1.parse(s, e);
  }

  protected override parseOBX(s: string, e: EncodingCharacters): Result<OBX> {
    return OBX.parse(s, e);
  }

  protected override parseFT1(s: string, e: EncodingCharacters): Result<FT1> {
    return FT1.parse(s, e);
  }

  protected override parseCTI(s: string, e: EncodingCharacters): Result<CTI> {
    return CTI.parse(s, e);
  }

  protected override parseBLG(s: string, e: EncodingCharacters): Result<BLG> {
    return BLG.parse(s, e);
  }
}

export function parseORM_O01(messageString: string): Result<ParsedORM_O01> {
  return new ORM_O01_Parser().parse(messageString);
}
