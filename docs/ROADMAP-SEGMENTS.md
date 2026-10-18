# Roadmap: Segments

Tracks which HL7 v2 segments have a hand-written class in `src/segments/<version>/`.
The goal is **complete HL7 v2.3 coverage first**, then v2.5.1 parity, then later versions
(see [ROADMAP.md](../ROADMAP.md)).

> The "to build" lists come from the HL7 v2.3 segment dictionary (appendix A / chapter segment
> tables) and were compiled from memory of the spec. **Verify field tables against the official
> spec before implementing**, and correct this file in the same PR if something is wrong.

Each segment needs: class with fluent setters + `encode()`, a parser, a co-located
`<SEG>.test.ts` (including field-position tests — see `pnpm test:positions`), and an
entry in the barrel (`pnpm barrels`).

Legend: ✅ built · ⬜ not started · ⚠️ needs audit

## Built (v2.3 and v2.5.1 both at 46 spec segments + 3 to audit)

ACC, AIG, AIL, AIP, AIS, AL1, CTI, DB1, DG1, DRG, ERR, EVN, GT1, IN1, IN2, IN3, MFE, MFI, MRG,
MSA, MSH, NK1, NTE, OBR, OBX, ORC, PD1, PID, PR1, PRA, PV1, PV2, RGS, ROL, RXA, RXD, RXE, RXO,
RXR, SCH, STF, UB1, UB2

⚠️ **Audit:** `SFT`, `SPM`, `TQ1` live in `segments/v2.3/` but were introduced after v2.3
(SFT in 2.4, SPM and TQ1 in 2.5). Decide whether to move them to the v2.5.1 base or keep them as
documented extensions in v2.3.

## To build for v2.3

### Control / batch / query / generic
| Segment | Name |
|---|---|
| ⬜ BHS | Batch Header |
| ⬜ BTS | Batch Trailer |
| ⬜ FHS | File Header |
| ⬜ FTS | File Trailer |
| ⬜ DSC | Continuation Pointer |
| ⬜ DSP | Display Data |
| ⬜ QRD | Original-Style Query Definition |
| ⬜ QRF | Original-Style Query Filter |
| ⬜ QAK | Query Acknowledgment |
| ⬜ ERQ | Event Replay Query |
| ⬜ URD | Results/Update Definition |
| ⬜ URS | Unsolicited Selection |

### Patient administration / financial
| Segment | Name |
|---|---|
| ⬜ ADD | Addendum |
| ⬜ BLG | Billing |
| ⬜ FT1 | Financial Transaction |
| ⬜ PCR | Possible Causal Relationship |
| ⬜ PEO | Product Experience Observation |
| ⬜ PES | Product Experience Sender |
| ⬜ PSH | Product Summary Header |
| ⬜ PDA | Patient Death and Autopsy |
| ⬜ NPU | Bed Status Update |
| ⬜ ODS | Dietary Orders, Supplements, Preferences |
| ⬜ ODT | Diet Tray Instructions |

### Orders / observations / pharmacy
| Segment | Name |
|---|---|
| ⬜ RXC | Pharmacy Treatment Component Order |
| ⬜ RXG | Pharmacy Treatment Give |
| ⬜ OVR | Override |
| ⬜ NCK | System Clock |
| ⬜ NDS | Notification Detail |
| ⬜ NSC | Application Status Change |
| ⬜ NST | Application Control-Level Statistics |
| ⬜ TXA | Transcription Document Header |
| ⬜ RF1 | Referral Information |
| ⬜ RQ1 | Requisition Detail-1 |
| ⬜ RQD | Requisition Detail |
| ⬜ PRD | Provider Data |
| ⬜ CSR | Clinical Study Registration |
| ⬜ CSS | Clinical Study Data Schedule |
| ⬜ VAR | Variance |
| ⬜ GOL | Goal Detail |
| ⬜ PRB | Problem Details |
| ⬜ PTH | Pathway |
| ⬜ ECD | Equipment Command |
| ⬜ ECR | Equipment Command Response |
| ⬜ EQU | Equipment Detail |
| ⬜ SAC | Specimen Container Detail |
| ⬜ INV | Inventory Detail |
| ⬜ ISD | Interaction Status Detail |
| ⬜ EDU | Student Institution |
| ⬜ EQL / EQP | Embedded Query Language / Equipment Log Service |

### Master files / scheduling support
| Segment | Name |
|---|---|
| ⬜ CDM | Charge Description Master |
| ⬜ PRC | Pricing |
| ⬜ CM0 / CM1 / CM2 | Clinical Study Master, Phase Master, Schedule Master |
| ⬜ OM1 – OM7 | Observation / Test master segments |
| ⬜ LOC / LCH / LRL / LDP / LCC | Location master segments |
| ⬜ MFA | Master File Acknowledgment |
| ⬜ ORG | Practitioner Organization Unit |
| ⬜ AFF | Professional Affiliation |
| ⬜ LAN | Language Detail |
| ⬜ CER | Certificate Detail |
| ⬜ FAC | Facility |
| ⬜ RDF / RDT | Table Row Definition / Data |
| ⬜ RMI | Risk Management Incident |
| ⬜ IPC | Imaging Procedure Control |

> Items marked with `/` or ranges are grouped for brevity; split them into one checkbox/PR per
> segment when picked up. Some of the segments above (e.g. AFF, LAN, CER, EQL) were added in 2.3.1
> or later — confirm membership in the v2.3 dictionary before building.

## v2.5.1 parity
v2.5.1 segments are generated as thin wrappers over the v2.3 base (`pnpm codegen`), so every
v2.3 segment above must also be re-evaluated for v2.5.1 field changes. After v2.3 is complete,
add the segments introduced after 2.3, e.g. `TQ2`, `PRT`, `QPD`, `RCP`, `QID`, `ARQ`, `APR`,
`IAM`, `GP1`/`GP2`, `OH1`–`OH4`, `CNS`, `CSP` (verify against the 2.5.1 spec).

## Definition of done (per segment)
1. Class + parser with all fields positioned per spec, including repeats and required flags.
2. Field-position tests generated/updated (`pnpm test:positions`).
3. Round-trip test (encode → parse → encode).
4. Barrel regenerated (`pnpm barrels`), `pnpm lint && pnpm typecheck && pnpm test` green.
