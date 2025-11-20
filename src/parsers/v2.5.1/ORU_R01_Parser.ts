import { HL7Message } from "../../types/message";
import { ParseResult, ParserUtils } from "../../types/parser";
import {
  MSH,
  PID,
  PV1,
  OBR,
  OBX,
  ORC,
  NTE,
  NK1,
  PD1,
} from "../../segments/v2.5.1";
import { MSHParser } from "./MSHParser";
import { PIDParser } from "./PIDParser";
import { PV1Parser } from "./PV1Parser";
import { OBRParser } from "./OBRParser";
import { OBXParser } from "./OBXParser";
import { ORCParser } from "./ORCParser";

export interface ParsedORU_R01 {
  message: HL7Message;
  msh: MSH;
  patientResults: ParsedPatientResult[];
}

export interface ParsedPatientResult {
  pid?: PID;
  pd1?: PD1;
  nk1List?: NK1[];
  nteList?: NTE[];
  pv1?: PV1;
  orderObservations: ParsedOrderObservation[];
}

export interface ParsedOrderObservation {
  orc?: ORC;
  obr: OBR;
  obrNteList?: NTE[];
  obxList: OBX[];
  obxNteMap?: Map<number, NTE[]>; // Maps OBX index to its NTE segments
}

export class ORU_R01_Parser {
  private mshParser = new MSHParser();
  private pidParser = new PIDParser();
  private pv1Parser = new PV1Parser();
  private orcParser = new ORCParser();
  private obrParser = new OBRParser();
  private obxParser = new OBXParser();

  // Helper to parse NTE segments
  private parseNTE(segmentStr: string, encoding: any): ParseResult<NTE> {
    return NTE.parse(segmentStr, encoding);
  }

  // Helper to parse NK1 segments
  private parseNK1(segmentStr: string, encoding: any): ParseResult<NK1> {
    return NK1.parse(segmentStr, encoding);
  }

  // Helper to parse PD1 segments
  private parsePD1(segmentStr: string, encoding: any): ParseResult<PD1> {
    return PD1.parse(segmentStr, encoding);
  }

  parse(messageString: string): ParseResult<ParsedORU_R01> {
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

      const patientResults: ParsedPatientResult[] = [];
      let currentPatientResult: ParsedPatientResult | null = null;
      let currentOrderObservation: ParsedOrderObservation | null = null;

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

          case "PD1": {
            const pd1Result = this.parsePD1(segmentStr, encoding);
            if (!pd1Result.success || !pd1Result.data) {
              return {
                success: false,
                error: `Failed to parse PD1 segment at line ${i + 1}: ${pd1Result.error}`,
              };
            }

            if (currentPatientResult) {
              currentPatientResult.pd1 = pd1Result.data;
            }
            message.addSegment(pd1Result.data);
            break;
          }

          case "NK1": {
            const nk1Result = this.parseNK1(segmentStr, encoding);
            if (!nk1Result.success || !nk1Result.data) {
              return {
                success: false,
                error: `Failed to parse NK1 segment at line ${i + 1}: ${nk1Result.error}`,
              };
            }

            if (currentPatientResult) {
              if (!currentPatientResult.nk1List) {
                currentPatientResult.nk1List = [];
              }
              currentPatientResult.nk1List.push(nk1Result.data);
            }
            message.addSegment(nk1Result.data);
            break;
          }

          case "NTE": {
            const nteResult = this.parseNTE(segmentStr, encoding);
            if (!nteResult.success || !nteResult.data) {
              return {
                success: false,
                error: `Failed to parse NTE segment at line ${i + 1}: ${nteResult.error}`,
              };
            }

            // NTE can appear after PID (patient notes), OBR (order notes), or OBX (observation notes)
            // Determine context based on what was parsed most recently
            if (
              currentOrderObservation &&
              currentOrderObservation.obxList.length > 0
            ) {
              // NTE after OBX - observation note
              if (!currentOrderObservation.obxNteMap) {
                currentOrderObservation.obxNteMap = new Map();
              }
              const obxIndex = currentOrderObservation.obxList.length - 1;
              const nteList =
                currentOrderObservation.obxNteMap.get(obxIndex) || [];
              nteList.push(nteResult.data);
              currentOrderObservation.obxNteMap.set(obxIndex, nteList);
            } else if (currentOrderObservation && currentOrderObservation.obr) {
              // NTE after OBR - order note
              if (!currentOrderObservation.obrNteList) {
                currentOrderObservation.obrNteList = [];
              }
              currentOrderObservation.obrNteList.push(nteResult.data);
            } else if (currentPatientResult) {
              // NTE after PID - patient note
              if (!currentPatientResult.nteList) {
                currentPatientResult.nteList = [];
              }
              currentPatientResult.nteList.push(nteResult.data);
            }
            message.addSegment(nteResult.data);
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
            // ORC typically precedes OBR. If we have a pending order observation,
            // close it out before starting a new one
            if (currentOrderObservation) {
              currentPatientResult?.orderObservations.push(
                currentOrderObservation,
              );
              currentOrderObservation = null;
            }

            const orcResult = this.orcParser.parse(segmentStr, encoding);
            if (!orcResult.success || !orcResult.data) {
              return {
                success: false,
                error: `Failed to parse ORC segment at line ${i + 1}: ${orcResult.error}`,
              };
            }

            // Store ORC temporarily - it will be associated with the next OBR
            // Create a placeholder order observation with the ORC
            if (!currentPatientResult) {
              currentPatientResult = {
                orderObservations: [],
              };
            }

            // Create a new order observation with just the ORC
            // The OBR will be added when we encounter it
            currentOrderObservation = {
              orc: orcResult.data,
              obr: null as any, // Will be set when OBR is encountered
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

            if (!currentPatientResult) {
              currentPatientResult = {
                orderObservations: [],
              };
            }

            // Check if we already have an order observation with ORC
            if (
              currentOrderObservation &&
              currentOrderObservation.orc &&
              !currentOrderObservation.obr
            ) {
              // We have a pending ORC, add the OBR to it
              currentOrderObservation.obr = obrResult.data;
            } else {
              // No pending ORC, or we have a complete order observation
              if (currentOrderObservation) {
                currentPatientResult.orderObservations.push(
                  currentOrderObservation,
                );
              }
              // Create new order observation without ORC
              currentOrderObservation = {
                obr: obrResult.data,
                obxList: [],
              };
            }
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

            if (!currentOrderObservation) {
              return {
                success: false,
                error: `OBX segment at line ${i + 1} found without preceding OBR segment`,
              };
            }

            // Add OBX directly (NTE segments are stored separately in obxNteMap)
            currentOrderObservation.obxList.push(obxResult.data);
            message.addSegment(obxResult.data);
            break;
          }

          default:
            // Skip unsupported segments (e.g., CTI, NTE, etc.)
            // These are optional segments that don't affect the core message structure
            console.warn(
              `Skipping unsupported segment type '${segmentType}' at line ${i + 1}`,
            );
            break;
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
          error: "ORU_R01 message must contain at least one patient result",
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
        error: `Failed to parse ORU_R01 message: ${error}`,
      };
    }
  }
}

export function parseORU_R01(
  messageString: string,
): ParseResult<ParsedORU_R01> {
  const parser = new ORU_R01_Parser();
  return parser.parse(messageString);
}
