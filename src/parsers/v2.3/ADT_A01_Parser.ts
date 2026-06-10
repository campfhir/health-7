/**
 * Parser for ADT^A01 messages (HL7 v2.3).
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { MSH } from "../../segments/v2.3/MSH.ts";
import { EVN } from "../../segments/v2.3/EVN.ts";
import { PID } from "../../segments/v2.3/PID.ts";
import { PD1 } from "../../segments/v2.3/PD1.ts";
import { ROL } from "../../segments/v2.3/ROL.ts";
import { NK1 } from "../../segments/v2.3/NK1.ts";
import { PV1 } from "../../segments/v2.3/PV1.ts";
import { PV2 } from "../../segments/v2.3/PV2.ts";
import { DB1 } from "../../segments/v2.3/DB1.ts";
import { OBX } from "../../segments/v2.3/OBX.ts";
import { AL1 } from "../../segments/v2.3/AL1.ts";
import { DG1 } from "../../segments/v2.3/DG1.ts";
import { DRG } from "../../segments/v2.3/DRG.ts";
import { PR1 } from "../../segments/v2.3/PR1.ts";
import { GT1 } from "../../segments/v2.3/GT1.ts";
import { IN1 } from "../../segments/v2.3/IN1.ts";
import { IN2 } from "../../segments/v2.3/IN2.ts";
import { IN3 } from "../../segments/v2.3/IN3.ts";
import { ACC } from "../../segments/v2.3/ACC.ts";
import { UB1 } from "../../segments/v2.3/UB1.ts";
import { UB2 } from "../../segments/v2.3/UB2.ts";
import { HL7Message } from "../../types/message.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";

/** Structured result of parsing an HL7 ADT^A01 (v2.3) message. */
export interface ParsedProcedure {
  /** The pr1 value. */
  pr1: PR1;
  /** The rol list value. */
  rolList?: ROL[];
}

/** Structured result of parsing an HL7 ADT^A01 (v2.3) message. */
export interface ParsedInsuranceGroup {
  /** The in1 value. */
  in1: IN1;
  /** The in2 value. */
  in2?: IN2;
  /** The in3 list value. */
  in3List?: IN3[];
}

/** Structured result of parsing an HL7 ADT^A01 (v2.3) message. */
export interface ParsedADT_A01 {
  /** The message value. */
  message: HL7Message;
  /** The msh value. */
  msh: MSH;
  /** The evn value. */
  evn?: EVN;
  /** The pid value. */
  pid: PID;
  /** The pd1 value. */
  pd1?: PD1;
  /** The rol list value. */
  rolList?: ROL[];
  /** The nk1 list value. */
  nk1List?: NK1[];
  /** The pv1 value. */
  pv1?: PV1;
  /** The pv2 value. */
  pv2?: PV2;
  /** The db1 list value. */
  db1List?: DB1[];
  /** The obx list value. */
  obxList?: OBX[];
  /** The al1 list value. */
  al1List?: AL1[];
  /** The dg1 list value. */
  dg1List?: DG1[];
  /** The drg value. */
  drg?: DRG;
  /** The procedures value. */
  procedures?: ParsedProcedure[];
  /** The gt1 list value. */
  gt1List?: GT1[];
  /** The insurance groups value. */
  insuranceGroups?: ParsedInsuranceGroup[];
  /** The acc value. */
  acc?: ACC;
  /** The ub1 value. */
  ub1?: UB1;
  /** The ub2 value. */
  ub2?: UB2;
}

/** Parser for HL7 ADT^A01 (v2.3) messages. */
export class ADT_A01_Parser {
  /** The message name value. */
  protected readonly messageName: string = "ADT_A01";

