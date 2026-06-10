import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { MSH } from "../../segments/v2.3/MSH.ts";
import { SCH } from "../../segments/v2.3/SCH.ts";
import { NTE } from "../../segments/v2.3/NTE.ts";
import { PID } from "../../segments/v2.3/PID.ts";
import { PD1 } from "../../segments/v2.3/PD1.ts";
import { PV1 } from "../../segments/v2.3/PV1.ts";
import { PV2 } from "../../segments/v2.3/PV2.ts";
import { OBX } from "../../segments/v2.3/OBX.ts";
import { DG1 } from "../../segments/v2.3/DG1.ts";
import { RGS } from "../../segments/v2.3/RGS.ts";
import { AIS } from "../../segments/v2.3/AIS.ts";
import { AIG } from "../../segments/v2.3/AIG.ts";
import { AIL } from "../../segments/v2.3/AIL.ts";
import { AIP } from "../../segments/v2.3/AIP.ts";
import { HL7Message } from "../../types/message.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";

export interface ParsedSIUPatient {
  pid: PID;
  pd1?: PD1;
  pv1?: PV1;
  pv2?: PV2;
  obxList?: OBX[];
  dg1List?: DG1[];
}

export interface ParsedSIUService {
  ais: AIS;
  nteList?: NTE[];
}

export interface ParsedSIUGeneralResource {
  aig: AIG;
  nteList?: NTE[];
}

export interface ParsedSIULocationResource {
  ail: AIL;
  nteList?: NTE[];
}

export interface ParsedSIUPersonnelResource {
  aip: AIP;
  nteList?: NTE[];
}

export interface ParsedSIUResources {
  rgs: RGS;
  services?: ParsedSIUService[];
  generalResources?: ParsedSIUGeneralResource[];
  locationResources?: ParsedSIULocationResource[];
  personnelResources?: ParsedSIUPersonnelResource[];
}

export interface ParsedSIU_S12 {
  message: HL7Message;
  msh: MSH;
  sch: SCH;
  nteList?: NTE[];
  patients?: ParsedSIUPatient[];
  resources: ParsedSIUResources[];
}

export class SIU_S12_Parser {
  protected parseMSH(s: string): Result<MSH> {
    return MSH.parse(s);
  }

  protected parseSCH(s: string, e: EncodingCharacters): Result<SCH> {
    return SCH.parse(s, e);
  }

  protected parseNTE(s: string, e: EncodingCharacters): Result<NTE> {
    return NTE.parse(s, e);
  }

  protected parsePID(s: string, e: EncodingCharacters): Result<PID> {
    return PID.parse(s, e);
  }

  protected parsePD1(s: string, e: EncodingCharacters): Result<PD1> {
    return PD1.parse(s, e);
  }

  protected parsePV1(s: string, e: EncodingCharacters): Result<PV1> {
    return PV1.parse(s, e);
  }

  protected parsePV2(s: string, e: EncodingCharacters): Result<PV2> {
    return PV2.parse(s, e);
  }

  protected parseOBX(s: string, e: EncodingCharacters): Result<OBX> {
    return OBX.parse(s, e);
  }

  protected parseDG1(s: string, e: EncodingCharacters): Result<DG1> {
    return DG1.parse(s, e);
  }

  protected parseRGS(s: string, e: EncodingCharacters): Result<RGS> {
    return RGS.parse(s, e);
  }

  protected parseAIS(s: string, e: EncodingCharacters): Result<AIS> {
    return AIS.parse(s, e);
  }

  protected parseAIG(s: string, e: EncodingCharacters): Result<AIG> {
    return AIG.parse(s, e);
  }

  protected parseAIL(s: string, e: EncodingCharacters): Result<AIL> {
    return AIL.parse(s, e);
  }

  protected parseAIP(s: string, e: EncodingCharacters): Result<AIP> {
    return AIP.parse(s, e);
  }

