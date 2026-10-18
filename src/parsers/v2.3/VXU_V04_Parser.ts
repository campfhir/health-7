/**
 * Parser for VXU^V04 messages (HL7 v2.3): unsolicited vaccination record update.
 *
 * Structure:
 *   MSH PID [PD1] [{NK1}] [ PV1 [PV2] ] [{ IN1 [IN2] [IN3] }]
 *   [{ [ORC] RXA [RXR] {[ OBX [{NTE}] ]} }]
 *
 * v2.4 adds `[{GT1}]` between the visit and the insurance groups; GT1 is only accepted when
 * a subclass sets `allowGT1` (the v2.4 parser does). Where GT1 is not allowed it is skipped
 * like any other unsupported segment.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { MSH } from "../../segments/v2.3/MSH.ts";
import { PID } from "../../segments/v2.3/PID.ts";
import { PD1 } from "../../segments/v2.3/PD1.ts";
import { NK1 } from "../../segments/v2.3/NK1.ts";
import { PV1 } from "../../segments/v2.3/PV1.ts";
import { PV2 } from "../../segments/v2.3/PV2.ts";
import { GT1 } from "../../segments/v2.3/GT1.ts";
import { IN1 } from "../../segments/v2.3/IN1.ts";
import { IN2 } from "../../segments/v2.3/IN2.ts";
import { IN3 } from "../../segments/v2.3/IN3.ts";
import { ORC } from "../../segments/v2.3/ORC.ts";
import { RXA } from "../../segments/v2.3/RXA.ts";
import { RXR } from "../../segments/v2.3/RXR.ts";
import { OBX } from "../../segments/v2.3/OBX.ts";
import { NTE } from "../../segments/v2.3/NTE.ts";
import type { HL7Message } from "../../types/message.ts";
import type { Segment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import {
  misplacedSegment,
  readMessageHeader,
  segmentParseFailure,
} from "../../utils/messageParsing.ts";

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

/** An OBX with the NTE segments that follow it. */
export interface ParsedObservation {
  /** The obx value. */
  obx: OBX;
  /** The notes value. */
  notes: NTE[];
}

/** A repeating vaccination group: [ORC] RXA [RXR] and its observations. */
export interface ParsedVaccination {
  /** The orc value (optional in v2.3 and v2.4). */
  orc?: ORC;
  /** The rxa value. */
  rxa: RXA;
  /** The rxr value. */
  rxr?: RXR;
  /** The observations value. */
  observations: ParsedObservation[];
}

/** Structured result of parsing an HL7 VXU^V04 (v2.3) message. */
export interface ParsedVXU_V04 {
  /** The message value. */
  message: HL7Message;
  /** The msh value. */
  msh: MSH;
  /** The pid value. */
  pid: PID;
  /** The pd1 value. */
  pd1?: PD1;
  /** The NK1 segments. */
  nk1List: NK1[];
  /** The visit value. */
  visit?: ParsedVisit;
  /** The guarantor segments (v2.4 and later). */
  gt1List: GT1[];
  /** The insurance value. */
  insurance: ParsedInsurance[];
  /** The vaccination groups. */
  orders: ParsedVaccination[];
}

/** Parser for HL7 VXU^V04 (v2.3) messages. */
export class VXU_V04_Parser {
  /** Whether GT1 is part of the structure: false in v2.3, true from v2.4. */
  protected readonly allowGT1: boolean = false;

