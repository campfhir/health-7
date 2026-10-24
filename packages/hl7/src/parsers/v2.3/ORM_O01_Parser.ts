/**
 * Parser for ORM^O01 messages (HL7 v2.3).
 *
 * Structure:
 *   MSH [{NTE}]
 *   [ PID [PD1] [{NTE}] [ PV1 [PV2] ] [{ IN1 [IN2] [IN3] }] [GT1] [{AL1}] ]
 *   { ORC
 *     [ <OBR|RQD|RQ1|RXO|ODS|ODT> [{NTE}] [{DG1}] [{ OBX [{NTE}] }] ]
 *     [{CTI}] [BLG] }
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { MSH } from "../../segments/v2.3/MSH.ts";
import { NTE } from "../../segments/v2.3/NTE.ts";
import { PID } from "../../segments/v2.3/PID.ts";
import { PD1 } from "../../segments/v2.3/PD1.ts";
import { PV1 } from "../../segments/v2.3/PV1.ts";
import { PV2 } from "../../segments/v2.3/PV2.ts";
import { IN1 } from "../../segments/v2.3/IN1.ts";
import { IN2 } from "../../segments/v2.3/IN2.ts";
import { IN3 } from "../../segments/v2.3/IN3.ts";
import { GT1 } from "../../segments/v2.3/GT1.ts";
import { AL1 } from "../../segments/v2.3/AL1.ts";
import { ORC } from "../../segments/v2.3/ORC.ts";
import { OBR } from "../../segments/v2.3/OBR.ts";
import { RQD } from "../../segments/v2.3/RQD.ts";
import { RQ1 } from "../../segments/v2.3/RQ1.ts";
import { RXO } from "../../segments/v2.3/RXO.ts";
import { ODS } from "../../segments/v2.3/ODS.ts";
import { ODT } from "../../segments/v2.3/ODT.ts";
import { DG1 } from "../../segments/v2.3/DG1.ts";
import { OBX } from "../../segments/v2.3/OBX.ts";
import { CTI } from "../../segments/v2.3/CTI.ts";
import { BLG } from "../../segments/v2.3/BLG.ts";
import type { HL7Message } from "../../types/message.ts";
import type { Segment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import {
  misplacedSegment,
  readMessageHeader,
  segmentParseFailure,
} from "../../utils/messageParsing.ts";

/** The order detail segment of an order: one of OBR, RQD, RQ1, RXO, ODS or ODT. */
export type OrderDetailSegment = OBR | RQD | RQ1 | RXO | ODS | ODT;

/** An OBX with the NTE segments that follow it. */
export interface ParsedObservation {
  /** The obx value. */
  obx: OBX;
  /** The notes value. */
  notes: NTE[];
}

/** The order detail segment with its notes, diagnoses and observations. */
export interface ParsedOrderDetail {
  /** The order detail segment (OBR, RQD, RQ1, RXO, ODS or ODT). */
  segment: OrderDetailSegment;
  /** The notes value. */
  notes: NTE[];
  /** The diagnoses value. */
  diagnoses: DG1[];
  /** The observations value. */
  observations: ParsedObservation[];
}

/** A repeating ORC group. */
export interface ParsedOrder {
  /** The orc value. */
  orc: ORC;
  /** The detail value. */
  detail?: ParsedOrderDetail;
  /** The clinical trial identification segments. */
  ctiList: CTI[];
  /** The blg value. */
  blg?: BLG;
}

/** The PV1/PV2 pair. */
export interface ParsedVisit {
  /** The pv1 value. */
  pv1: PV1;
  /** The pv2 value. */
  pv2?: PV2;
}

/** A repeating IN1 group. */
export interface ParsedInsurance {
  /** The in1 value. */
  in1: IN1;
  /** The in2 value. */
  in2?: IN2;
  /** The in3 value. */
  in3?: IN3;
}

