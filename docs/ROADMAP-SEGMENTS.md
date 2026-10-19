# Roadmap: Segments

Tracks which HL7 v2 segments have a hand-written class in `src/segments/<version>/`.
The goal is **complete HL7 v2.3 coverage first**, then v2.5.1 parity, then later versions
(see [ROADMAP.md](../ROADMAP.md)).

## Source of truth

The v2.3 segment list below comes from the HL7 v2.3 segment index on hl7.eu
(`https://www.hl7.eu/HL7v2x/v23/hl7v23segm.htm`, read 2026-10-19). Field tables come from the
per-segment pages on hl7.eu, e.g. `https://www.hl7.eu/HL7v2x/v23/hl7v23segmQRD.htm`. Caristix
renders its pages client-side, so only hl7.eu was usable for field tables.

Where a field table on hl7.eu gives no usage or repeat value, the field is implemented
without a required flag and the gap is noted here. Those notes are unverified and should be
confirmed before anything depends on them.

Each segment needs: class with fluent setters + `encode()`, a parser, a co-located
`<SEG>.test.ts` (including field-position tests), and an entry in the barrel (`pnpm barrels`).
Segments that hand-write their field-position tests carry the `position-tests: hand-written`
marker, so `pnpm test:positions` skips them.

Legend: ✅ built · ⬜ not started · ⚠️ needs audit

## Built (v2.3)

ACC, ADD, AIG, AIL, AIP, AIS, AL1, BHS, BLG, BTS, CTD, CTI, DB1, DG1, DRG, DSC, DSP, ERR, EVN, FHS,
FT1, FTS, GT1, IN1, IN2, IN3, MFE, MFI, MRG, MSA, MSH, NK1, NTE, OBR, OBX, ODS, ODT, ORC, PD1,
PID, PR1, PRA, PV1, PV2, QAK, QRD, QRF, RGS, ROL, RQ1, RQD, RXA, RXD, RXE, RXO, RXR, SCH, STF,
UB1, UB2

Segments are placed in the version that introduced them: `SFT`, `SPM` and `TQ1` are in
`segments/v2.5`; later versions re-export them. `ROL` and `DB1` both have v2.3 definitions, so
they stay in `segments/v2.3`. (Version-specific fields are layered, not moved: `ROL` fields 9–12, `ACC` fields 7–10 and `PD1` fields 13–21 are v2.4 overrides in `segments/v2.4`; `ACC` field 11 is a v2.5 override. The v2.3 classes stop at the v2.3 field count. `DB1` has the same eight fields in v2.3, v2.4 and v2.5. Field 3 (CX) repeats in all three, and v2.3 now models that. v2.4 widens its maximum length to 250, which is not enforced, and hl7.eu names field 4 "Disability Indicator" in v2.4 and "Disabled Indicator" in v2.3 and v2.5.) Moving a
segment is `git mv` into the introducing version directory, adding it to that version's
`ownSegments` in `codegen/schemas/`, and running `pnpm codegen && pnpm barrels`.

### Unverified details in built segments

- `AIG-5` (Resource Group) repeats in the Caristix v2.3 table (repeat ∞) but `AIG.resourceGroup()` writes a single value; making it repeat is a breaking signature change.
- `AIP-4` is named "Resource Role" in the Caristix table; the setter is still `resourceType()` for API compatibility.
- `AL1-2` is named "Allergy Type" in the Caristix table; the setter is `allergenTypeCode()`.
- `QRD-11` (What Data Code Value Qualifier) is typed `CM_VR` on hl7.eu. It is written as
  repeating single components until the CM composite layout is modelled.
- `QRF-9` (When Quantity/Timing Qualifier) is typed `TQ`. It takes positional components and
  does not yet name them.
- `QRD` and `QRF` usage flags are not stated on hl7.eu for several fields.

## To build for v2.3

These are the v2.3 segments on hl7.eu's index that have no class yet, grouped for planning.
Take them one group at a time, and split each into one PR per segment.

