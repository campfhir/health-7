/**
 * Parser for ACK messages (HL7 v2.3): MSH, MSA, [ERR].
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { MSH } from "../../segments/v2.3/MSH.ts";
import { MSA } from "../../segments/v2.3/MSA.ts";
import { ERR } from "../../segments/v2.3/ERR.ts";
import type { HL7Message } from "../../types/message.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import {
  misplacedSegment,
  readMessageHeader,
  segmentParseFailure,
} from "../../utils/messageParsing.ts";

/** Structured result of parsing an HL7 ACK (v2.3) message. */
export interface ParsedACK {
  /** The message value. */
  message: HL7Message;
  /** The msh value. */
  msh: MSH;
  /** The msa value. */
  msa: MSA;
  /** The err value. */
  err?: ERR;
}

/** Parser for HL7 ACK (v2.3) messages. */
export class ACK_Parser {
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

  /** Parses the input string into a structured instance. */
  parse(messageString: string): Result<ParsedACK> {
    try {
      const header = readMessageHeader(messageString, (s) => this.parseMSH(s));
      if (!header.ok || !header.val) return header as Result<never>;
      const { segments, msh, encoding, message } = header.val;

      let msa: MSA | undefined;
      let err: ERR | undefined;

      for (let i = 1; i < segments.length; i++) {
        const segmentStr = segments[i];
        const segmentType = segmentStr.substring(0, 3);

        switch (segmentType) {
          case "MSA": {
            const result = this.parseMSA(segmentStr, encoding);
            if (!result.ok || !result.val) return segmentParseFailure("MSA", i + 1, result);
            if (msa) return misplacedSegment("MSA", i + 1, "appears more than once");
            msa = result.val;
            message.addSegment(msa);
            break;
          }
          case "ERR": {
            const result = this.parseERR(segmentStr, encoding);
            if (!result.ok || !result.val) return segmentParseFailure("ERR", i + 1, result);
            if (!msa) return misplacedSegment("ERR", i + 1, "found without preceding MSA segment");
            if (err) return misplacedSegment("ERR", i + 1, "appears more than once");
            err = result.val;
            message.addSegment(err);
            break;
          }
          default:
            console.warn(
              `Skipping unsupported segment type '${segmentType}' at line ${i + 1}`,
            );
            break;
        }
      }

      if (!msa) {
        return { ok: false, err: new Err("ACK message must contain an MSA segment") };
      }

      return { ok: true, val: { message, msh, msa, err } };
    } catch (error) {
      return { ok: false, err: new Err(`Failed to parse ACK message: ${error}`) };
    }
  }
}

/** Parses an HL7 ACK (v2.3) message string into a structured result. */
export function parseACK(messageString: string): Result<ParsedACK> {
  return new ACK_Parser().parse(messageString);
}
