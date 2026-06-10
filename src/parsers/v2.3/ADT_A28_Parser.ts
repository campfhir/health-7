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

export interface ParsedProcedure {
  pr1: PR1;
  rolList?: ROL[];
}

export interface ParsedInsuranceGroup {
  in1: IN1;
  in2?: IN2;
  in3List?: IN3[];
}

export interface ParsedADT_A28 {
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

export class ADT_A28_Parser {
  protected parseMSH(s: string): Result<MSH> {
    return MSH.parse(s);
  }

  protected parseEVN(s: string, e: EncodingCharacters): Result<EVN> {
    return EVN.parse(s, e);
  }

  protected parsePID(s: string, e: EncodingCharacters): Result<PID> {
    return PID.parse(s, e);
  }

  protected parsePD1(s: string, e: EncodingCharacters): Result<PD1> {
    return PD1.parse(s, e);
  }

  protected parseROL(s: string, e: EncodingCharacters): Result<ROL> {
    return ROL.parse(s, e);
  }

  protected parseNK1(s: string, e: EncodingCharacters): Result<NK1> {
    return NK1.parse(s, e);
  }

  protected parsePV1(s: string, e: EncodingCharacters): Result<PV1> {
    return PV1.parse(s, e);
  }

  protected parsePV2(s: string, e: EncodingCharacters): Result<PV2> {
    return PV2.parse(s, e);
  }

  protected parseDB1(s: string, e: EncodingCharacters): Result<DB1> {
    return DB1.parse(s, e);
  }

  protected parseOBX(s: string, e: EncodingCharacters): Result<OBX> {
    return OBX.parse(s, e);
  }

  protected parseAL1(s: string, e: EncodingCharacters): Result<AL1> {
    return AL1.parse(s, e);
  }

  protected parseDG1(s: string, e: EncodingCharacters): Result<DG1> {
    return DG1.parse(s, e);
  }

  protected parseDRG(s: string, e: EncodingCharacters): Result<DRG> {
    return DRG.parse(s, e);
  }

  protected parsePR1(s: string, e: EncodingCharacters): Result<PR1> {
    return PR1.parse(s, e);
  }

  protected parseGT1(s: string, e: EncodingCharacters): Result<GT1> {
    return GT1.parse(s, e);
  }

  protected parseIN1(s: string, e: EncodingCharacters): Result<IN1> {
    return IN1.parse(s, e);
  }

  protected parseIN2(s: string, e: EncodingCharacters): Result<IN2> {
    return IN2.parse(s, e);
  }

  protected parseIN3(s: string, e: EncodingCharacters): Result<IN3> {
    return IN3.parse(s, e);
  }

  protected parseACC(s: string, e: EncodingCharacters): Result<ACC> {
    return ACC.parse(s, e);
  }

  protected parseUB1(s: string, e: EncodingCharacters): Result<UB1> {
    return UB1.parse(s, e);
  }

  protected parseUB2(s: string, e: EncodingCharacters): Result<UB2> {
    return UB2.parse(s, e);
  }

