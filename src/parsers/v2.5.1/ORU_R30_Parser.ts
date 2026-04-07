import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { HL7Message } from "../../types/message";
import { MSH } from "../../segments/v2.5.1/MSH";
import { PID } from "../../segments/v2.5.1/PID";
import { PV1 } from "../../segments/v2.5.1/PV1";
import { ORC } from "../../segments/v2.5.1/ORC";
import { OBR } from "../../segments/v2.5.1/OBR";
import { OBX } from "../../segments/v2.5.1/OBX";

export interface ParsedORU_R30 {
  message: HL7Message;
  msh: MSH;
  patientResults: ParsedPatientResultR30[];
}

export interface ParsedPatientResultR30 {
  pid?: PID;
  pv1?: PV1;
  orderObservations: ParsedOrderObservationR30[];
}

export interface ParsedOrderObservationR30 {
  orc: ORC;
  obr: OBR;
  obxList: OBX[];
}

export class ORU_R30_Parser {
  parse(messageString: string): Result<ParsedORU_R30> {
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
      // Get encoding from the parsed MSH segment
      const encoding = msh.getEncoding();
      const message = new HL7Message(encoding);
      message.addSegment(msh);

      const patientResults: ParsedPatientResultR30[] = [];
      let currentPatientResult: ParsedPatientResultR30 | null = null;
      let currentOrderObservation: ParsedOrderObservationR30 | null = null;

      for (let i = 1; i < segments.length; i++) {
        const segmentStr = segments[i];
        const segmentType = segmentStr.substring(0, 3);

        switch (segmentType) {
          case "PID": {
            if (currentPatientResult && currentOrderObservation) {
              currentPatientResult.orderObservations.push(
                currentOrderObservation,
              );
              currentOrderObservation = null;
            }
            if (currentPatientResult) {
              patientResults.push(currentPatientResult);
            }

            const pidResult = PID.parse(segmentStr, encoding);
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

          case "PV1": {
            const pv1Result = PV1.parse(segmentStr, encoding);
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
              currentPatientResult?.orderObservations.push(
                currentOrderObservation,
              );
            }

            const orcResult = ORC.parse(segmentStr, encoding);
            if (!orcResult.ok || !orcResult.val) {
              return {
                ok: false,
                err: new Err(
                  `Failed to parse ORC segment at line ${i + 1}: ${orcResult.err.message}`,
                ),
              };
            }

            if (!currentPatientResult) {
              currentPatientResult = {
                orderObservations: [],
              };
            }

            currentOrderObservation = {
              orc: orcResult.val,
              obr: null as any,
              obxList: [],
            };
            message.addSegment(orcResult.val);
            break;
          }

          case "OBR": {
            const obrResult = OBR.parse(segmentStr, encoding);
            if (!obrResult.ok || !obrResult.val) {
              return {
                ok: false,
                err: new Err(
                  `Failed to parse OBR segment at line ${i + 1}: ${obrResult.err.message}`,
                ),
              };
            }

            if (!currentOrderObservation) {
              return {
                ok: false,
                err: new Err(
                  `OBR segment at line ${i + 1} found without preceding ORC segment`,
                ),
              };
            }

            currentOrderObservation.obr = obrResult.val;
            message.addSegment(obrResult.val);
            break;
          }

          case "OBX": {
            const obxResult = OBX.parse(segmentStr, encoding);
            if (!obxResult.ok || !obxResult.val) {
              return {
                ok: false,
                err: new Err(
                  `Failed to parse OBX segment at line ${i + 1}: ${obxResult.err.message}`,
                ),
              };
            }

            if (!currentOrderObservation || !currentOrderObservation.obr) {
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

          default:
            return {
              ok: false,
              err: new Err(
                `Unsupported segment type '${segmentType}' at line ${i + 1}`,
              ),
            };
        }
      }

      if (currentOrderObservation) {
        currentPatientResult?.orderObservations.push(currentOrderObservation);
      }

      if (currentPatientResult) {
        patientResults.push(currentPatientResult);
      }

      if (patientResults.length === 0) {
        return {
          ok: false,
          err: new Err(
            "ORU_R30 message must contain at least one patient result",
          ),
        };
      }

      return {
        ok: true,
        val: {
          message,
          msh,
          patientResults,
        },
      };
    } catch (error) {
      return {
        ok: false,
        err: new Err(`Failed to parse ORU_R30 message: ${error}`),
      };
    }
  }
}

export function parseORU_R30(messageString: string): Result<ParsedORU_R30> {
  const parser = new ORU_R30_Parser();
  return parser.parse(messageString);
}

// R31 and R32 use the same parser
export function parseORU_R31(messageString: string): Result<ParsedORU_R30> {
  return parseORU_R30(messageString);
}

export function parseORU_R32(messageString: string): Result<ParsedORU_R30> {
  return parseORU_R30(messageString);
}
