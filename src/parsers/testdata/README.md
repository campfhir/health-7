# HL7 Test Data

This directory contains validated HL7 v2.x example messages for integration testing.

## Directory Structure

```
testdata/
├── ORU_R01/        # Unsolicited Observation Result messages
└── ORU_R30/        # Point-of-Care Observation messages (R30/R31/R32)
```

## ORU_R01 Messages (15 examples)

Laboratory and clinical observation results from traditional systems.

### Sources
- Examples 01-04: Sourced from AHRQ Healthcare Cost and Utilization Project Implementation Guide
- Example 05: Sourced from InterfaceWare/MESA radiology example (v2.4)
- Examples 06-15: Based on common clinical laboratory patterns (v2.5)

### Message List

1. **01_cbc_complete_blood_count.hl7** - Complete Blood Count with 21 OBX results
   - WBC, RBC, Hemoglobin, Hematocrit, MCV, MCH, MCHC, RDW, Platelet Count, etc.
   - Includes correction notification

2. **02_hemoglobin_a1c.hl7** - Hemoglobin A1C diabetes monitoring
   - Single test result with interpretive comments

3. **03_urinalysis.hl7** - Complete Urinalysis with microscopic exam
   - 18 OBX results including dipstick and microscopy
   - Includes corrected values

4. **04_wound_culture_microbiology.hl7** - Wound culture with antimicrobial susceptibility
   - Multiple organisms (Proteus mirabilis, Rhodotorula glutinis, Pseudomonas aeruginosa)
   - Susceptibility testing with MIC values
   - Corrected report notification
   - 27 OBX results

5. **05_radiology_report.hl7** - Chest X-ray radiology report (v2.4)
   - Structured report with SR Instance UID
   - Clinical Trial segment (CTI)

6. **06_basic_metabolic_panel.hl7** - Basic Metabolic Panel
   - Sodium, Potassium, Chloride, CO2, BUN, Creatinine, Glucose, GFR

7. **07_lipid_panel.hl7** - Lipid Panel
   - Total Cholesterol, Triglycerides, HDL, LDL, Cholesterol/HDL Ratio, VLDL

8. **08_liver_function_tests.hl7** - Liver Function Tests
   - ALT, AST, Alkaline Phosphatase, Bilirubin, Protein, Albumin, Globulin

9. **09_thyroid_function.hl7** - Thyroid Function Panel
   - TSH, Free T4, Free T3, Total T4, Total T3

10. **10_blood_culture.hl7** - Blood Culture with MRSA
    - Staphylococcus aureus identification
    - Antimicrobial susceptibility
    - Critical alert for MRSA

11. **11_coagulation_panel.hl7** - Coagulation Studies
    - PT, INR, aPTT, Fibrinogen, D-Dimer

12. **12_cardiac_markers.hl7** - Cardiac Markers (Acute MI workup)
    - Troponin I, CK, CK-MB, BNP, NT-proBNP, CRP
    - Critical value notification

13. **13_multiple_patients.hl7** - Multiple Patient Results in single message
    - 2 separate patient results
    - Different tests per patient

14. **14_multiple_orders_single_patient.hl7** - Multiple Orders per Patient
    - CBC and Comprehensive Metabolic Panel
    - 2 OBR segments with respective OBX results

15. **15_critical_value_notification.hl7** - STAT Labs with Critical Values
    - Hyperkalemia, Hypoglycemia, Severe Anemia, Leukocytosis
    - Critical alert documentation

## ORU_R30 Messages (15 examples)

Point-of-care observation messages with event triggers R30/R31/R32.

### Event Triggers
- **R30**: Unsolicited POC observation - place an order
- **R31**: Unsolicited POC observation - search for an order
- **R32**: Unsolicited pre-ordered POC observation

### Message List

1. **01_glucose_meter_r30.hl7** - Bedside glucose meter (R30)
   - Hyperglycemia alert

2. **02_blood_pressure_r30.hl7** - Vital signs monitor (R30)
   - Systolic, Diastolic, Heart Rate

3. **03_temperature_r31.hl7** - Temperature device (R31)
   - Fever measurement with site

4. **04_pulse_oximetry_r32.hl7** - Pulse oximeter (R32)
   - O2 saturation, Heart Rate, O2 flow settings

