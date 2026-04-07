import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { MSH } from "../../segments/v2.3/MSH";
import { EVN } from "../../segments/v2.3/EVN";
import { PID } from "../../segments/v2.3/PID";
import { PD1 } from "../../segments/v2.3/PD1";
import { ROL } from "../../segments/v2.3/ROL";
import { NK1 } from "../../segments/v2.3/NK1";
import { PV1 } from "../../segments/v2.3/PV1";
import { PV2 } from "../../segments/v2.3/PV2";
import { DB1 } from "../../segments/v2.3/DB1";
import { OBX } from "../../segments/v2.3/OBX";
import { AL1 } from "../../segments/v2.3/AL1";
import { DG1 } from "../../segments/v2.3/DG1";
import { DRG } from "../../segments/v2.3/DRG";
import { PR1 } from "../../segments/v2.3/PR1";
import { GT1 } from "../../segments/v2.3/GT1";
import { IN1 } from "../../segments/v2.3/IN1";
import { IN2 } from "../../segments/v2.3/IN2";
import { IN3 } from "../../segments/v2.3/IN3";
import { ACC } from "../../segments/v2.3/ACC";
import { UB1 } from "../../segments/v2.3/UB1";
import { UB2 } from "../../segments/v2.3/UB2";
import { HL7Message } from "../../types/message";
import { EncodingCharacters } from "../../types/encoding";

export interface ParsedProcedure {
  pr1: PR1;
  rolList?: ROL[];
}

export interface ParsedInsuranceGroup {
  in1: IN1;
  in2?: IN2;
  in3List?: IN3[];
}

export interface ParsedADT_A01 {
  message: HL7Message;
  msh: MSH;
  evn?: EVN;
  pid: PID;
  pd1?: PD1;
  rolList?: ROL[];
  nk1List?: NK1[];
  pv1?: PV1;
  pv2?: PV2;
  db1List?: DB1[];
  obxList?: OBX[];
  al1List?: AL1[];
  dg1List?: DG1[];
  drg?: DRG;
  procedures?: ParsedProcedure[];
  gt1List?: GT1[];
  insuranceGroups?: ParsedInsuranceGroup[];
  acc?: ACC;
  ub1?: UB1;
  ub2?: UB2;
}

export class ADT_A01_Parser {
  protected readonly messageName: string = "ADT_A01";

  protected parseMSH(s: string): Result<MSH> { return MSH.parse(s); }
  protected parseEVN(s: string, e: EncodingCharacters): Result<EVN> { return EVN.parse(s, e); }
  protected parsePID(s: string, e: EncodingCharacters): Result<PID> { return PID.parse(s, e); }
  protected parsePD1(s: string, e: EncodingCharacters): Result<PD1> { return PD1.parse(s, e); }
  protected parseROL(s: string, e: EncodingCharacters): Result<ROL> { return ROL.parse(s, e); }
  protected parseNK1(s: string, e: EncodingCharacters): Result<NK1> { return NK1.parse(s, e); }
  protected parsePV1(s: string, e: EncodingCharacters): Result<PV1> { return PV1.parse(s, e); }
  protected parsePV2(s: string, e: EncodingCharacters): Result<PV2> { return PV2.parse(s, e); }
  protected parseDB1(s: string, e: EncodingCharacters): Result<DB1> { return DB1.parse(s, e); }
  protected parseOBX(s: string, e: EncodingCharacters): Result<OBX> { return OBX.parse(s, e); }
  protected parseAL1(s: string, e: EncodingCharacters): Result<AL1> { return AL1.parse(s, e); }
  protected parseDG1(s: string, e: EncodingCharacters): Result<DG1> { return DG1.parse(s, e); }
  protected parseDRG(s: string, e: EncodingCharacters): Result<DRG> { return DRG.parse(s, e); }
  protected parsePR1(s: string, e: EncodingCharacters): Result<PR1> { return PR1.parse(s, e); }
  protected parseGT1(s: string, e: EncodingCharacters): Result<GT1> { return GT1.parse(s, e); }
  protected parseIN1(s: string, e: EncodingCharacters): Result<IN1> { return IN1.parse(s, e); }
  protected parseIN2(s: string, e: EncodingCharacters): Result<IN2> { return IN2.parse(s, e); }
  protected parseIN3(s: string, e: EncodingCharacters): Result<IN3> { return IN3.parse(s, e); }
  protected parseACC(s: string, e: EncodingCharacters): Result<ACC> { return ACC.parse(s, e); }
  protected parseUB1(s: string, e: EncodingCharacters): Result<UB1> { return UB1.parse(s, e); }
  protected parseUB2(s: string, e: EncodingCharacters): Result<UB2> { return UB2.parse(s, e); }

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

export function parseADT_A01(messageString: string): Result<ParsedADT_A01> {
  return new ADT_A01_Parser().parse(messageString);
}
