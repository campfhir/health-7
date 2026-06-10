/**
 * Parser for ORU^R01 messages (HL7 v2.3).
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { MSH } from "../../segments/v2.3/MSH.ts";
import { PID } from "../../segments/v2.3/PID.ts";
import { PV1 } from "../../segments/v2.3/PV1.ts";
import { ORC } from "../../segments/v2.3/ORC.ts";
import { OBR } from "../../segments/v2.3/OBR.ts";
import { OBX } from "../../segments/v2.3/OBX.ts";
import { NTE } from "../../segments/v2.3/NTE.ts";
import { NK1 } from "../../segments/v2.3/NK1.ts";
import { PD1 } from "../../segments/v2.3/PD1.ts";
import { CTI } from "../../segments/v2.3/CTI.ts";
import { HL7Message } from "../../types/message.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";

/** Structured result of parsing an HL7 ORU^R01 (v2.3) message. */
export interface ParsedOrderObservation {
  /** The orc value. */
  orc?: ORC;
  /** The obr value. */
  obr: OBR;
  /** The obr nte list value. */
  obrNteList?: NTE[];
  /** The obx list value. */
  obxList: OBX[];
  /** The obx nte map value. */
  obxNteMap?: Map<number, NTE[]>;
  /** The cti list value. */
  ctiList?: CTI[];
}

/** Structured result of parsing an HL7 ORU^R01 (v2.3) message. */
export interface ParsedPatientResult {
  /** The pid value. */
  pid?: PID;
  /** The pd1 value. */
  pd1?: PD1;
  /** The nk1 list value. */
  nk1List?: NK1[];
  /** The nte list value. */
  nteList?: NTE[];
  /** The pv1 value. */
  pv1?: PV1;
  /** The order observations value. */
  orderObservations: ParsedOrderObservation[];
}

/** Structured result of parsing an HL7 ORU^R01 (v2.3) message. */
export interface ParsedORU_R01 {
  /** The message value. */
  message: HL7Message;
  /** The msh value. */
  msh: MSH;
  /** The patient results value. */
  patientResults: ParsedPatientResult[];
}

/** Parser for HL7 ORU^R01 (v2.3) messages. */
export class ORU_R01_Parser {
  /** Parse msh. */
  protected parseMSH(s: string): Result<MSH> {
    return MSH.parse(s);
  }
  /** Parse pid. */
  protected parsePID(s: string, e: EncodingCharacters): Result<PID> {
    return PID.parse(s, e);
  }
  /** Parse pd1. */
  protected parsePD1(s: string, e: EncodingCharacters): Result<PD1> {
    return PD1.parse(s, e);
  }
  /** Parse nk1. */
  protected parseNK1(s: string, e: EncodingCharacters): Result<NK1> {
    return NK1.parse(s, e) as Result<NK1>;
  }
  /** Parse nte. */
  protected parseNTE(s: string, e: EncodingCharacters): Result<NTE> {
    return NTE.parse(s, e);
  }
  /** Parse pv1. */
  protected parsePV1(s: string, e: EncodingCharacters): Result<PV1> {
    return PV1.parse(s, e);
  }
  /** Parse orc. */
  protected parseORC(s: string, e: EncodingCharacters): Result<ORC> {
    return ORC.parse(s, e);
  }
  /** Parse obr. */
  protected parseOBR(s: string, e: EncodingCharacters): Result<OBR> {
    return OBR.parse(s, e);
  }
  /** Parse obx. */
  protected parseOBX(s: string, e: EncodingCharacters): Result<OBX> {
    return OBX.parse(s, e);
  }

  /** Parse cti. */
  protected parseCTI(s: string, e: EncodingCharacters): Result<CTI> {
    return CTI.parse(s, e);
  }

