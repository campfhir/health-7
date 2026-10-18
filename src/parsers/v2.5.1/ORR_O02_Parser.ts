import { Result } from "../../types/result";
import { EncodingCharacters } from "../../types/encoding";
import { MSH } from "../../segments/v2.5.1/MSH";
import { MSA } from "../../segments/v2.5.1/MSA";
import { ERR } from "../../segments/v2.5.1/ERR";
import { NTE } from "../../segments/v2.5.1/NTE";
import { PID } from "../../segments/v2.5.1/PID";
import { ORC } from "../../segments/v2.5.1/ORC";
import { OBR } from "../../segments/v2.5.1/OBR";
import { RQD } from "../../segments/v2.5.1/RQD";
import { RQ1 } from "../../segments/v2.5.1/RQ1";
import { RXO } from "../../segments/v2.5.1/RXO";
import { ODS } from "../../segments/v2.5.1/ODS";
import { ODT } from "../../segments/v2.5.1/ODT";
import { CTI } from "../../segments/v2.5.1/CTI";
import {
  ORR_O02_Parser as ORR_O02_Parser_base,
  ParsedORR_O02,
  ParsedResponse,
  ParsedResponsePatient,
  ParsedResponseOrder,
  ParsedResponseDetail,
} from "../v2.5/ORR_O02_Parser";

export type { ParsedORR_O02, ParsedResponse, ParsedResponsePatient, ParsedResponseOrder, ParsedResponseDetail };

export class ORR_O02_Parser extends ORR_O02_Parser_base {
  protected override parseMSH(s: string): Result<MSH> {
    return MSH.parse(s);
  }

  protected override parseMSA(s: string, e: EncodingCharacters): Result<MSA> {
    return MSA.parse(s, e);
  }

  protected override parseERR(s: string, e: EncodingCharacters): Result<ERR> {
    return ERR.parse(s, e);
  }

  protected override parseNTE(s: string, e: EncodingCharacters): Result<NTE> {
    return NTE.parse(s, e);
  }

  protected override parsePID(s: string, e: EncodingCharacters): Result<PID> {
    return PID.parse(s, e);
  }

  protected override parseORC(s: string, e: EncodingCharacters): Result<ORC> {
    return ORC.parse(s, e);
  }

  protected override parseOBR(s: string, e: EncodingCharacters): Result<OBR> {
    return OBR.parse(s, e);
  }

  protected override parseRQD(s: string, e: EncodingCharacters): Result<RQD> {
    return RQD.parse(s, e);
  }

  protected override parseRQ1(s: string, e: EncodingCharacters): Result<RQ1> {
    return RQ1.parse(s, e);
  }

  protected override parseRXO(s: string, e: EncodingCharacters): Result<RXO> {
    return RXO.parse(s, e);
  }

  protected override parseODS(s: string, e: EncodingCharacters): Result<ODS> {
    return ODS.parse(s, e);
  }

  protected override parseODT(s: string, e: EncodingCharacters): Result<ODT> {
    return ODT.parse(s, e);
  }

  protected override parseCTI(s: string, e: EncodingCharacters): Result<CTI> {
    return CTI.parse(s, e);
  }
}

export function parseORR_O02(messageString: string): Result<ParsedORR_O02> {
  return new ORR_O02_Parser().parse(messageString);
}
