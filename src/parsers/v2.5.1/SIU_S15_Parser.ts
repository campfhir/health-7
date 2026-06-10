/**
 * Parser for SIU^S15 messages (HL7 v2.5.1).
 *
 * @module
 */
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { MSH } from "../../segments/v2.5.1/MSH.ts";
import { SCH } from "../../segments/v2.5.1/SCH.ts";
import { NTE } from "../../segments/v2.5.1/NTE.ts";
import { PID } from "../../segments/v2.5.1/PID.ts";
import { PD1 } from "../../segments/v2.5.1/PD1.ts";
import { PV1 } from "../../segments/v2.5.1/PV1.ts";
import { PV2 } from "../../segments/v2.5.1/PV2.ts";
import { OBX } from "../../segments/v2.5.1/OBX.ts";
import { DG1 } from "../../segments/v2.5.1/DG1.ts";
import { RGS } from "../../segments/v2.5.1/RGS.ts";
import { AIS } from "../../segments/v2.5.1/AIS.ts";
import { AIG } from "../../segments/v2.5.1/AIG.ts";
import { AIL } from "../../segments/v2.5.1/AIL.ts";
import { AIP } from "../../segments/v2.5.1/AIP.ts";
import {
  SIU_S15_Parser as SIU_S15_Parser_base,
  type ParsedSIU_S15,
  type ParsedSIUPatient,
  type ParsedSIUResources,
  type ParsedSIUService,
  type ParsedSIUGeneralResource,
  type ParsedSIULocationResource,
  type ParsedSIUPersonnelResource,
} from "../v2.3/SIU_S15_Parser.ts";

export type { ParsedSIU_S15, ParsedSIUPatient, ParsedSIUResources, ParsedSIUService, ParsedSIUGeneralResource, ParsedSIULocationResource, ParsedSIUPersonnelResource };

/** Parser for HL7 SIU^S15 (v2.5.1) messages. */
export class SIU_S15_Parser extends SIU_S15_Parser_base {
  /** Parse msh. */
  protected override parseMSH(s: string): Result<MSH> {
    return MSH.parse(s);
  }

  /** Parse sch. */
  protected override parseSCH(s: string, e: EncodingCharacters): Result<SCH> {
    return SCH.parse(s, e);
  }

  /** Parse nte. */
  protected override parseNTE(s: string, e: EncodingCharacters): Result<NTE> {
    return NTE.parse(s, e);
  }

  /** Parse pid. */
  protected override parsePID(s: string, e: EncodingCharacters): Result<PID> {
    return PID.parse(s, e);
  }

  /** Parse pd1. */
  protected override parsePD1(s: string, e: EncodingCharacters): Result<PD1> {
    return PD1.parse(s, e);
  }

  /** Parse pv1. */
  protected override parsePV1(s: string, e: EncodingCharacters): Result<PV1> {
    return PV1.parse(s, e);
  }

  /** Parse pv2. */
  protected override parsePV2(s: string, e: EncodingCharacters): Result<PV2> {
    return PV2.parse(s, e);
  }

  /** Parse obx. */
  protected override parseOBX(s: string, e: EncodingCharacters): Result<OBX> {
    return OBX.parse(s, e);
  }

  /** Parse dg1. */
  protected override parseDG1(s: string, e: EncodingCharacters): Result<DG1> {
    return DG1.parse(s, e);
  }

  /** Parse rgs. */
  protected override parseRGS(s: string, e: EncodingCharacters): Result<RGS> {
    return RGS.parse(s, e);
  }

  /** Parse ais. */
  protected override parseAIS(s: string, e: EncodingCharacters): Result<AIS> {
    return AIS.parse(s, e);
  }

  /** Parse aig. */
  protected override parseAIG(s: string, e: EncodingCharacters): Result<AIG> {
    return AIG.parse(s, e);
  }

  /** Parse ail. */
  protected override parseAIL(s: string, e: EncodingCharacters): Result<AIL> {
    return AIL.parse(s, e);
  }

  /** Parse aip. */
  protected override parseAIP(s: string, e: EncodingCharacters): Result<AIP> {
    return AIP.parse(s, e);
  }
}

/** Parses an HL7 SIU^S15 (v2.5.1) message string into a structured result. */
export function parseSIU_S15(messageString: string): Result<ParsedSIU_S15> {
  return new SIU_S15_Parser().parse(messageString);
}
