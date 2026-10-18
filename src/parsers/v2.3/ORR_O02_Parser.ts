/**
 * Parser for ORR^O02 messages (HL7 v2.3).
 *
 * Structure:
 *   MSH MSA [ERR] [{NTE}]
 *   [ PID [{NTE}] { ORC [ <OBR|RQD|RQ1|RXO|ODS|ODT> [{NTE}] [{CTI}] ] } ]
 *
 * The specification notes that PID may be omitted (especially on error), so this
 * parser accepts ORC groups with or without a preceding PID.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { MSH } from "../../segments/v2.3/MSH.ts";
import { MSA } from "../../segments/v2.3/MSA.ts";
import { ERR } from "../../segments/v2.3/ERR.ts";
import { NTE } from "../../segments/v2.3/NTE.ts";
import { PID } from "../../segments/v2.3/PID.ts";
import { ORC } from "../../segments/v2.3/ORC.ts";
import { OBR } from "../../segments/v2.3/OBR.ts";
import { RQD } from "../../segments/v2.3/RQD.ts";
import { RQ1 } from "../../segments/v2.3/RQ1.ts";
import { RXO } from "../../segments/v2.3/RXO.ts";
import { ODS } from "../../segments/v2.3/ODS.ts";
import { ODT } from "../../segments/v2.3/ODT.ts";
import { CTI } from "../../segments/v2.3/CTI.ts";
import type { HL7Message } from "../../types/message.ts";
import type { Segment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import {
  misplacedSegment,
  readMessageHeader,
  segmentParseFailure,
} from "../../utils/messageParsing.ts";

/** The order detail segment of an order: one of OBR, RQD, RQ1, RXO, ODS or ODT. */
export type ResponseDetailSegment = OBR | RQD | RQ1 | RXO | ODS | ODT;

/** The order detail segment with its notes and clinical trial identification segments. */
export interface ParsedResponseDetail {
  /** The order detail segment (OBR, RQD, RQ1, RXO, ODS or ODT). */
  segment: ResponseDetailSegment;
  /** The notes value. */
  notes: NTE[];
  /** The clinical trial identification segments. */
  ctiList: CTI[];
}

/** A repeating ORC group. */
export interface ParsedResponseOrder {
  /** The orc value. */
  orc: ORC;
  /** The detail value. */
  detail?: ParsedResponseDetail;
}

/** The PID segment and the notes that follow it. */
export interface ParsedResponsePatient {
  /** The pid value. */
  pid: PID;
  /** The notes value. */
  notes: NTE[];
}

/** Structured result of parsing an HL7 ORR^O02 (v2.3) message. */
export interface ParsedORR_O02 {
  /** The message value. */
  message: HL7Message;
  /** The msh value. */
  msh: MSH;
  /** The msa value. */
  msa: MSA;
  /** The err value. */
  err?: ERR;
  /** The notes that follow MSA/ERR. */
  notes: NTE[];
  /** The patient value. */
  patient?: ParsedResponsePatient;
  /** The orders value. */
  orders: ParsedResponseOrder[];
}

/** Where the previous segment left the parser, which decides what an NTE belongs to. */
type Context = "header" | "patient" | "detail" | "other";

/** Parser for HL7 ORR^O02 (v2.3) messages. */
export class ORR_O02_Parser {
  /** Parse msh. */
  protected parseMSH(s: string): Result<MSH> {
    return MSH.parse(s);
  }
  /** Parse msa. */
  protected parseMSA(s: string, e: EncodingCharacters): Result<MSA> {
    return MSA.parse(s, e);
  }
  /** Parse err. */
  protected parseERR(s: string, e: EncodingCharacters): Result<ERR> {
    return ERR.parse(s, e);
  }
  /** Parse nte. */
  protected parseNTE(s: string, e: EncodingCharacters): Result<NTE> {
    return NTE.parse(s, e);
  }
  /** Parse pid. */
  protected parsePID(s: string, e: EncodingCharacters): Result<PID> {
    return PID.parse(s, e);
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
  /** Parse cti. */
  protected parseCTI(s: string, e: EncodingCharacters): Result<CTI> {
    return CTI.parse(s, e);
  }

  /** Parses the input string into a structured instance. */
  parse(messageString: string): Result<ParsedORR_O02> {
    try {
      const header = readMessageHeader(messageString, (s) => this.parseMSH(s));
      if (!header.ok || !header.val) return header as Result<never>;
      const { segments, msh, encoding, message } = header.val;

      let msa: MSA | undefined;
      let err: ERR | undefined;
      const notes: NTE[] = [];
      let patient: ParsedResponsePatient | undefined;
      const orders: ParsedResponseOrder[] = [];
      let order: ParsedResponseOrder | undefined;
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
          case "MSA": {
            const result = read(this.parseMSA);
            if (!result.ok || !result.val) return segmentParseFailure("MSA", line, result);
            if (msa) return misplacedSegment("MSA", line, "appears more than once");
            msa = result.val;
            break;
          }

          case "ERR": {
            const result = read(this.parseERR);
            if (!result.ok || !result.val) return segmentParseFailure("ERR", line, result);
            if (!msa) return misplacedSegment("ERR", line, "found without preceding MSA segment");
            if (err) return misplacedSegment("ERR", line, "appears more than once");
            err = result.val;
            break;
          }

          case "NTE": {
            const result = read(this.parseNTE);
            if (!result.ok || !result.val) return segmentParseFailure("NTE", line, result);
            const nte = result.val;
            if (ctx === "header") notes.push(nte);
            else if (ctx === "patient" && patient) patient.notes.push(nte);
            else if (ctx === "detail" && order?.detail) order.detail.notes.push(nte);
            else return misplacedSegment("NTE", line, "is not allowed at this position");
            break;
          }

          case "PID": {
            const result = read(this.parsePID);
            if (!result.ok || !result.val) return segmentParseFailure("PID", line, result);
            if (patient || order) {
              return misplacedSegment("PID", line, "must appear once, before the first ORC");
            }
            patient = { pid: result.val, notes: [] };
            ctx = "patient";
            break;
          }

          case "ORC": {
            const result = read(this.parseORC);
            if (!result.ok || !result.val) return segmentParseFailure("ORC", line, result);
            order = { orc: result.val };
            orders.push(order);
            ctx = "other";
            break;
          }

          case "OBR":
          case "RQD":
          case "RQ1":
          case "RXO":
          case "ODS":
          case "ODT": {
            const result: Result<ResponseDetailSegment> =
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
            order.detail = { segment: result.val, notes: [], ctiList: [] };
            ctx = "detail";
            break;
          }

          case "CTI": {
            const result = read(this.parseCTI);
            if (!result.ok || !result.val) return segmentParseFailure("CTI", line, result);
            if (!order?.detail) return misplacedSegment("CTI", line, "found without a preceding order detail segment");
            order.detail.ctiList.push(result.val);
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

      if (!msa) {
        return { ok: false, err: new Err("ORR_O02 message must contain an MSA segment") };
      }

      return { ok: true, val: { message, msh, msa, err, notes, patient, orders } };
    } catch (error) {
      return {
        ok: false,
        err: new Err(`Failed to parse ORR_O02 message: ${error}`),
      };
    }
  }
}

/** Parses an HL7 ORR^O02 (v2.3) message string into a structured result. */
export function parseORR_O02(messageString: string): Result<ParsedORR_O02> {
  return new ORR_O02_Parser().parse(messageString);
}