  /** Parses the input string into a structured instance. */
  parse(messageString: string): Result<ParsedORU_R01> {
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

      const mshResult = this.parseMSH(mshSegment);
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

      type InProgressOrderObservation = Omit<ParsedOrderObservation, "obr"> & {
        obr: OBR | null;
      };

      const isComplete = (
        obs: InProgressOrderObservation,
      ): obs is ParsedOrderObservation => obs.obr !== null;

      const patientResults: ParsedPatientResult[] = [];
      let currentPatientResult: ParsedPatientResult | null = null;
      let currentOrderObservation: InProgressOrderObservation | null = null;

      for (let i = 1; i < segments.length; i++) {
        const segmentStr = segments[i];
        const segmentType = segmentStr.substring(0, 3);

        switch (segmentType) {
          case "PID": {
            if (currentPatientResult && currentOrderObservation && isComplete(currentOrderObservation)) {
              currentPatientResult.orderObservations.push(currentOrderObservation);
              currentOrderObservation = null;
            }
            if (currentPatientResult) {
              patientResults.push(currentPatientResult);
            }
            const pidResult = this.parsePID(segmentStr, encoding);
            if (!pidResult.ok || !pidResult.val) {
              return {
                ok: false,
                err: new Err(
                  `Failed to parse PID segment at line ${i + 1}: ${pidResult.err.message}`,
                ),
              };
            }
            currentPatientResult = {
              pid: pidResult.val,
              orderObservations: [],
            };
            message.addSegment(pidResult.val);
            break;
          }

          case "PD1": {
            const pd1Result = this.parsePD1(segmentStr, encoding);
            if (!pd1Result.ok || !pd1Result.val) {
              return {
                ok: false,
                err: new Err(
                  `Failed to parse PD1 segment at line ${i + 1}: ${pd1Result.err.message}`,
                ),
              };
            }
            if (currentPatientResult) {
              currentPatientResult.pd1 = pd1Result.val;
            }
            message.addSegment(pd1Result.val);
            break;
          }

          case "NK1": {
            const nk1Result = this.parseNK1(segmentStr, encoding);
            if (!nk1Result.ok || !nk1Result.val) {
              return {
                ok: false,
                err: new Err(
                  `Failed to parse NK1 segment at line ${i + 1}: ${nk1Result.err.message}`,
                ),
              };
            }
            if (currentPatientResult) {
              if (!currentPatientResult.nk1List)
                currentPatientResult.nk1List = [];
              currentPatientResult.nk1List.push(nk1Result.val);
            }
            message.addSegment(nk1Result.val);
            break;
          }

          case "NTE": {
            const nteResult = this.parseNTE(segmentStr, encoding);
            if (!nteResult.ok || !nteResult.val) {
              return {
                ok: false,
                err: new Err(
                  `Failed to parse NTE segment at line ${i + 1}: ${nteResult.err.message}`,
                ),
              };
            }
            if (
              currentOrderObservation &&
              currentOrderObservation.obxList.length > 0
            ) {
              if (!currentOrderObservation.obxNteMap)
                currentOrderObservation.obxNteMap = new Map();
              const obxIndex = currentOrderObservation.obxList.length - 1;
              const nteList =
                currentOrderObservation.obxNteMap.get(obxIndex) || [];
              nteList.push(nteResult.val);
              currentOrderObservation.obxNteMap.set(obxIndex, nteList);
            } else if (currentOrderObservation && currentOrderObservation.obr) {
              if (!currentOrderObservation.obrNteList)
                currentOrderObservation.obrNteList = [];
              currentOrderObservation.obrNteList.push(nteResult.val);
            } else if (currentPatientResult) {
              if (!currentPatientResult.nteList)
                currentPatientResult.nteList = [];
              currentPatientResult.nteList.push(nteResult.val);
            }
            message.addSegment(nteResult.val);
            break;
          }

          case "PV1": {
            const pv1Result = this.parsePV1(segmentStr, encoding);
            if (!pv1Result.ok || !pv1Result.val) {
              return {
                ok: false,
                err: new Err(
                  `Failed to parse PV1 segment at line ${i + 1}: ${pv1Result.err.message}`,
                ),
              };
            }
            if (currentPatientResult) {
              currentPatientResult.pv1 = pv1Result.val;
            }
            message.addSegment(pv1Result.val);
            break;
          }

          case "ORC": {
            if (currentOrderObservation) {
              if (isComplete(currentOrderObservation)) {
                currentPatientResult?.orderObservations.push(currentOrderObservation);
              }
              currentOrderObservation = null;
            }
            const orcResult = this.parseORC(segmentStr, encoding);
            if (!orcResult.ok || !orcResult.val) {
              return {
                ok: false,
                err: new Err(
                  `Failed to parse ORC segment at line ${i + 1}: ${orcResult.err.message}`,
                ),
              };
            }
            if (!currentPatientResult) {
              currentPatientResult = { orderObservations: [] };
            }
            currentOrderObservation = {
              orc: orcResult.val,
              obr: null,
              obxList: [],
            };
            message.addSegment(orcResult.val);
            break;
          }

          case "OBR": {
            const obrResult = this.parseOBR(segmentStr, encoding);
            if (!obrResult.ok || !obrResult.val) {
              return {
                ok: false,
                err: new Err(
                  `Failed to parse OBR segment at line ${i + 1}: ${obrResult.err.message}`,
                ),
              };
            }
            if (!currentPatientResult) {
              currentPatientResult = { orderObservations: [] };
            }
            if (
              currentOrderObservation &&
              currentOrderObservation.orc &&
              !currentOrderObservation.obr
            ) {
              currentOrderObservation.obr = obrResult.val;
            } else {
              if (currentOrderObservation && isComplete(currentOrderObservation)) {
                currentPatientResult.orderObservations.push(currentOrderObservation);
              }
              currentOrderObservation = { obr: obrResult.val, obxList: [] };
            }
            message.addSegment(obrResult.val);
            break;
          }

          case "OBX": {
            const obxResult = this.parseOBX(segmentStr, encoding);
            if (!obxResult.ok || !obxResult.val) {
              return {
                ok: false,
                err: new Err(
                  `Failed to parse OBX segment at line ${i + 1}: ${obxResult.err.message}`,
                ),
              };
            }
            if (!currentOrderObservation) {
              return {
                ok: false,
                err: new Err(
                  `OBX segment at line ${i + 1} found without preceding OBR segment`,
                ),
              };
            }
            currentOrderObservation.obxList.push(obxResult.val);
            message.addSegment(obxResult.val);
            break;
          }

          case "CTI": {
            const ctiResult = this.parseCTI(segmentStr, encoding);
            if (!ctiResult.ok || !ctiResult.val) {
              return {
                ok: false,
                err: new Err(
                  `Failed to parse CTI segment at line ${i + 1}: ${ctiResult.err.message}`,
                ),
              };
            }
            if (currentOrderObservation) {
              if (!currentOrderObservation.ctiList) currentOrderObservation.ctiList = [];
              currentOrderObservation.ctiList.push(ctiResult.val);
            }
            message.addSegment(ctiResult.val);
            break;
          }

          default:
            console.warn(
              `Skipping unsupported segment type '${segmentType}' at line ${i + 1}`,
            );
            break;
        }
      }

      if (currentOrderObservation && isComplete(currentOrderObservation)) {
        currentPatientResult?.orderObservations.push(currentOrderObservation);
      }
      if (currentPatientResult) {
        patientResults.push(currentPatientResult);
      }

      if (patientResults.length === 0) {
        return {
          ok: false,
          err: new Err(
            "ORU_R01 message must contain at least one patient result",
          ),
        };
      }

      return { ok: true, val: { message, msh, patientResults } };
    } catch (error) {
      return {
        ok: false,
        err: new Err(`Failed to parse ORU_R01 message: ${error}`),
      };
    }
  }
}

/** Parses an HL7 ORU^R01 (v2.3) message string into a structured result. */
export function parseORU_R01(messageString: string): Result<ParsedORU_R01> {
  return new ORU_R01_Parser().parse(messageString);
}