/** The optional patient group. */
export interface ParsedOrderPatient {
  /** The pid value. */
  pid: PID;
  /** The pd1 value. */
  pd1?: PD1;
  /** The notes value. */
  notes: NTE[];
  /** The visit value. */
  visit?: ParsedVisit;
  /** The insurance value. */
  insurance: ParsedInsurance[];
  /** The gt1 value. */
  gt1?: GT1;
  /** The allergies value. */
  allergies: AL1[];
}

/** Structured result of parsing an HL7 ORM^O01 (v2.3) message. */
export interface ParsedORM_O01 {
  /** The message value. */
  message: HL7Message;
  /** The msh value. */
  msh: MSH;
  /** The notes that follow MSH. */
  notes: NTE[];
  /** The patient value. */
  patient?: ParsedOrderPatient;
  /** The orders value. */
  orders: ParsedOrder[];
}

/** Where the previous segment left the parser, which decides what an NTE belongs to. */
type Context = "header" | "patient" | "detail" | "observation" | "other";

/** Parser for HL7 ORM^O01 (v2.3) messages. */
export class ORM_O01_Parser {
  /** Parse msh. */
  protected parseMSH(s: string): Result<MSH> {
    return MSH.parse(s);
  }
  /** Parse nte. */
  protected parseNTE(s: string, e: EncodingCharacters): Result<NTE> {
    return NTE.parse(s, e);
  }
  /** Parse pid. */
  protected parsePID(s: string, e: EncodingCharacters): Result<PID> {
    return PID.parse(s, e);
  }
  /** Parse pd1. */
  protected parsePD1(s: string, e: EncodingCharacters): Result<PD1> {
    return PD1.parse(s, e);
  }
  /** Parse pv1. */
  protected parsePV1(s: string, e: EncodingCharacters): Result<PV1> {
    return PV1.parse(s, e);
  }
  /** Parse pv2. */
  protected parsePV2(s: string, e: EncodingCharacters): Result<PV2> {
    return PV2.parse(s, e);
  }
  /** Parse in1. */
  protected parseIN1(s: string, e: EncodingCharacters): Result<IN1> {
    return IN1.parse(s, e);
  }
  /** Parse in2. */
  protected parseIN2(s: string, e: EncodingCharacters): Result<IN2> {
    return IN2.parse(s, e);
  }
  /** Parse in3. */
  protected parseIN3(s: string, e: EncodingCharacters): Result<IN3> {
    return IN3.parse(s, e);
  }
  /** Parse gt1. */
  protected parseGT1(s: string, e: EncodingCharacters): Result<GT1> {
    return GT1.parse(s, e);
  }
  /** Parse al1. */
  protected parseAL1(s: string, e: EncodingCharacters): Result<AL1> {
    return AL1.parse(s, e);
  }
  /** Parse orc. */
  protected parseORC(s: string, e: EncodingCharacters): Result<ORC> {
    return ORC.parse(s, e);
  }
  /** Parse obr. */
  protected parseOBR(s: string, e: EncodingCharacters): Result<OBR> {
    return OBR.parse(s, e);
  }
  /** Parse rqd. */
  protected parseRQD(s: string, e: EncodingCharacters): Result<RQD> {
    return RQD.parse(s, e);
  }
  /** Parse rq1. */
  protected parseRQ1(s: string, e: EncodingCharacters): Result<RQ1> {
    return RQ1.parse(s, e);
  }
  /** Parse rxo. */
  protected parseRXO(s: string, e: EncodingCharacters): Result<RXO> {
    return RXO.parse(s, e);
  }
  /** Parse ods. */
  protected parseODS(s: string, e: EncodingCharacters): Result<ODS> {
    return ODS.parse(s, e);
  }
  /** Parse odt. */
  protected parseODT(s: string, e: EncodingCharacters): Result<ODT> {
    return ODT.parse(s, e);
  }
  /** Parse dg1. */
  protected parseDG1(s: string, e: EncodingCharacters): Result<DG1> {
    return DG1.parse(s, e);
  }
  /** Parse obx. */
  protected parseOBX(s: string, e: EncodingCharacters): Result<OBX> {
    return OBX.parse(s, e);
  }
  /** Parse cti. */
  protected parseCTI(s: string, e: EncodingCharacters): Result<CTI> {
    return CTI.parse(s, e);
  }
  /** Parse blg. */
  protected parseBLG(s: string, e: EncodingCharacters): Result<BLG> {
    return BLG.parse(s, e);
  }