  parse(messageString: string): Result<ParsedADT_A28> {
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
            const result = this.parseEVN(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse EVN segment at line ${i + 1}: ${result.err.message}`) };
            }
            evn = result.val;
            message.addSegment(result.val);
            break;
          }

          case "PID": {
            const result = this.parsePID(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse PID segment at line ${i + 1}: ${result.err.message}`) };
            }
            pid = result.val;
            message.addSegment(result.val);
            break;
          }

          case "PD1": {
            const result = this.parsePD1(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse PD1 segment at line ${i + 1}: ${result.err.message}`) };
            }
            pd1 = result.val;
            message.addSegment(result.val);
            break;
          }

          case "ROL": {
            const result = this.parseROL(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse ROL segment at line ${i + 1}: ${result.err.message}`) };
            }
            // ROL after PR1 belongs to the current procedure group; otherwise patient-level
            if (currentProcedure) {
              currentProcedure.rolList.push(result.val);
            } else {
              rolList.push(result.val);
            }
            message.addSegment(result.val);
            break;
          }

          case "NK1": {
            const result = this.parseNK1(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse NK1 segment at line ${i + 1}: ${result.err.message}`) };
            }
            nk1List.push(result.val);
            message.addSegment(result.val);
            break;
          }

          case "PV1": {
            const result = this.parsePV1(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse PV1 segment at line ${i + 1}: ${result.err.message}`) };
            }
            pv1 = result.val;
            message.addSegment(result.val);
            break;
          }

          case "PV2": {
            const result = this.parsePV2(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse PV2 segment at line ${i + 1}: ${result.err.message}`) };
            }
            pv2 = result.val;
            message.addSegment(result.val);
            break;
          }

          case "DB1": {
            const result = this.parseDB1(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse DB1 segment at line ${i + 1}: ${result.err.message}`) };
            }
            db1List.push(result.val);
            message.addSegment(result.val);
            break;
          }

          case "OBX": {
            const result = this.parseOBX(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse OBX segment at line ${i + 1}: ${result.err.message}`) };
            }
            obxList.push(result.val);
            message.addSegment(result.val);
            break;
          }

          case "AL1": {
            const result = this.parseAL1(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse AL1 segment at line ${i + 1}: ${result.err.message}`) };
            }
            al1List.push(result.val);
            message.addSegment(result.val);
            break;
          }

          case "DG1": {
            const result = this.parseDG1(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse DG1 segment at line ${i + 1}: ${result.err.message}`) };
            }
            dg1List.push(result.val);
            message.addSegment(result.val);
            break;
          }

          case "DRG": {
            const result = this.parseDRG(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse DRG segment at line ${i + 1}: ${result.err.message}`) };
            }
            drg = result.val;
            message.addSegment(result.val);
            break;
          }

          case "PR1": {
            // Finalize previous procedure group before starting a new one
            if (currentProcedure) {
              procedures.push({
                pr1: currentProcedure.pr1,
                rolList: currentProcedure.rolList.length ? currentProcedure.rolList : undefined,
              });
            }
            const result = this.parsePR1(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse PR1 segment at line ${i + 1}: ${result.err.message}`) };
            }
            currentProcedure = { pr1: result.val, rolList: [] };
            message.addSegment(result.val);
            break;
          }

          case "GT1": {
            // GT1 closes any open procedure group
            if (currentProcedure) {
              procedures.push({
                pr1: currentProcedure.pr1,
                rolList: currentProcedure.rolList.length ? currentProcedure.rolList : undefined,
              });
              currentProcedure = null;
            }
            const result = this.parseGT1(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse GT1 segment at line ${i + 1}: ${result.err.message}`) };
            }
            gt1List.push(result.val);
            message.addSegment(result.val);
            break;
          }

          case "IN1": {
            // IN1 closes any open procedure group and any open insurance group
            if (currentProcedure) {
              procedures.push({
                pr1: currentProcedure.pr1,
                rolList: currentProcedure.rolList.length ? currentProcedure.rolList : undefined,
              });
              currentProcedure = null;
            }
            if (currentInsurance) {
              insuranceGroups.push({
                in1: currentInsurance.in1,
                in2: currentInsurance.in2,
                in3List: currentInsurance.in3List.length ? currentInsurance.in3List : undefined,
              });
            }
            const result = this.parseIN1(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse IN1 segment at line ${i + 1}: ${result.err.message}`) };
            }
            currentInsurance = { in1: result.val, in3List: [] };
            message.addSegment(result.val);
            break;
          }

          case "IN2": {
            const result = this.parseIN2(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse IN2 segment at line ${i + 1}: ${result.err.message}`) };
            }
            if (currentInsurance) {
              currentInsurance.in2 = result.val;
            }
            message.addSegment(result.val);
            break;
          }

          case "IN3": {
            const result = this.parseIN3(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse IN3 segment at line ${i + 1}: ${result.err.message}`) };
            }
            if (currentInsurance) {
              currentInsurance.in3List.push(result.val);
            }
            message.addSegment(result.val);
            break;
          }

          case "ACC": {
            const result = this.parseACC(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse ACC segment at line ${i + 1}: ${result.err.message}`) };
            }
            acc = result.val;
            message.addSegment(result.val);
            break;
          }

          case "UB1": {
            const result = this.parseUB1(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse UB1 segment at line ${i + 1}: ${result.err.message}`) };
            }
            ub1 = result.val;
            message.addSegment(result.val);
            break;
          }

          case "UB2": {
            const result = this.parseUB2(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse UB2 segment at line ${i + 1}: ${result.err.message}`) };
            }
            ub2 = result.val;
            message.addSegment(result.val);
            break;
          }

          default:
            console.warn(`Skipping unsupported segment type '${segmentType}' at line ${i + 1}`);
            break;
        }
      }

      // Finalize any open groups
      if (currentProcedure) {
        procedures.push({
          pr1: currentProcedure.pr1,
          rolList: currentProcedure.rolList.length ? currentProcedure.rolList : undefined,
        });
      }
      if (currentInsurance) {
        insuranceGroups.push({
          in1: currentInsurance.in1,
          in2: currentInsurance.in2,
          in3List: currentInsurance.in3List.length ? currentInsurance.in3List : undefined,
        });
      }

      if (!pid) {
        return { ok: false, err: new Err("ADT_A28 message must contain a PID segment") };
      }

      return {
        ok: true,
        val: {
          message,
          msh,
          evn,
          pid,
          pd1,
          rolList: rolList.length ? rolList : undefined,
          nk1List: nk1List.length ? nk1List : undefined,
          pv1,
          pv2,
          db1List: db1List.length ? db1List : undefined,
          obxList: obxList.length ? obxList : undefined,
          al1List: al1List.length ? al1List : undefined,
          dg1List: dg1List.length ? dg1List : undefined,
          drg,
          procedures: procedures.length ? procedures : undefined,
          gt1List: gt1List.length ? gt1List : undefined,
          insuranceGroups: insuranceGroups.length ? insuranceGroups : undefined,
          acc,
          ub1,
          ub2,
        },
      };
    } catch (error) {
      return { ok: false, err: new Err(`Failed to parse ADT_A28 message: ${error}`) };
    }
  }
}

export function parseADT_A28(messageString: string): Result<ParsedADT_A28> {
  return new ADT_A28_Parser().parse(messageString);
}
