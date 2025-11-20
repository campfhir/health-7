import { HL7Message } from "../../types/message";
import { EncodingCharacters } from "../../types/encoding";
import { ParseResult, ParserUtils } from "../../types/parser";
import { MSH, PID, PV1, ORC, OBR, OBX } from "../../segments/v2.5.1";
import { MSHParser } from "./MSHParser";
import { PIDParser } from "./PIDParser";
import { PV1Parser } from "./PV1Parser";
import { ORCParser } from "./ORCParser";
import { OBRParser } from "./OBRParser";
import { OBXParser } from "./OBXParser";

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
  private mshParser = new MSHParser();
  private pidParser = new PIDParser();
  private pv1Parser = new PV1Parser();
  private orcParser = new ORCParser();
  private obrParser = new OBRParser();
  private obxParser = new OBXParser();

  parse(messageString: string): ParseResult<ParsedORU_R30> {
    try {
      const segments = messageString
        .split(/\r\n|\r|\n/)
        .filter((s) => s.trim().length > 0);

      if (segments.length === 0) {
        return {
          success: false,
          error: "Empty message",
        };
      }

      const mshSegment = segments[0];
      if (!mshSegment.startsWith("MSH")) {
        return {
          success: false,
          error: "Message must start with MSH segment",
        };
      }

      const mshResult = this.mshParser.parse(mshSegment);
      if (!mshResult.success || !mshResult.data) {
        return {
          success: false,
          error: mshResult.error || "Failed to parse MSH segment",
        };
      }

      const msh = mshResult.data;
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

            const pidResult = this.pidParser.parse(segmentStr, encoding);
            if (!pidResult.success || !pidResult.data) {
              return {
                success: false,
                error: `Failed to parse PID segment at line ${i + 1}: ${pidResult.error}`,
              };
            }

            currentPatientResult = {
              pid: pidResult.data,
              orderObservations: [],
            };
            message.addSegment(pidResult.data);
            break;
          }

          case "PV1": {
            const pv1Result = this.pv1Parser.parse(segmentStr, encoding);
            if (!pv1Result.success || !pv1Result.data) {
              return {
                success: false,
                error: `Failed to parse PV1 segment at line ${i + 1}: ${pv1Result.error}`,
              };
            }

            if (currentPatientResult) {
              currentPatientResult.pv1 = pv1Result.data;
            }
            message.addSegment(pv1Result.data);
            break;
          }

          case "ORC": {
            if (currentOrderObservation) {
              currentPatientResult?.orderObservations.push(
                currentOrderObservation,
              );
            }

            const orcResult = this.orcParser.parse(segmentStr, encoding);
            if (!orcResult.success || !orcResult.data) {
              return {
                success: false,
                error: `Failed to parse ORC segment at line ${i + 1}: ${orcResult.error}`,
              };
            }

            if (!currentPatientResult) {
              currentPatientResult = {
                orderObservations: [],
              };
            }

            currentOrderObservation = {
              orc: orcResult.data,
              obr: null as any,
              obxList: [],
            };
            message.addSegment(orcResult.data);
            break;
          }

          case "OBR": {
            const obrResult = this.obrParser.parse(segmentStr, encoding);
            if (!obrResult.success || !obrResult.data) {
              return {
                success: false,
                error: `Failed to parse OBR segment at line ${i + 1}: ${obrResult.error}`,
              };
            }

            if (!currentOrderObservation) {
              return {
                success: false,
                error: `OBR segment at line ${i + 1} found without preceding ORC segment`,
              };
            }

            currentOrderObservation.obr = obrResult.data;
            message.addSegment(obrResult.data);
            break;
          }

          case "OBX": {
            const obxResult = this.obxParser.parse(segmentStr, encoding);
            if (!obxResult.success || !obxResult.data) {
              return {
                success: false,
                error: `Failed to parse OBX segment at line ${i + 1}: ${obxResult.error}`,
              };
            }

            if (!currentOrderObservation || !currentOrderObservation.obr) {
              return {
                success: false,
                error: `OBX segment at line ${i + 1} found without preceding OBR segment`,
              };
            }

            currentOrderObservation.obxList.push(obxResult.data);
            message.addSegment(obxResult.data);
            break;
          }

          default:
            return {
              success: false,
              error: `Unsupported segment type '${segmentType}' at line ${i + 1}`,
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
          success: false,
          error: "ORU_R30 message must contain at least one patient result",
        };
      }

      return {
        success: true,
        data: {
          message,
          msh,
          patientResults,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to parse ORU_R30 message: ${error}`,
      };
    }
  }
}

export function parseORU_R30(
  messageString: string,
): ParseResult<ParsedORU_R30> {
  const parser = new ORU_R30_Parser();
  return parser.parse(messageString);
}

// R31 and R32 use the same parser
export function parseORU_R31(
  messageString: string,
): ParseResult<ParsedORU_R30> {
  return parseORU_R30(messageString);
}

export function parseORU_R32(
  messageString: string,
): ParseResult<ParsedORU_R30> {
  return parseORU_R30(messageString);
}