  /** Parses the input string into a structured instance. */
  parse(messageString: string): Result<ParsedORM_O01> {
    try {
      const header = readMessageHeader(messageString, (s) => this.parseMSH(s));
      if (!header.ok || !header.val) return header as Result<never>;
      const { segments, msh, encoding, message } = header.val;

      const notes: NTE[] = [];
      let patient: ParsedOrderPatient | undefined;
      let visit: ParsedVisit | undefined;
      let insurance: ParsedInsurance | undefined;
      const orders: ParsedOrder[] = [];
      let order: ParsedOrder | undefined;
      let observation: ParsedObservation | undefined;
      let ctx: Context = "header";

      for (let i = 1; i < segments.length; i++) {
        const segmentStr = segments[i];
        const segmentType = segmentStr.substring(0, 3);
        const line = i + 1;
        // Parses the segment with the matching protected method and records it.
        const read = <T extends Segment>(
          fn: (s: string, e: EncodingCharacters) => Result<T>,
        ): Result<T> => {
          const result = fn.call(this, segmentStr, encoding);
          if (result.ok && result.val) message.addSegment(result.val);
          return result;
        };

        switch (segmentType) {
          case "NTE": {
            const result = read(this.parseNTE);
            if (!result.ok || !result.val) return segmentParseFailure("NTE", line, result);
            const nte = result.val;
            if (ctx === "header") notes.push(nte);
            else if (ctx === "patient" && patient) patient.notes.push(nte);
            else if (ctx === "detail" && order?.detail) order.detail.notes.push(nte);
            else if (ctx === "observation" && observation) observation.notes.push(nte);
            else return misplacedSegment("NTE", line, "is not allowed at this position");
            break;
          }

          case "PID": {
            const result = read(this.parsePID);
            if (!result.ok || !result.val) return segmentParseFailure("PID", line, result);
            if (patient || order) {
              return misplacedSegment("PID", line, "must appear once, before the first ORC");
            }
            patient = { pid: result.val, notes: [], insurance: [], allergies: [] };
            ctx = "patient";
            break;
          }

          case "PD1": {
            const result = read(this.parsePD1);
            if (!result.ok || !result.val) return segmentParseFailure("PD1", line, result);
            if (!patient) return misplacedSegment("PD1", line, "found without preceding PID segment");
            patient.pd1 = result.val;
            ctx = "patient";
            break;
          }

          case "PV1": {
            const result = read(this.parsePV1);
            if (!result.ok || !result.val) return segmentParseFailure("PV1", line, result);
            if (!patient) return misplacedSegment("PV1", line, "found without preceding PID segment");
            visit = { pv1: result.val };
            patient.visit = visit;
            ctx = "other";
            break;
          }

          case "PV2": {
            const result = read(this.parsePV2);
            if (!result.ok || !result.val) return segmentParseFailure("PV2", line, result);
            if (!visit) return misplacedSegment("PV2", line, "found without preceding PV1 segment");
            visit.pv2 = result.val;
            ctx = "other";
            break;
          }

          case "IN1": {
            const result = read(this.parseIN1);
            if (!result.ok || !result.val) return segmentParseFailure("IN1", line, result);
            if (!patient) return misplacedSegment("IN1", line, "found without preceding PID segment");
            insurance = { in1: result.val };
            patient.insurance.push(insurance);
            ctx = "other";
            break;
          }

          case "IN2": {
            const result = read(this.parseIN2);
            if (!result.ok || !result.val) return segmentParseFailure("IN2", line, result);
            if (!insurance) return misplacedSegment("IN2", line, "found without preceding IN1 segment");
            insurance.in2 = result.val;
            ctx = "other";
            break;
          }

          case "IN3": {
            const result = read(this.parseIN3);
            if (!result.ok || !result.val) return segmentParseFailure("IN3", line, result);
            if (!insurance) return misplacedSegment("IN3", line, "found without preceding IN1 segment");
            insurance.in3 = result.val;
            ctx = "other";
            break;
          }

          case "GT1": {
            const result = read(this.parseGT1);
            if (!result.ok || !result.val) return segmentParseFailure("GT1", line, result);
            if (!patient) return misplacedSegment("GT1", line, "found without preceding PID segment");
            patient.gt1 = result.val;
            ctx = "other";
            break;
          }

          case "AL1": {
            const result = read(this.parseAL1);
            if (!result.ok || !result.val) return segmentParseFailure("AL1", line, result);
            if (!patient) return misplacedSegment("AL1", line, "found without preceding PID segment");
            patient.allergies.push(result.val);
            ctx = "other";
            break;
          }

          case "ORC": {
            const result = read(this.parseORC);
            if (!result.ok || !result.val) return segmentParseFailure("ORC", line, result);
            order = { orc: result.val, ctiList: [] };
            orders.push(order);
            observation = undefined;
            ctx = "other";
            break;
          }

          case "OBR":
          case "RQD":
          case "RQ1":
          case "RXO":
          case "ODS":
          case "ODT": {
            const result: Result<OrderDetailSegment> =
              segmentType === "OBR" ? read(this.parseOBR)
              : segmentType === "RQD" ? read(this.parseRQD)
              : segmentType === "RQ1" ? read(this.parseRQ1)
              : segmentType === "RXO" ? read(this.parseRXO)
              : segmentType === "ODS" ? read(this.parseODS)
              : read(this.parseODT);
            if (!result.ok || !result.val) return segmentParseFailure(segmentType, line, result);
            if (!order) return misplacedSegment(segmentType, line, "found without preceding ORC segment");
            if (order.detail) {
              return misplacedSegment(segmentType, line, "is a second order detail segment for the same ORC");
            }
            order.detail = { segment: result.val, notes: [], diagnoses: [], observations: [] };
            ctx = "detail";
            break;
          }

          case "DG1": {
            const result = read(this.parseDG1);
            if (!result.ok || !result.val) return segmentParseFailure("DG1", line, result);
            if (!order?.detail) return misplacedSegment("DG1", line, "found without a preceding order detail segment");
            order.detail.diagnoses.push(result.val);
            ctx = "other";
            break;
          }

          case "OBX": {
            const result = read(this.parseOBX);
            if (!result.ok || !result.val) return segmentParseFailure("OBX", line, result);
            if (!order?.detail) return misplacedSegment("OBX", line, "found without a preceding order detail segment");
            observation = { obx: result.val, notes: [] };
            order.detail.observations.push(observation);
            ctx = "observation";
            break;
          }

          case "CTI": {
            const result = read(this.parseCTI);
            if (!result.ok || !result.val) return segmentParseFailure("CTI", line, result);
            if (!order) return misplacedSegment("CTI", line, "found without preceding ORC segment");
            order.ctiList.push(result.val);
            ctx = "other";
            break;
          }

          case "BLG": {
            const result = read(this.parseBLG);
            if (!result.ok || !result.val) return segmentParseFailure("BLG", line, result);
            if (!order) return misplacedSegment("BLG", line, "found without preceding ORC segment");
            order.blg = result.val;
            ctx = "other";
            break;
          }

          default:
            console.warn(
              `Skipping unsupported segment type '${segmentType}' at line ${line}`,
            );
            break;
        }
      }

      if (orders.length === 0) {
        return {
          ok: false,
          err: new Err("ORM_O01 message must contain at least one order (ORC)"),
        };
      }

      return { ok: true, val: { message, msh, notes, patient, orders } };
    } catch (error) {
      return {
        ok: false,
        err: new Err(`Failed to parse ORM_O01 message: ${error}`),
      };
    }
  }
}

/** Parses an HL7 ORM^O01 (v2.3) message string into a structured result. */
export function parseORM_O01(messageString: string): Result<ParsedORM_O01> {
  return new ORM_O01_Parser().parse(messageString);
}