5. **05_bedside_glucose_r32.hl7** - Accu-Chek glucose (R32)
   - Pre-meal glucose with timing
   - Physician notification

6. **06_arterial_blood_gas_r32.hl7** - ABG analyzer (R32)
   - pH, pCO2, pO2, HCO3, Base Excess, O2 Sat
   - Ventilator settings

7. **07_inr_coaguchek_r30.hl7** - CoaguChek INR device (R30)
   - PT/INR monitoring for warfarin therapy

8. **08_urine_dipstick_r30.hl7** - Urine dipstick (R30)
   - Abnormal findings triggering formal lab order

9. **09_ketone_meter_r31.hl7** - Ketone meter (R31)
   - Diabetic ketoacidosis detection
   - Beta-hydroxybutyrate with glucose

10. **10_lactate_meter_r32.hl7** - Lactate meter (R32)
    - Sepsis monitoring with trend data

11. **11_multiple_vitals_r30.hl7** - Complete vital signs (R30)
    - BP, HR, RR, Temp, O2 Sat, MAP

12. **12_hemoglobin_meter_r32.hl7** - HemoCue hemoglobin (R32)
    - Anemia screening in pregnancy

13. **13_cholesterol_screening_r30.hl7** - CardioCheck device (R30)
    - Lipid screening with glucose
    - Treatment recommendations

14. **14_strep_test_r31.hl7** - Rapid Strep A test (R31)
    - Pediatric throat swab
    - Positive result with treatment

15. **15_pregnancy_test_r30.hl7** - hCG qualitative test (R30)
    - Urine pregnancy test
    - OB referral plan

## Integration Test Coverage

### ORU_R01 Integration Tests
- File: `src/parsers/v2.5.1/ORU_R01_Parser.integration.test.ts`
- Status: **38 tests created, 0 passing** (Parser doesn't support ORC segments)
- Tests:
  - Parse all 15 validated messages
  - Verify OBX counts for complex messages
  - Multiple patient validation
  - Multiple order validation
  - Critical value flag detection
  - Round-trip encoding/decoding

### ORU_R30 Integration Tests
- File: `src/parsers/v2.5.1/ORU_R30_Parser.integration.test.ts`
- Status: **41 tests created, 39 passing, 2 failing**
- Tests:
  - Parse all 15 validated messages (✓ All passing)
  - Event type validation (R30/R31/R32)
  - Point-of-care specific validations
  - Round-trip encoding/decoding (✓ All passing)
- Failures:
  - MSH.getMessageType() method not implemented
  - ORC validation logic incomplete

## Known Issues

### ORU_R01 Parser
The current ORU_R01 parser does **not** support ORC (Common Order) segments, which are present in most validated examples. This causes all 38 integration tests to fail.

**Error**: `Unsupported segment type 'ORC' at line X`

### ORU_R30 Parser
Minor issues with validation tests:
1. MSH segment missing `getMessageType()` method
2. ORC validation test needs refinement

The core parsing functionality works correctly (39/41 tests passing).

## Testing Instructions

Run integration tests:

```bash
# Run ORU_R01 integration tests
npx tsx --test src/parsers/v2.5.1/ORU_R01_Parser.integration.test.ts

# Run ORU_R30 integration tests
npx tsx --test src/parsers/v2.5.1/ORU_R30_Parser.integration.test.ts

# Run all tests
npm test
```

## Message Format

All messages use ER7 (pipe-delimited) encoding:
- Segment separator: `\r` (carriage return) or `\n` (newline)
- Field separator: `|`
- Component separator: `^`
- Repetition separator: `~`
- Escape character: `\`
- Subcomponent separator: `&`

## References

1. AHRQ Healthcare Cost and Utilization Project - HL7 Implementation Guide
   - https://hcup-us.ahrq.gov/datainnovations/clinicalcontentenhancementtoolkit/hi6.jsp

2. HL7 v2.5.1 Implementation Guide: Laboratory Results to Public Health
   - Nebraska DHHS EPI Documentation

3. InterfaceWare HL7 ORU Message Documentation
   - https://www.interfaceware.com/hl7-oru

4. HL7 v2.5 Standard Specification
   - Chapter 7: Observation Reporting
