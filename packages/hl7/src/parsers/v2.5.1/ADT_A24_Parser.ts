/**
 * Parser for ADT^A24 messages (HL7 v2.5.1).
 *
 * @module
 */
import type { Result } from "../../types/result.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { MSH } from "../../segments/v2.5.1/MSH.ts";
import { EVN } from "../../segments/v2.5.1/EVN.ts";
import { PID } from "../../segments/v2.5.1/PID.ts";
import { PD1 } from "../../segments/v2.5.1/PD1.ts";
import { PV1 } from "../../segments/v2.5.1/PV1.ts";
import { DB1 } from "../../segments/v2.5.1/DB1.ts";
import {
  ADT_A24_Parser as ADT_A24_Parser_base,
  type ParsedADT_A24,
  type ParsedLinkedPatient,
} from "../v2.5/ADT_A24_Parser.ts";

export type { ParsedADT_A24, ParsedLinkedPatient };

/** Parser for HL7 ADT^A24 (v2.5.1) messages. */
export class ADT_A24_Parser extends ADT_A24_Parser_base {
  /** Parse msh. */
  protected override parseMSH(s: string): Result<MSH> {
    return MSH.parse(s);
  }

  /** Parse evn. */
  protected override parseEVN(s: string, e: EncodingCharacters): Result<EVN> {
    return EVN.parse(s, e);
  }

  /** Parse pid. */
  protected override parsePID(s: string, e: EncodingCharacters): Result<PID> {
    return PID.parse(s, e);
  }

  /** Parse pd1. */
  protected override parsePD1(s: string, e: EncodingCharacters): Result<PD1> {
    return PD1.parse(s, e);
  }

  /** Parse pv1. */
  protected override parsePV1(s: string, e: EncodingCharacters): Result<PV1> {
    return PV1.parse(s, e);
  }

  /** Parse db1. */
  protected override parseDB1(s: string, e: EncodingCharacters): Result<DB1> {
    return DB1.parse(s, e);
  }
}

/** Parses an HL7 ADT^A24 (v2.5.1) message string into a structured result. */
export function parseADT_A24(messageString: string): Result<ParsedADT_A24> {
  return new ADT_A24_Parser().parse(messageString);
}