  /** Parse msh. */
  protected parseMSH(s: string): Result<MSH> { return MSH.parse(s); }
  /** Parse evn. */
  protected parseEVN(s: string, e: EncodingCharacters): Result<EVN> { return EVN.parse(s, e); }
  /** Parse pid. */
  protected parsePID(s: string, e: EncodingCharacters): Result<PID> { return PID.parse(s, e); }
  /** Parse pd1. */
  protected parsePD1(s: string, e: EncodingCharacters): Result<PD1> { return PD1.parse(s, e); }
  /** Parse rol. */
  protected parseROL(s: string, e: EncodingCharacters): Result<ROL> { return ROL.parse(s, e); }
  /** Parse nk1. */
  protected parseNK1(s: string, e: EncodingCharacters): Result<NK1> { return NK1.parse(s, e); }
  /** Parse pv1. */
  protected parsePV1(s: string, e: EncodingCharacters): Result<PV1> { return PV1.parse(s, e); }
  /** Parse pv2. */
  protected parsePV2(s: string, e: EncodingCharacters): Result<PV2> { return PV2.parse(s, e); }
  /** Parse db1. */
  protected parseDB1(s: string, e: EncodingCharacters): Result<DB1> { return DB1.parse(s, e); }
  /** Parse obx. */
  protected parseOBX(s: string, e: EncodingCharacters): Result<OBX> { return OBX.parse(s, e); }
  /** Parse al1. */
  protected parseAL1(s: string, e: EncodingCharacters): Result<AL1> { return AL1.parse(s, e); }
  /** Parse dg1. */
  protected parseDG1(s: string, e: EncodingCharacters): Result<DG1> { return DG1.parse(s, e); }
  /** Parse drg. */
  protected parseDRG(s: string, e: EncodingCharacters): Result<DRG> { return DRG.parse(s, e); }
  /** Parse pr1. */
  protected parsePR1(s: string, e: EncodingCharacters): Result<PR1> { return PR1.parse(s, e); }
  /** Parse gt1. */
  protected parseGT1(s: string, e: EncodingCharacters): Result<GT1> { return GT1.parse(s, e); }
  /** Parse in1. */
  protected parseIN1(s: string, e: EncodingCharacters): Result<IN1> { return IN1.parse(s, e); }
  /** Parse in2. */
  protected parseIN2(s: string, e: EncodingCharacters): Result<IN2> { return IN2.parse(s, e); }
  /** Parse in3. */
  protected parseIN3(s: string, e: EncodingCharacters): Result<IN3> { return IN3.parse(s, e); }
  /** Parse acc. */
  protected parseACC(s: string, e: EncodingCharacters): Result<ACC> { return ACC.parse(s, e); }
  /** Parse ub1. */
  protected parseUB1(s: string, e: EncodingCharacters): Result<UB1> { return UB1.parse(s, e); }
  /** Parse ub2. */
  protected parseUB2(s: string, e: EncodingCharacters): Result<UB2> { return UB2.parse(s, e); }

