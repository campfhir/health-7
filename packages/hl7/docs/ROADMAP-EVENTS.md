# Roadmap: Event / Message Types

Tracks message structures (builders in `src/builders/<version>/`, parsers in
`src/parsers/<version>/`, schemas in `codegen/schemas/<version>/`).
HL7 v2.3 completeness comes first, then v2.5.1 parity (see [ROADMAP.md](../ROADMAP.md)).

> The "to build" lists come from the HL7 v2.3 message/event tables compiled from memory of the
> spec. **Verify structures against the official spec before implementing** and fix this file in
> the same PR if something is wrong. Many messages need segments from
> [ROADMAP-SEGMENTS.md](./ROADMAP-SEGMENTS.md) first — dependencies are noted.

Legend: ✅ builder + parser exist · ⬜ not started

## Built

| Family | Events | v2.3 | v2.5.1 |
|---|---|---|---|
| ADT | A01–A18, A21–A51 | ✅ | ✅ |
| ORU | R01 | ✅ | ✅ |
| ORU | R30, R31, R32 | n/a (2.5+) | ✅ |
| MFN | M02 (staff/practitioner) | ✅ | ✅ |
| ACK | general acknowledgment | ✅ | ✅ |
| ORM | O01 | ✅ | ✅ |
| ORR | O02 | ✅ | ✅ |
| VXU | V04 (unsolicited vaccination update) | ✅ | ✅ |
| SIU | S12–S17, S26 | ✅ | ✅ |

## Remaining for v2.3

### ADT gaps
| Event | Description | Needs |
|---|---|---|
| ⬜ A19 | Patient query (QRY/ADR response) | QRD, QRF |
| ⬜ A20 | Bed status update | NPU |

### Acknowledgments and queries (high priority — unblock everything else)
| Message | Notes | Needs |
|---|---|---|
| ⬜ MCF | Delayed acknowledgment | — |
| ⬜ QRY / QCK / DSR / DSC | Original-mode queries | QRD, QRF, QAK, DSP, DSC |
| ⬜ ADR | ADT response | QRD, QRF |
| ⬜ UDM | Unsolicited display update | URD, URS, DSP |
| ⬜ EDR / ERP / SQR / SQM | Event replay / stored procedure queries | ERQ, QRD |

### Orders and results
| Message | Events | Needs |
|---|---|---|
| ⬜ ORU | R01 variants (unsolicited) and R03 | ✅ |
| ⬜ ORF | R04 (query response for observations) | QRD, QRF |
| ⬜ OSQ / OSR | Order status query / response | QRD |
| ⬜ RDE / RDS / RGV / RAS | Pharmacy encoded order, dispense, give, administration (O01/O02, O13/O14, O15/O16, O17) | RXC, RXG |
| ⬜ RRA / RRD / RRE / RRG / RRI | Pharmacy responses | RXC, RXG |
| ⬜ OMD / OMN / OMS / OMG | Diet, non-stock, stock, general orders | ODS, ODT |

### Financial and documents
| Message | Events | Needs |
|---|---|---|
| ⬜ BAR | P01 add/update account, P02 purge | BLG |
| ⬜ DFT | P03 post detail financial transactions | FT1 |
| ⬜ MDM | T01–T11 document management | TXA |
| ⬜ PEX | P07/P08 product experience | PEO, PES, PCR |
| ⬜ PPR / PPT / PPG / PPP / PRR | Problem/goal/pathway (PC1–PC3, PC6–PCC etc.) | PRB, GOL, PTH, VAR |

### Master files and scheduling
| Message | Events | Needs |
|---|---|---|
| ⬜ MFN | M01 (non-specific), M03 (test/observation), M04 (charge description), M05 (location), M06 (clinical study), M07 (clinical study schedule), M08–M12 | CDM, PRC, OM1–OM7, LOC…, CM0–CM2 |
| ⬜ MFK | Master file application acknowledgment | MFA |
| ⬜ SIU | S18–S25 (cancel/discontinue/delete variants), S27–S32 if in scope | — |
| ⬜ SRM / SRR | Schedule request / response (S01–S11) | ARQ-equivalents |
| ⬜ RQI / RPI / RPL / RPR / RQP / RQC / RQA / RPA | Referral & patient information | RF1, PRD |
| ⬜ CRM / CSU | Clinical study registration / unsolicited data | CSR, CSS |
| ⬜ VXQ / VXR / VXX | Immunization query / response / response (VXU^V04 is done) | QRD, QRF |
| ⬜ EAC / EAN / EAR / ESR / ESU | Equipment automation | ECD, ECR, EQU, SAC |
| ⬜ INR / INU / LSR / LSU | Inventory / specimen automation | INV, ISD |
| ⬜ NMD / NMQ / NMR | Network management | NCK, NDS, NSC, NST |
| ⬜ STC | Patient state | — |
| ⬜ OSQ, OSR | See orders | — |

Done in 0.9: ACK, ORM^O01, ORR^O02 for v2.3 and v2.5.1 (`ORM`/`ORR` cover the OBR, RQD, RQ1, RXO, ODS and ODT order detail choices). Where the structures differ by version (checked on hl7.eu): v2.4 adds `[CTD]` and `[{FT1}]` to `ORM^O01`; v2.5 adds `[{SFT}]` and repeating `ERR` to `ACK`, repeating `ERR` to `ORR^O02`, and repeating `IN3` to `ORM^O01`. v2.3.1 matches v2.3 for all three, and v2.5.1 matches v2.5.

VXU^V04 is also done for every version: v2.3 and v2.3.1 are identical, v2.4 adds `[{GT1}]`, and v2.5/v2.5.1 add `[{SFT}]`, a required `ORC` and the timing group (`TQ1`, `TQ2`).

Done in 0.11: ADT A17, A24, A32, A33, A46, A48, A49, A50 and A51 for v2.3 and v2.5.1, structures
checked on hl7-definition.caristix.com (and HAPI for A17/A24). `A17`/`A24` carry two patient
groups (`patient1`/`patient2`). `A32`/`A33` reuse the `ADT_A01` builder and parser the way `A21`
does; `A46`/`A48`/`A49` reuse `ADT_A34` (`MSH EVN PID [PD1] MRG`); `A50`/`A51` require `PV1` in the
spec but, like `A18`, reuse `ADT_A34` where `PV1` is an option. The optional `[{SFT}]` that v2.5.1
adds after `MSH` is not modelled, consistent with the other v2.5.1 ADT messages here.

Suggested order: **remaining ADT (A19, A20) → DFT/BAR → MDM → queries/MFN → the rest.**

## v2.5.1 parity
After v2.3 is complete, bring v2.5.1 to parity with the same messages, then add the 2.5.1 additions:
ORU R30–R32 ✅, ACK, QBP/RSP/RTB (conformance-based queries; need QPD, RCP, QAK, QID), OML/OMI
(O21–O23), OUL, ORL, RDE O11/RDS O13, RAS O17, VXU V04, MFN (M01–M17), SIU/SRM scheduling
(S01–S26), ADT up through A62, MDM T01–T11, BAR P01–P12, DFT P03/P11.

## Definition of done (per event)
1. Schema added under `codegen/schemas/<version>/`, then `pnpm codegen`.
2. Builder + parser completed (remove the `const _TODO` stub marker).
3. Tests: builder, parser, and a round-trip with a realistic sample under `src/parsers/testdata/`.
4. Barrel regenerated (`pnpm barrels`), `pnpm lint && pnpm typecheck && pnpm test` green.