  /** Parse msh. */
  protected parseMSH(s: string): Result<MSH> {
    return MSH.parse(s);
  }
  /** Parse pid. */
  protected parsePID(s: string, e: EncodingCharacters): Result<PID> {
    return PID.parse(s, e);
  }
  /** Parse pd1. */
  protected parsePD1(s: string, e: EncodingCharacters): Result<PD1> {
    return PD1.parse(s, e);
  }
  /** Parse nk1. */
  protected parseNK1(s: string, e: EncodingCharacters): Result<NK1> {
    return NK1.parse(s, e);
  }
  /** Parse pv1. */
  protected parsePV1(s: string, e: EncodingCharacters): Result<PV1> {
    return PV1.parse(s, e);
  }
  /** Parse pv2. */
  protected parsePV2(s: string, e: EncodingCharacters): Result<PV2> {
    return PV2.parse(s, e);
  }
  /** Parse gt1. */
  protected parseGT1(s: string, e: EncodingCharacters): Result<GT1> {
    return GT1.parse(s, e);
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
  /** Parse orc. */
  protected parseORC(s: string, e: EncodingCharacters): Result<ORC> {
    return ORC.parse(s, e);
  }
  /** Parse rxa. */
  protected parseRXA(s: string, e: EncodingCharacters): Result<RXA> {
    return RXA.parse(s, e);
  }
  /** Parse rxr. */
  protected parseRXR(s: string, e: EncodingCharacters): Result<RXR> {
    return RXR.parse(s, e);
  }
  /** Parse obx. */
  protected parseOBX(s: string, e: EncodingCharacters): Result<OBX> {
    return OBX.parse(s, e);
  }
  /** Parse nte. */
  protected parseNTE(s: string, e: EncodingCharacters): Result<NTE> {
    return NTE.parse(s, e);
  }

  /** Parses the input string into a structured instance. */
  parse(messageString: string): Result<ParsedVXU_V04> {
    try {
      const header = readMessageHeader(messageString, (s) => this.parseMSH(s));
      if (!header.ok || !header.val) return header as Result<never>;
      const { segments, msh, encoding, message } = header.val;

      let pid: PID | undefined;
      let pd1: PD1 | undefined;
      const nk1List: NK1[] = [];
      let visit: ParsedVisit | undefined;
      const gt1List: GT1[] = [];
      const insurance: ParsedInsurance[] = [];
      let currentInsurance: ParsedInsurance | undefined;
      const orders: ParsedVaccination[] = [];
      /** The vaccination group being filled; it is complete once it has an RXA. */
      let pending: { orc?: ORC; rxa?: RXA; rxr?: RXR; observations: ParsedObservation[] } | undefined;
      let observation: ParsedObservation | undefined;

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
        /** Closes the previous vaccination group; an ORC without an RXA is an error. */
        const closeGroup = (): Result<never> | undefined => {
          if (!pending) return undefined;
          if (!pending.rxa) {
            return misplacedSegment("ORC", line, "is not followed by an RXA segment before the next group") as Result<never>;
          }
          orders.push(pending as ParsedVaccination);
          pending = undefined;
          observation = undefined;
          return undefined;
        };

        switch (segmentType) {
          case "PID": {
            const result = read(this.parsePID);
            if (!result.ok || !result.val) return segmentParseFailure("PID", line, result);
            if (pid) return misplacedSegment("PID", line, "appears more than once");
            pid = result.val;
            break;
          }

          case "PD1": {
            const result = read(this.parsePD1);
            if (!result.ok || !result.val) return segmentParseFailure("PD1", line, result);
            if (!pid) return misplacedSegment("PD1", line, "found without preceding PID segment");
            pd1 = result.val;
            break;
          }

          case "NK1": {
            const result = read(this.parseNK1);
            if (!result.ok || !result.val) return segmentParseFailure("NK1", line, result);
            if (!pid) return misplacedSegment("NK1", line, "found without preceding PID segment");
            nk1List.push(result.val);
            break;
          }

          case "PV1": {
            const result = read(this.parsePV1);
            if (!result.ok || !result.val) return segmentParseFailure("PV1", line, result);
            if (!pid) return misplacedSegment("PV1", line, "found without preceding PID segment");
            visit = { pv1: result.val };
            break;
          }

          case "PV2": {
            const result = read(this.parsePV2);
            if (!result.ok || !result.val) return segmentParseFailure("PV2", line, result);
            if (!visit) return misplacedSegment("PV2", line, "found without preceding PV1 segment");
            visit.pv2 = result.val;
            break;
          }

          case "GT1": {
            if (!this.allowGT1) {
              console.warn(`Skipping unsupported segment type '${segmentType}' at line ${line}`);
              break;
            }
            const result = read(this.parseGT1);
            if (!result.ok || !result.val) return segmentParseFailure("GT1", line, result);
            if (!pid) return misplacedSegment("GT1", line, "found without preceding PID segment");
            gt1List.push(result.val);
            break;
          }

          case "IN1": {
            const result = read(this.parseIN1);
            if (!result.ok || !result.val) return segmentParseFailure("IN1", line, result);
            if (!pid) return misplacedSegment("IN1", line, "found without preceding PID segment");
            currentInsurance = { in1: result.val };
            insurance.push(currentInsurance);
            break;
          }

          case "IN2": {
            const result = read(this.parseIN2);
            if (!result.ok || !result.val) return segmentParseFailure("IN2", line, result);
            if (!currentInsurance) return misplacedSegment("IN2", line, "found without preceding IN1 segment");
            currentInsurance.in2 = result.val;
            break;
          }

          case "IN3": {
            const result = read(this.parseIN3);
            if (!result.ok || !result.val) return segmentParseFailure("IN3", line, result);
            if (!currentInsurance) return misplacedSegment("IN3", line, "found without preceding IN1 segment");
            currentInsurance.in3 = result.val;
            break;
          }

          case "ORC": {
            const result = read(this.parseORC);
            if (!result.ok || !result.val) return segmentParseFailure("ORC", line, result);
            const closed = closeGroup();
            if (closed) return closed;
            pending = { orc: result.val, observations: [] };
            break;
          }

          case "RXA": {
            const result = read(this.parseRXA);
            if (!result.ok || !result.val) return segmentParseFailure("RXA", line, result);
            if (!pid) return misplacedSegment("RXA", line, "found without preceding PID segment");
            if (pending && pending.rxa) {
              const closed = closeGroup();
              if (closed) return closed;
            }
            pending = pending ?? { observations: [] };
            pending.rxa = result.val;
            break;
          }

          case "RXR": {
            const result = read(this.parseRXR);
            if (!result.ok || !result.val) return segmentParseFailure("RXR", line, result);
            if (!pending?.rxa) return misplacedSegment("RXR", line, "found without preceding RXA segment");
            if (pending.rxr) return misplacedSegment("RXR", line, "appears more than once in the group");
            pending.rxr = result.val;
            break;
          }

          case "OBX": {
            const result = read(this.parseOBX);
            if (!result.ok || !result.val) return segmentParseFailure("OBX", line, result);
            if (!pending?.rxa) return misplacedSegment("OBX", line, "found without preceding RXA segment");
            observation = { obx: result.val, notes: [] };
            pending.observations.push(observation);
            break;
          }

          case "NTE": {
            const result = read(this.parseNTE);
            if (!result.ok || !result.val) return segmentParseFailure("NTE", line, result);
            if (!observation) return misplacedSegment("NTE", line, "found without preceding OBX segment");
            observation.notes.push(result.val);
            break;
          }

          default:
            console.warn(`Skipping unsupported segment type '${segmentType}' at line ${line}`);
            break;
        }
      }

      if (pending) {
        if (!pending.rxa) {
          return { ok: false, err: new Err("ORC is not followed by an RXA segment") };
        }
        orders.push(pending as ParsedVaccination);
      }
      if (!pid) {
        return { ok: false, err: new Err("VXU_V04 message must contain a PID segment") };
      }

      return {
        ok: true,
        val: { message, msh, pid, pd1, nk1List, visit, gt1List, insurance, orders },
      };
    } catch (error) {
      return {
        ok: false,
        err: new Err(`Failed to parse VXU_V04 message: ${error}`),
      };
    }
  }
}

/** Parses an HL7 VXU^V04 (v2.3) message string into a structured result. */
export function parseVXU_V04(messageString: string): Result<ParsedVXU_V04> {
  return new VXU_V04_Parser().parse(messageString);
}
