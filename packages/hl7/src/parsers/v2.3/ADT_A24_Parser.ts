/**
 * Parser for ADT^A24 messages (HL7 v2.3).
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
import { DB1 } from "../../segments/v2.3/DB1.ts";
import { HL7Message } from "../../types/message.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";

/** ParsedLinkedPatient — one of the two patients being linked in a parsed HL7 ADT^A24 (v2.3) message. */
export interface ParsedLinkedPatient {
  /** The pid value. */
  pid: PID;
  /** The pd1 value. */
  pd1?: PD1;
  /** The pv1 value. */
  pv1?: PV1;
  /** The db1 list value. */
  db1List: DB1[];
}

/** Structured result of parsing an HL7 ADT^A24 (v2.3) message. */
export interface ParsedADT_A24 {
  /** The message value. */
  message: HL7Message;
  /** The msh value. */
  msh: MSH;
  /** The evn value. */
  evn: EVN;
  /** The first patient. */
  patient1: ParsedLinkedPatient;
  /** The second patient. */
  patient2: ParsedLinkedPatient;
}

/** Parser for HL7 ADT^A24 (v2.3) messages. */
export class ADT_A24_Parser {
  /** The message name value. */
  protected readonly messageName: string = "ADT_A24";

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
  /** Parse db1. */
  protected parseDB1(s: string, e: EncodingCharacters): Result<DB1> { return DB1.parse(s, e); }

  /** Parses the input string into a structured instance. */
  parse(messageString: string): Result<ParsedADT_A24> {
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
      const patients: ParsedLinkedPatient[] = [];
      let current: ParsedLinkedPatient | undefined;

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
            current = { pid: r.val, db1List: [] };
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
          case "DB1": {
            if (!current) return { ok: false, err: new Err(`DB1 at line ${i + 1} appears before any PID segment`) };
            const r = this.parseDB1(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse DB1 at line ${i + 1}: ${r.err.message}`) };
            current.db1List.push(r.val); message.addSegment(r.val); break;
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

      return { ok: true, val: { message, msh, evn, patient1: patients[0], patient2: patients[1] } };
    } catch (error) {
      return { ok: false, err: new Err(`Failed to parse ${this.messageName} message: ${error}`) };
    }
  }
}

/** Parses an HL7 ADT^A24 (v2.3) message string into a structured result. */
export function parseADT_A24(messageString: string): Result<ParsedADT_A24> {
  return new ADT_A24_Parser().parse(messageString);
}
