import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { MSH } from "../../segments/v2.3/MSH";
import { EVN } from "../../segments/v2.3/EVN";
import { PID } from "../../segments/v2.3/PID";
import { PD1 } from "../../segments/v2.3/PD1";
import { MRG } from "../../segments/v2.3/MRG";
import { PV1 } from "../../segments/v2.3/PV1";
import { HL7Message } from "../../types/message";
import { EncodingCharacters } from "../../types/encoding";

export interface ParsedADT_A34 {
  message: HL7Message;
  msh: MSH;
  evn?: EVN;
  pid: PID;
  pd1?: PD1;
  mrg: MRG;
  pv1?: PV1;
}

export class ADT_A34_Parser {
  protected readonly messageName: string = "ADT_A34";

  protected parseMSH(s: string): Result<MSH> { return MSH.parse(s); }
  protected parseEVN(s: string, e: EncodingCharacters): Result<EVN> { return EVN.parse(s, e); }
  protected parsePID(s: string, e: EncodingCharacters): Result<PID> { return PID.parse(s, e); }
  protected parsePD1(s: string, e: EncodingCharacters): Result<PD1> { return PD1.parse(s, e); }
  protected parseMRG(s: string, e: EncodingCharacters): Result<MRG> { return MRG.parse(s, e); }
  protected parsePV1(s: string, e: EncodingCharacters): Result<PV1> { return PV1.parse(s, e); }

  parse(messageString: string): Result<ParsedADT_A34> {
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
      let mrg: MRG | undefined;
      let pv1: PV1 | undefined;

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
          case "MRG": {
            const r = this.parseMRG(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse MRG at line ${i + 1}: ${r.err.message}`) };
            mrg = r.val; message.addSegment(r.val); break;
          }
          case "PV1": {
            const r = this.parsePV1(segmentStr, encoding);
            if (!r.ok || !r.val) return { ok: false, err: new Err(`Failed to parse PV1 at line ${i + 1}: ${r.err.message}`) };
            pv1 = r.val; message.addSegment(r.val); break;
          }
          default:
            console.warn(`Skipping unsupported segment type '${segmentType}' at line ${i + 1}`);
            break;
        }
      }

      if (!pid) {
        return { ok: false, err: new Err(`${this.messageName} message must contain a PID segment`) };
      }
      if (!mrg) {
        return { ok: false, err: new Err(`${this.messageName} message must contain a MRG segment`) };
      }

      return { ok: true, val: { message, msh, evn, pid, pd1, mrg, pv1 } };
    } catch (error) {
      return { ok: false, err: new Err(`Failed to parse ${this.messageName} message: ${error}`) };
    }
  }
}

export function parseADT_A34(messageString: string): Result<ParsedADT_A34> {
  return new ADT_A34_Parser().parse(messageString);
}