  parse(messageString: string): Result<ParsedSIU_S12> {
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

      let sch: SCH | undefined;
      const nteList: NTE[] = [];
      const patients: ParsedSIUPatient[] = [];
      let currentPatient: { pid: PID; pd1?: PD1; pv1?: PV1; pv2?: PV2; obxList: OBX[]; dg1List: DG1[] } | null = null;
      const resources: ParsedSIUResources[] = [];
      let currentResources: {
        rgs: RGS;
        services: ParsedSIUService[];
        generalResources: ParsedSIUGeneralResource[];
        locationResources: ParsedSIULocationResource[];
        personnelResources: ParsedSIUPersonnelResource[];
        currentService: { ais: AIS; nteList: NTE[] } | null;
        currentGeneral: { aig: AIG; nteList: NTE[] } | null;
        currentLocation: { ail: AIL; nteList: NTE[] } | null;
        currentPersonnel: { aip: AIP; nteList: NTE[] } | null;
      } | null = null;

      // Tracks the last non-NTE segment type for NTE context dispatch
      let lastMainSegment = "MSH";

      const finalizeCurrentResources = () => {
        if (!currentResources) return;
        if (currentResources.currentService) {
          currentResources.services.push({
            ais: currentResources.currentService.ais,
            nteList: currentResources.currentService.nteList.length ? currentResources.currentService.nteList : undefined,
          });
          currentResources.currentService = null;
        }
        if (currentResources.currentGeneral) {
          currentResources.generalResources.push({
            aig: currentResources.currentGeneral.aig,
            nteList: currentResources.currentGeneral.nteList.length ? currentResources.currentGeneral.nteList : undefined,
          });
          currentResources.currentGeneral = null;
        }
        if (currentResources.currentLocation) {
          currentResources.locationResources.push({
            ail: currentResources.currentLocation.ail,
            nteList: currentResources.currentLocation.nteList.length ? currentResources.currentLocation.nteList : undefined,
          });
          currentResources.currentLocation = null;
        }
        if (currentResources.currentPersonnel) {
          currentResources.personnelResources.push({
            aip: currentResources.currentPersonnel.aip,
            nteList: currentResources.currentPersonnel.nteList.length ? currentResources.currentPersonnel.nteList : undefined,
          });
          currentResources.currentPersonnel = null;
        }
        resources.push({
          rgs: currentResources.rgs,
          services: currentResources.services.length ? currentResources.services : undefined,
          generalResources: currentResources.generalResources.length ? currentResources.generalResources : undefined,
          locationResources: currentResources.locationResources.length ? currentResources.locationResources : undefined,
          personnelResources: currentResources.personnelResources.length ? currentResources.personnelResources : undefined,
        });
        currentResources = null;
      };

      for (let i = 1; i < segments.length; i++) {
        const segmentStr = segments[i];
        const segmentType = segmentStr.substring(0, 3);

        switch (segmentType) {
          case "SCH": {
            const result = this.parseSCH(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse SCH segment at line ${i + 1}: ${result.err.message}`) };
            }
            sch = result.val;
            message.addSegment(result.val);
            lastMainSegment = "SCH";
            break;
          }

          case "NTE": {
            const result = this.parseNTE(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse NTE segment at line ${i + 1}: ${result.err.message}`) };
            }
            const nte = result.val;
            message.addSegment(nte);
            if (lastMainSegment === "AIS" && currentResources?.currentService) {
              currentResources.currentService.nteList.push(nte);
            } else if (lastMainSegment === "AIG" && currentResources?.currentGeneral) {
              currentResources.currentGeneral.nteList.push(nte);
            } else if (lastMainSegment === "AIL" && currentResources?.currentLocation) {
              currentResources.currentLocation.nteList.push(nte);
            } else if (lastMainSegment === "AIP" && currentResources?.currentPersonnel) {
              currentResources.currentPersonnel.nteList.push(nte);
            } else {
              nteList.push(nte);
            }
            // lastMainSegment intentionally not updated for NTE
            break;
          }

          case "PID": {
            finalizeCurrentResources();
            if (currentPatient) {
              patients.push({
                pid: currentPatient.pid,
                pd1: currentPatient.pd1,
                pv1: currentPatient.pv1,
                pv2: currentPatient.pv2,
                obxList: currentPatient.obxList.length ? currentPatient.obxList : undefined,
                dg1List: currentPatient.dg1List.length ? currentPatient.dg1List : undefined,
              });
            }
            const result = this.parsePID(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse PID segment at line ${i + 1}: ${result.err.message}`) };
            }
            currentPatient = { pid: result.val, obxList: [], dg1List: [] };
            message.addSegment(result.val);
            lastMainSegment = "PID";
            break;
          }

          case "PD1": {
            const result = this.parsePD1(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse PD1 segment at line ${i + 1}: ${result.err.message}`) };
            }
            if (currentPatient) currentPatient.pd1 = result.val;
            message.addSegment(result.val);
            lastMainSegment = "PD1";
            break;
          }

          case "PV1": {
            const result = this.parsePV1(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse PV1 segment at line ${i + 1}: ${result.err.message}`) };
            }
            if (currentPatient) currentPatient.pv1 = result.val;
            message.addSegment(result.val);
            lastMainSegment = "PV1";
            break;
          }

          case "PV2": {
            const result = this.parsePV2(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse PV2 segment at line ${i + 1}: ${result.err.message}`) };
            }
            if (currentPatient) currentPatient.pv2 = result.val;
            message.addSegment(result.val);
            lastMainSegment = "PV2";
            break;
          }

          case "OBX": {
            const result = this.parseOBX(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse OBX segment at line ${i + 1}: ${result.err.message}`) };
            }
            if (currentPatient) currentPatient.obxList.push(result.val);
            message.addSegment(result.val);
            lastMainSegment = "OBX";
            break;
          }

          case "DG1": {
            const result = this.parseDG1(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse DG1 segment at line ${i + 1}: ${result.err.message}`) };
            }
            if (currentPatient) currentPatient.dg1List.push(result.val);
            message.addSegment(result.val);
            lastMainSegment = "DG1";
            break;
          }

          case "RGS": {
            finalizeCurrentResources();
            if (currentPatient) {
              patients.push({
                pid: currentPatient.pid,
                pd1: currentPatient.pd1,
                pv1: currentPatient.pv1,
                pv2: currentPatient.pv2,
                obxList: currentPatient.obxList.length ? currentPatient.obxList : undefined,
                dg1List: currentPatient.dg1List.length ? currentPatient.dg1List : undefined,
              });
              currentPatient = null;
            }
            const result = this.parseRGS(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse RGS segment at line ${i + 1}: ${result.err.message}`) };
            }
            currentResources = {
              rgs: result.val,
              services: [],
              generalResources: [],
              locationResources: [],
              personnelResources: [],
              currentService: null,
              currentGeneral: null,
              currentLocation: null,
              currentPersonnel: null,
            };
            message.addSegment(result.val);
            lastMainSegment = "RGS";
            break;
          }

          case "AIS": {
            if (currentResources?.currentService) {
              currentResources.services.push({
                ais: currentResources.currentService.ais,
                nteList: currentResources.currentService.nteList.length ? currentResources.currentService.nteList : undefined,
              });
              currentResources.currentService = null;
            }
            const result = this.parseAIS(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse AIS segment at line ${i + 1}: ${result.err.message}`) };
            }
            if (currentResources) currentResources.currentService = { ais: result.val, nteList: [] };
            message.addSegment(result.val);
            lastMainSegment = "AIS";
            break;
          }

          case "AIG": {
            if (currentResources?.currentGeneral) {
              currentResources.generalResources.push({
                aig: currentResources.currentGeneral.aig,
                nteList: currentResources.currentGeneral.nteList.length ? currentResources.currentGeneral.nteList : undefined,
              });
              currentResources.currentGeneral = null;
            }
            const result = this.parseAIG(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse AIG segment at line ${i + 1}: ${result.err.message}`) };
            }
            if (currentResources) currentResources.currentGeneral = { aig: result.val, nteList: [] };
            message.addSegment(result.val);
            lastMainSegment = "AIG";
            break;
          }

          case "AIL": {
            if (currentResources?.currentLocation) {
              currentResources.locationResources.push({
                ail: currentResources.currentLocation.ail,
                nteList: currentResources.currentLocation.nteList.length ? currentResources.currentLocation.nteList : undefined,
              });
              currentResources.currentLocation = null;
            }
            const result = this.parseAIL(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse AIL segment at line ${i + 1}: ${result.err.message}`) };
            }
            if (currentResources) currentResources.currentLocation = { ail: result.val, nteList: [] };
            message.addSegment(result.val);
            lastMainSegment = "AIL";
            break;
          }

          case "AIP": {
            if (currentResources?.currentPersonnel) {
              currentResources.personnelResources.push({
                aip: currentResources.currentPersonnel.aip,
                nteList: currentResources.currentPersonnel.nteList.length ? currentResources.currentPersonnel.nteList : undefined,
              });
              currentResources.currentPersonnel = null;
            }
            const result = this.parseAIP(segmentStr, encoding);
            if (!result.ok || !result.val) {
              return { ok: false, err: new Err(`Failed to parse AIP segment at line ${i + 1}: ${result.err.message}`) };
            }
            if (currentResources) currentResources.currentPersonnel = { aip: result.val, nteList: [] };
            message.addSegment(result.val);
            lastMainSegment = "AIP";
            break;
          }

          default:
            console.warn(`Skipping unsupported segment type '${segmentType}' at line ${i + 1}`);
            break;
        }
      }

      // Finalize any open groups
      finalizeCurrentResources();
      if (currentPatient) {
        patients.push({
          pid: currentPatient.pid,
          pd1: currentPatient.pd1,
          pv1: currentPatient.pv1,
          pv2: currentPatient.pv2,
          obxList: currentPatient.obxList.length ? currentPatient.obxList : undefined,
          dg1List: currentPatient.dg1List.length ? currentPatient.dg1List : undefined,
        });
      }

      if (!sch) {
        return { ok: false, err: new Err("SIU message must contain an SCH segment") };
      }
      if (resources.length === 0) {
        return { ok: false, err: new Err("SIU message must contain at least one RESOURCES group (RGS)") };
      }

      return {
        ok: true,
        val: {
          message,
          msh,
          sch,
          nteList: nteList.length ? nteList : undefined,
          patients: patients.length ? patients : undefined,
          resources,
        },
      };
    } catch (error) {
      return { ok: false, err: new Err(`Failed to parse SIU_S12 message: ${error}`) };
    }
  }
}

export function parseSIU_S12(messageString: string): Result<ParsedSIU_S12> {
  return new SIU_S12_Parser().parse(messageString);
}
