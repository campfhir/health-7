import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { MSH } from "../../segments/v2.3/MSH";
import { MFI } from "../../segments/v2.3/MFI";
import { MFE } from "../../segments/v2.3/MFE";
import { STF } from "../../segments/v2.3/STF";
import { PRA } from "../../segments/v2.3/PRA";
import { HL7Message } from "../../types/message";
import { EncodingCharacters } from "../../types/encoding";

export interface ParsedStaffEntry {
  mfe: MFE;
  stf: STF;
  pra?: PRA;
}

export interface ParsedMFN_M02 {
  message: HL7Message;
  msh: MSH;
  mfi: MFI;
  staffEntries: ParsedStaffEntry[];
}

export class MFN_M02_Parser {
  protected parseMFI(s: string, e: EncodingCharacters): Result<MFI> {
    return MFI.parse(s, e);
  }
  protected parseMFE(s: string, e: EncodingCharacters): Result<MFE> {
    return MFE.parse(s, e);
  }
  protected parseSTF(s: string, e: EncodingCharacters): Result<STF> {
    return STF.parse(s, e);
  }
  protected parsePRA(s: string, e: EncodingCharacters): Result<PRA> {
    return PRA.parse(s, e);
  }

  parse(messageString: string): Result<ParsedMFN_M02> {
    try {
      const segments = messageString
        .split(/\r\n|\r|\n/)
        .filter((s) => s.trim().length > 0);

      if (segments.length === 0) {
        return { ok: false, err: new Err("Empty message") };
      }

      const mshSegment = segments[0];
      if (!mshSegment.startsWith("MSH")) {
        return {
          ok: false,
          err: new Err("Message must start with MSH segment"),
        };
      }

      const mshResult = MSH.parse(mshSegment);
      if (!mshResult.ok || !mshResult.val) {
        return {
          ok: false,
          err: new Err(mshResult.err.message || "Failed to parse MSH segment"),
        };
      }

      const msh = mshResult.val;
      const encoding = msh.getEncoding();
      const message = new HL7Message(encoding);
      message.addSegment(msh);

      let mfi: MFI | null = null;
      const staffEntries: ParsedStaffEntry[] = [];
      let currentEntry: Partial<ParsedStaffEntry> | null = null;

      for (let i = 1; i < segments.length; i++) {
        const segmentStr = segments[i];
        const segmentType = segmentStr.substring(0, 3);

        switch (segmentType) {
          case "MFI": {
            const result = this.parseMFI(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return {
                ok: false,
                err: new Err(
                  `Failed to parse MFI segment at line ${i + 1}: ${result.err.message}`,
                ),
              };
            }
            mfi = result.val;
            message.addSegment(mfi);
            break;
          }

          case "MFE": {
            if (currentEntry?.mfe && currentEntry?.stf) {
              staffEntries.push(currentEntry as ParsedStaffEntry);
            }
            const result = this.parseMFE(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return {
                ok: false,
                err: new Err(
                  `Failed to parse MFE segment at line ${i + 1}: ${result.err.message}`,
                ),
              };
            }
            currentEntry = { mfe: result.val };
            message.addSegment(result.val);
            break;
          }

          case "STF": {
            const result = this.parseSTF(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return {
                ok: false,
                err: new Err(
                  `Failed to parse STF segment at line ${i + 1}: ${result.err.message}`,
                ),
              };
            }
            if (!currentEntry) {
              return {
                ok: false,
                err: new Err(
                  `STF segment at line ${i + 1} found without preceding MFE segment`,
                ),
              };
            }
            currentEntry.stf = result.val;
            message.addSegment(result.val);
            break;
          }

          case "PRA": {
            const result = this.parsePRA(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return {
                ok: false,
                err: new Err(
                  `Failed to parse PRA segment at line ${i + 1}: ${result.err.message}`,
                ),
              };
            }
            if (!currentEntry) {
              return {
                ok: false,
                err: new Err(
                  `PRA segment at line ${i + 1} found without preceding MFE segment`,
                ),
              };
            }
            currentEntry.pra = result.val;
            message.addSegment(result.val);
            break;
          }

          default:
            console.warn(
              `Skipping unsupported segment type '${segmentType}' at line ${i + 1}`,
            );
            break;
        }
      }

      if (currentEntry?.mfe && currentEntry?.stf) {
        staffEntries.push(currentEntry as ParsedStaffEntry);
      }

      if (!mfi) {
        return {
          ok: false,
          err: new Err("MFN_M02 message must contain an MFI segment"),
        };
      }

      if (staffEntries.length === 0) {
        return {
          ok: false,
          err: new Err(
            "MFN_M02 message must contain at least one staff entry (MFE+STF)",
          ),
        };
      }

      return { ok: true, val: { message, msh, mfi, staffEntries } };
    } catch (error) {
      return {
        ok: false,
        err: new Err(`Failed to parse MFN_M02 message: ${error}`),
      };
    }
  }
}

export function parseMFN_M02(messageString: string): Result<ParsedMFN_M02> {
  return new MFN_M02_Parser().parse(messageString);
}