  /** Parses the input string into a structured instance. */
  parse(messageString: string): Result<ParsedADT_A01> {
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
      let pid: PID | undefined;
      let pd1: PD1 | undefined;
      const rolList: ROL[] = [];
      const nk1List: NK1[] = [];
      let pv1: PV1 | undefined;
      let pv2: PV2 | undefined;
      const db1List: DB1[] = [];
      const obxList: OBX[] = [];
      const al1List: AL1[] = [];
      const dg1List: DG1[] = [];
      let drg: DRG | undefined;
      const procedures: ParsedProcedure[] = [];
      let currentProcedure: { pr1: PR1; rolList: ROL[] } | null = null;
      const gt1List: GT1[] = [];
      const insuranceGroups: ParsedInsuranceGroup[] = [];
      let currentInsurance: { in1: IN1; in2?: IN2; in3List: IN3[] } | null = null;
      let acc: ACC | undefined;
      let ub1: UB1 | undefined;
      let ub2: UB2 | undefined;

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
            pid = r.val; message.addSegment(r.val); break;
          }
          case "PD1": {
            const r = this.parsePD1(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse PD1 at line ${i + 1}: ${r.err.message}`) };
            pd1 = r.val; message.addSegment(r.val); break;
          }
          case "ROL": {
            const r = this.parseROL(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse ROL at line ${i + 1}: ${r.err.message}`) };
            if (currentProcedure) currentProcedure.rolList.push(r.val);
            else rolList.push(r.val);
            message.addSegment(r.val); break;
          }
          case "NK1": {
            const r = this.parseNK1(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse NK1 at line ${i + 1}: ${r.err.message}`) };
            nk1List.push(r.val); message.addSegment(r.val); break;
          }
          case "PV1": {
            const r = this.parsePV1(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse PV1 at line ${i + 1}: ${r.err.message}`) };
            pv1 = r.val; message.addSegment(r.val); break;
          }
          case "PV2": {
            const r = this.parsePV2(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse PV2 at line ${i + 1}: ${r.err.message}`) };
            pv2 = r.val; message.addSegment(r.val); break;
          }
          case "DB1": {
            const r = this.parseDB1(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse DB1 at line ${i + 1}: ${r.err.message}`) };
            db1List.push(r.val); message.addSegment(r.val); break;
          }
          case "OBX": {
            const r = this.parseOBX(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse OBX at line ${i + 1}: ${r.err.message}`) };
            obxList.push(r.val); message.addSegment(r.val); break;
          }
          case "AL1": {
            const r = this.parseAL1(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse AL1 at line ${i + 1}: ${r.err.message}`) };
            al1List.push(r.val); message.addSegment(r.val); break;
          }
          case "DG1": {
            const r = this.parseDG1(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse DG1 at line ${i + 1}: ${r.err.message}`) };
            dg1List.push(r.val); message.addSegment(r.val); break;
          }
          case "DRG": {
            const r = this.parseDRG(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse DRG at line ${i + 1}: ${r.err.message}`) };
            drg = r.val; message.addSegment(r.val); break;
          }
          case "PR1": {
            if (currentProcedure) {
              procedures.push({ pr1: currentProcedure.pr1, rolList: currentProcedure.rolList.length ? currentProcedure.rolList : undefined });
            }
            const r = this.parsePR1(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse PR1 at line ${i + 1}: ${r.err.message}`) };
            currentProcedure = { pr1: r.val, rolList: [] };
            message.addSegment(r.val); break;
          }
          case "GT1": {
            if (currentProcedure) {
              procedures.push({ pr1: currentProcedure.pr1, rolList: currentProcedure.rolList.length ? currentProcedure.rolList : undefined });
              currentProcedure = null;
            }
            const r = this.parseGT1(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse GT1 at line ${i + 1}: ${r.err.message}`) };
            gt1List.push(r.val); message.addSegment(r.val); break;
          }
          case "IN1": {
            if (currentProcedure) {
              procedures.push({ pr1: currentProcedure.pr1, rolList: currentProcedure.rolList.length ? currentProcedure.rolList : undefined });
              currentProcedure = null;
            }
            if (currentInsurance) {
              insuranceGroups.push({ in1: currentInsurance.in1, in2: currentInsurance.in2, in3List: currentInsurance.in3List.length ? currentInsurance.in3List : undefined });
            }
            const r = this.parseIN1(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse IN1 at line ${i + 1}: ${r.err.message}`) };
            currentInsurance = { in1: r.val, in3List: [] };
            message.addSegment(r.val); break;
          }
          case "IN2": {
            const r = this.parseIN2(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse IN2 at line ${i + 1}: ${r.err.message}`) };
            if (currentInsurance) currentInsurance.in2 = r.val;
            message.addSegment(r.val); break;
          }
          case "IN3": {
            const r = this.parseIN3(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse IN3 at line ${i + 1}: ${r.err.message}`) };
            if (currentInsurance) currentInsurance.in3List.push(r.val);
            message.addSegment(r.val); break;
          }
          case "ACC": {
            const r = this.parseACC(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse ACC at line ${i + 1}: ${r.err.message}`) };
            acc = r.val; message.addSegment(r.val); break;
          }
          case "UB1": {
            const r = this.parseUB1(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse UB1 at line ${i + 1}: ${r.err.message}`) };
            ub1 = r.val; message.addSegment(r.val); break;
          }
          case "UB2": {
            const r = this.parseUB2(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse UB2 at line ${i + 1}: ${r.err.message}`) };
            ub2 = r.val; message.addSegment(r.val); break;
          }
          default:
            console.warn(`Skipping unsupported segment type '${segmentType}' at line ${i + 1}`);
            break;
        }
      }

      if (currentProcedure) {
        procedures.push({ pr1: currentProcedure.pr1, rolList: currentProcedure.rolList.length ? currentProcedure.rolList : undefined });
      }
      if (currentInsurance) {
        insuranceGroups.push({ in1: currentInsurance.in1, in2: currentInsurance.in2, in3List: currentInsurance.in3List.length ? currentInsurance.in3List : undefined });
      }

      if (!pid) {
        return { ok: false, err: new Err(`${this.messageName} message must contain a PID segment`) };
      }

      return {
        ok: true,
        val: {
          message, msh, evn, pid, pd1,
          rolList: rolList.length ? rolList : undefined,
          nk1List: nk1List.length ? nk1List : undefined,
          pv1, pv2,
          db1List: db1List.length ? db1List : undefined,
          obxList: obxList.length ? obxList : undefined,
          al1List: al1List.length ? al1List : undefined,
          dg1List: dg1List.length ? dg1List : undefined,
          drg,
          procedures: procedures.length ? procedures : undefined,
          gt1List: gt1List.length ? gt1List : undefined,
          insuranceGroups: insuranceGroups.length ? insuranceGroups : undefined,
          acc, ub1, ub2,
        },
      };
    } catch (error) {
      return { ok: false, err: new Err(`Failed to parse ${this.messageName} message: ${error}`) };
    }
  }
}

/** Parses an HL7 ADT^A01 (v2.3) message string into a structured result. */
export function parseADT_A01(messageString: string): Result<ParsedADT_A01> {
  return new ADT_A01_Parser().parse(messageString);
}