### Batch / file / query / generic
| Segment | Name |
|---|---|
| ⬜ ARQ | Appointment Request |
| ⬜ APR | Appointment Preferences |
| ⬜ AUT | Authorization Information |
| ⬜ ERQ | Event Replay Query |
| ⬜ URD | Results/Update Definition |
| ⬜ URS | Unsolicited Selection |
| ⬜ EQL | Embedded Query Language |
| ⬜ MFA | Master File Acknowledgment |
| ⬜ NCK | System Clock |
| ⬜ NST | Statistics |
| ⬜ NSC | Status Change |
| ⬜ RDF | Table Row Definition |
| ⬜ RDT | Table Row Data |
| ⬜ TXA | Document Notification |
| ⬜ VTQ | Virtual Table Query Request |

### Patient administration / financial / product
| Segment | Name |
|---|---|
| ⬜ CSP | Clinical Study Phase |
| ⬜ NPU | Bed Status Update |
| ⬜ PCR | Possible Causal Relationship |
| ⬜ PDC | Product Detail Country |
| ⬜ PEO | Product Experience Observation |
| ⬜ PES | Product Experience Sender |
| ⬜ PRB | Problem Detail |
| ⬜ PRC | Pricing |
| ⬜ PRD | Provider Data |
| ⬜ PSH | Product Summary Header |
| ⬜ PTH | Pathway |
| ⬜ FAC | Facility |
| ⬜ GOL | Goal Detail |
| ⬜ RF1 | Referral Information |
| ⬜ VAR | Variance |

### Orders / pharmacy / clinical study
| Segment | Name |
|---|---|
| ⬜ RXC | Pharmacy Component Order |
| ⬜ RXG | Pharmacy Give |
| ⬜ SPR | Stored Procedure Request Definition |
| ⬜ CSR | Clinical Study Registration |
| ⬜ CSS | Clinical Study Data Schedule |
| ⬜ CM0 | Clinical Study Master |
| ⬜ CM1 | Clinical Study Phase Master |
| ⬜ CM2 | Clinical Study Schedule Master |

### Master files / observation / location
| Segment | Name |
|---|---|
| ⬜ CDM | Charge Description Master |
| ⬜ OM1 – OM6 | Observation master segments (general, numeric, categorical, specimen, battery, calculated) |
| ⬜ LCC | Location Charge Code |
| ⬜ LCH | Location Characteristic |
| ⬜ LDP | Location Department |
| ⬜ LOC | Location Identification |
| ⬜ LRL | Location Relationship |

### Not in the v2.3 index
These appear in the roadmap from memory but are not on hl7.eu's v2.3 segment index. They are
removed from the v2.3 plan. Check them against the version where they belong (2.4+ or 2.5.1)
before building them:

PDA, SAC, EDU, EQU, ECD, ECR, EQP, INV, ISD, OVR, NDS, LAN, CER, AFF, ORG, RMI, IPC

Hxx and Zxx on the hl7.eu index are placeholders for "any HL7 segment" and "any Z-segment",
not segments.

## v2.5.1 parity
v2.5.1 segments are generated as thin wrappers over the v2.3 base (`pnpm codegen`), so every
v2.3 segment above must also be re-evaluated for v2.5.1 field changes. After v2.3 is complete,
add the segments introduced after 2.3, e.g. `TQ2`, `PRT`, `QPD`, `RCP`, `QID`, `IAM`,
`GP1`/`GP2`, `OH1`–`OH4`, `CNS` (verify against the 2.5.1 spec). Segments on the v2.3 index above
(`ARQ`, `APR`, `CSP`) stay in the v2.3 plan.

## Definition of done (per segment)
1. Class + parser with all fields positioned per spec, including repeats and required flags.
2. Field-position tests (hand-written with the marker, or generated with `pnpm test:positions`).
3. Round-trip test (encode → parse → encode).
4. Barrel regenerated (`pnpm barrels`), `pnpm lint && pnpm typecheck && pnpm test` green.
