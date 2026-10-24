/**
 * Parser for ADT^A17 messages (HL7 v2.3).
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { MSH } from "../../segments/v2.3/MSH.ts";
import { EVN } from "../../segments/v2.3/EVN.ts";
import { PID } from "../../segments/v2.3/PID.ts";
import { PD1 } from "../../segments/v2.3/PD1.ts";
import { PV1 } from "../../segments/v2.3/PV1.ts";
import { PV2 } from "../../segments/v2.3/PV2.ts";
import { DB1 } from "../../segments/v2.3/DB1.ts";
import { OBX } from "../../segments/v2.3/OBX.ts";
import { HL7Message } from "../../types/message.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";

/** ParsedSwapPatient — one of the two patients swapping beds in a parsed HL7 ADT^A17 (v2.3) message. */
export interface ParsedSwapPatient {
  /** The pid value. */
  pid: PID;
  /** The pd1 value. */
  pd1?: PD1;
  /** The pv1 value. */
  pv1: PV1;
  /** The pv2 value. */
  pv2?: PV2;
  /** The db1 list value. */
  db1List: DB1[];
  /** The obx list value. */
  obxList: OBX[];
}

/** Structured result of parsing an HL7 ADT^A17 (v2.3) message. */
export interface ParsedADT_A17 {
  /** The message value. */
  message: HL7Message;
  /** The msh value. */
  msh: MSH;
  /** The evn value. */
  evn: EVN;
  /** The first patient. */
  patient1: ParsedSwapPatient;
  /** The second patient. */
  patient2: ParsedSwapPatient;
}

/** Parser for HL7 ADT^A17 (v2.3) messages. */
export class ADT_A17_Parser {
  /** The message name value. */
  protected readonly messageName: string = "ADT_A17";

  /** Parse msh. */
  protected parseMSH(s: string): Result<MSH> { return MSH.parse(s); }
  /** Parse evn. */
  protected parseEVN(s: string, e: EncodingCharacters): Result<EVN> { return EVN.parse(s, e); }
  /** Parse pid. */
  protected parsePID(s: string, e: EncodingCharacters): Result<PID> { return PID.parse(s, e); }
  /** Parse pd1. */
  protected parsePD1(s: string, e: EncodingCharacters): Result<PD1> { return PD1.parse(s, e); }
  /** Parse pv1. */
  protected parsePV1(s: string, e: EncodingCharacters): Result<PV1> { return PV1.parse(s, e); }
  /** Parse pv2. */
  protected parsePV2(s: string, e: EncodingCharacters): Result<PV2> { return PV2.parse(s, e); }
  /** Parse db1. */
  protected parseDB1(s: string, e: EncodingCharacters): Result<DB1> { return DB1.parse(s, e); }
  /** Parse obx. */
  protected parseOBX(s: string, e: EncodingCharacters): Result<OBX> { return OBX.parse(s, e); }

  /** Parses the input string into a structured instance. */
  parse(messageString: string): Result<ParsedADT_A17> {
    try {
      const segments = messageString
        .split(/\r\n|\r|\n/)
        .filter((s) => s.trim().length > 0);

      if (segments.length === 0) {
        return { ok: false, err: new Err("Empty message") };
      }

      const mshSegment = segments[0];
      if (!mshSegment.startsWith("MSH")) {
        return { ok: false, err: new Err("Message must start with MSH segment") };
      }

      const mshResult = this.parseMSH(mshSegment);
      if (!mshResult.ok || !mshResult.val) {
        return { ok: false, err: new Err(mshResult.err.message || "Failed to parse MSH segment") };
      }

      const msh = mshResult.val;
      const encoding = msh.getEncoding();
      const message = new HL7Message(encoding);
      message.addSegment(msh);

      let evn: EVN | undefined;
      // Each PID opens a new patient group; the segments that follow belong to it.
      type PatientInProgress = Omit<ParsedSwapPatient, "pv1"> & { pv1?: PV1 };
      const patients: PatientInProgress[] = [];
      let current: PatientInProgress | undefined;

      for (let i = 1; i < segments.length; i++) {
        const segmentStr = segments[i];
        const segmentType = segmentStr.substring(0, 3);

        switch (segmentType) {
          case "EVN": {
            const r = this.parseEVN(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse EVN at line ${i + 1}: ${r.err.message}`) };
            evn = r.val; message.addSegment(r.val); break;
          }
          case "PID": {
            const r = this.parsePID(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse PID at line ${i + 1}: ${r.err.message}`) };
            current = { pid: r.val, db1List: [], obxList: [] };
            patients.push(current); message.addSegment(r.val); break;
          }
          case "PD1": {
            if (!current) return { ok: false, err: new Err(`PD1 at line ${i + 1} appears before any PID segment`) };
            const r = this.parsePD1(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse PD1 at line ${i + 1}: ${r.err.message}`) };
            current.pd1 = r.val; message.addSegment(r.val); break;
          }
          case "PV1": {
            if (!current) return { ok: false, err: new Err(`PV1 at line ${i + 1} appears before any PID segment`) };
            const r = this.parsePV1(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse PV1 at line ${i + 1}: ${r.err.message}`) };
            current.pv1 = r.val; message.addSegment(r.val); break;
          }
          case "PV2": {
            if (!current) return { ok: false, err: new Err(`PV2 at line ${i + 1} appears before any PID segment`) };
            const r = this.parsePV2(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse PV2 at line ${i + 1}: ${r.err.message}`) };
            current.pv2 = r.val; message.addSegment(r.val); break;
          }
          case "DB1": {
            if (!current) return { ok: false, err: new Err(`DB1 at line ${i + 1} appears before any PID segment`) };
            const r = this.parseDB1(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse DB1 at line ${i + 1}: ${r.err.message}`) };
            current.db1List.push(r.val); message.addSegment(r.val); break;
          }
          case "OBX": {
            if (!current) return { ok: false, err: new Err(`OBX at line ${i + 1} appears before any PID segment`) };
            const r = this.parseOBX(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse OBX at line ${i + 1}: ${r.err.message}`) };
            current.obxList.push(r.val); message.addSegment(r.val); break;
          }
          default:
            console.warn(`Skipping unsupported segment type '${segmentType}' at line ${i + 1}`);
            break;
        }
      }

      if (!evn) {
        return { ok: false, err: new Err(`${this.messageName} message must contain an EVN segment`) };
      }
      if (patients.length !== 2) {
        return { ok: false, err: new Err(`${this.messageName} message must contain exactly two PID segments (found ${patients.length})`) };
      }
      for (const [index, p] of patients.entries()) {
        if (!p.pv1) {
          return { ok: false, err: new Err(`${this.messageName} message must contain a PV1 segment for patient ${index + 1}`) };
        }
      }

      const [patient1, patient2] = patients as ParsedSwapPatient[];
      return { ok: true, val: { message, msh, evn, patient1, patient2 } };
    } catch (error) {
      return { ok: false, err: new Err(`Failed to parse ${this.messageName} message: ${error}`) };
    }
  }
}

/** Parses an HL7 ADT^A17 (v2.3) message string into a structured result. */
export function parseADT_A17(messageString: string): Result<ParsedADT_A17> {
  return new ADT_A17_Parser().parse(messageString);
}
