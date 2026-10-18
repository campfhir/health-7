/**
 * Parser for ACK messages (HL7 v2.5): MSH, [{SFT}], MSA, [{ERR}].
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { MSH } from "../../segments/v2.5/MSH.ts";
import { SFT } from "../../segments/v2.5/SFT.ts";
import { MSA } from "../../segments/v2.5/MSA.ts";
import { ERR } from "../../segments/v2.5/ERR.ts";
import type { HL7Message } from "../../types/message.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import {
  misplacedSegment,
  readMessageHeader,
  segmentParseFailure,
} from "../../utils/messageParsing.ts";

/** Structured result of parsing an HL7 ACK (v2.5) message. */
export interface ParsedACK {
  /** The message value. */
  message: HL7Message;
  /** The msh value. */
  msh: MSH;
  /** The software segments, which precede MSA. */
  sftList: SFT[];
  /** The msa value. */
  msa: MSA;
  /** The error segments, which follow MSA. */
  errList: ERR[];
}

/** Parser for HL7 ACK (v2.5) messages. */
export class ACK_Parser {
  /** Parse msh. */
  protected parseMSH(s: string): Result<MSH> {
    return MSH.parse(s);
  }
  /** Parse sft. */
  protected parseSFT(s: string, e: EncodingCharacters): Result<SFT> {
    return SFT.parse(s, e);
  }
  /** Parse msa. */
  protected parseMSA(s: string, e: EncodingCharacters): Result<MSA> {
    return MSA.parse(s, e);
  }
  /** Parse err. */
  protected parseERR(s: string, e: EncodingCharacters): Result<ERR> {
    return ERR.parse(s, e);
  }

  /** Parses the input string into a structured instance. */
  parse(messageString: string): Result<ParsedACK> {
    try {
      const header = readMessageHeader(messageString, (s) => this.parseMSH(s));
      if (!header.ok || !header.val) return header as Result<never>;
      const { segments, msh, encoding, message } = header.val;

      const sftList: SFT[] = [];
      const errList: ERR[] = [];
      let msa: MSA | undefined;

      for (let i = 1; i < segments.length; i++) {
        const segmentStr = segments[i];
        const segmentType = segmentStr.substring(0, 3);
        const line = i + 1;

        switch (segmentType) {
          case "SFT": {
            const result = this.parseSFT(segmentStr, encoding);
            if (!result.ok || !result.val) return segmentParseFailure("SFT", line, result);
            if (msa) return misplacedSegment("SFT", line, "must appear before the MSA segment");
            sftList.push(result.val);
            message.addSegment(result.val);
            break;
          }
          case "MSA": {
            const result = this.parseMSA(segmentStr, encoding);
            if (!result.ok || !result.val) return segmentParseFailure("MSA", line, result);
            if (msa) return misplacedSegment("MSA", line, "appears more than once");
            msa = result.val;
            message.addSegment(msa);
            break;
          }
          case "ERR": {
            const result = this.parseERR(segmentStr, encoding);
            if (!result.ok || !result.val) return segmentParseFailure("ERR", line, result);
            if (!msa) return misplacedSegment("ERR", line, "found without preceding MSA segment");
            errList.push(result.val);
            message.addSegment(result.val);
            break;
          }
          default:
            console.warn(`Skipping unsupported segment type '${segmentType}' at line ${line}`);
            break;
        }
      }

      if (!msa) {
        return { ok: false, err: new Err("ACK message must contain an MSA segment") };
      }

      return { ok: true, val: { message, msh, sftList, msa, errList } };
    } catch (error) {
      return { ok: false, err: new Err(`Failed to parse ACK message: ${error}`) };
    }
  }
}

/** Parses an HL7 ACK (v2.5) message string into a structured result. */
export function parseACK(messageString: string): Result<ParsedACK> {
  return new ACK_Parser().parse(messageString);
}
