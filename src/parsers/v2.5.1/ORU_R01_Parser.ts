/**
 * Parser for ORU^R01 messages (HL7 v2.5.1).
 *
 * @module
 */
import type { Result } from "../../types/result.ts";
import { MSH } from "../../segments/v2.5.1/MSH.ts";
import { PID } from "../../segments/v2.5.1/PID.ts";
import { PV1 } from "../../segments/v2.5.1/PV1.ts";
import { ORC } from "../../segments/v2.5.1/ORC.ts";
import { OBR } from "../../segments/v2.5.1/OBR.ts";
import { OBX } from "../../segments/v2.5.1/OBX.ts";
import { NTE } from "../../segments/v2.5.1/NTE.ts";
import { NK1 } from "../../segments/v2.5.1/NK1.ts";
import { PD1 } from "../../segments/v2.5.1/PD1.ts";
import { CTI } from "../../segments/v2.5.1/CTI.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import {
  ORU_R01_Parser as ORU_R01_Parser_v23,
  type ParsedOrderObservation,
  type ParsedPatientResult,
  type ParsedORU_R01,
} from "../v2.3/ORU_R01_Parser.ts";

export type { ParsedOrderObservation, ParsedPatientResult, ParsedORU_R01 };

/** Parser for HL7 ORU^R01 (v2.5.1) messages. */
export class ORU_R01_Parser extends ORU_R01_Parser_v23 {
  /** Parse msh. */
  protected override parseMSH(s: string): Result<MSH> {
    return MSH.parse(s);
  }
  /** Parse pid. */
  protected override parsePID(s: string, e: EncodingCharacters): Result<PID> {
    return PID.parse(s, e);
  }
  /** Parse pd1. */
  protected override parsePD1(s: string, e: EncodingCharacters): Result<PD1> {
    return PD1.parse(s, e);
  }
  /** Parse nk1. */
  protected override parseNK1(s: string, e: EncodingCharacters): Result<NK1> {
    return NK1.parse(s, e);
  }
  /** Parse nte. */
  protected override parseNTE(s: string, e: EncodingCharacters): Result<NTE> {
    return NTE.parse(s, e);
  }
  /** Parse pv1. */
  protected override parsePV1(s: string, e: EncodingCharacters): Result<PV1> {
    return PV1.parse(s, e);
  }
  /** Parse orc. */
  protected override parseORC(s: string, e: EncodingCharacters): Result<ORC> {
    return ORC.parse(s, e);
  }
  /** Parse obr. */
  protected override parseOBR(s: string, e: EncodingCharacters): Result<OBR> {
    return OBR.parse(s, e);
  }
  /** Parse obx. */
  protected override parseOBX(s: string, e: EncodingCharacters): Result<OBX> {
    return OBX.parse(s, e);
  }
  /** Parse cti. */
  protected override parseCTI(s: string, e: EncodingCharacters): Result<CTI> {
    return CTI.parse(s, e);
  }
}

/** Parses an HL7 ORU^R01 (v2.5.1) message string into a structured result. */
export function parseORU_R01(messageString: string): Result<ParsedORU_R01> {
  return new ORU_R01_Parser().parse(messageString);
}
