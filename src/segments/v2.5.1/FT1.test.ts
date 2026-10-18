// FT1 in HL7 v2.5.1: FT1-26..31 are new; FT1-20/21/24 repeat; FT1-22 is a CP.
import { describe, test, expect } from "vitest";
import { FT1 } from "./FT1.ts";
import { FT1 as FT1_v23 } from "../v2.3/FT1.ts";

const at = (seg: FT1, n: number) => seg.encode().split("|")[n];

describe("FT1 (v2.5.1)", () => {
  test("extends the v2.3 segment and keeps its setters", () => {
    expect(new FT1()).toBeInstanceOf(FT1_v23);
    expect(at(new FT1().transactionCode({ identifier: "99213" }), 7)).toBe("99213");
  });

  test.each([
    ["FT1-20 Performed By Code", (s: FT1) => s.performedByCode({ idNumber: "1", familyName: "A" }, { idNumber: "2" }), 20, "1^A~2"],
    ["FT1-21 Ordered By Code", (s: FT1) => s.orderedByCode({ idNumber: "1" }, "raw"), 21, "1~raw"],
    ["FT1-24 Entered By Code", (s: FT1) => s.enteredByCode({ idNumber: "1", givenName: "G" }), 24, "1^^G"],
  ])("%s repeats", (_label, set, n, expected) => {
    expect(at(set(new FT1()), n)).toBe(expected);
  });

  test("FT1-22 Unit Cost is a CP (and still accepts a plain amount)", () => {
    expect(at(new FT1().unitCost({ price: { quantity: "4.50", denomination: "USD" }, priceType: "UP" }), 22)).toBe("4.50&USD^UP");
    expect(at(new FT1().unitCost("4.50"), 22)).toBe("4.50");
  });

  test("FT1-26 Procedure Code Modifier (CE, repeating)", () => {
    expect(at(new FT1().procedureCodeModifier({ identifier: "25", text: "mod" }, { identifier: "59" }), 26)).toBe("25^mod~59");
  });

  test("FT1-27 Advanced Beneficiary Notice Code (CE)", () => {
    expect(at(new FT1().advancedBeneficiaryNoticeCode({ identifier: "1", text: "abn" }), 27)).toBe("1^abn");
  });

  test("FT1-28 Medically Necessary Duplicate Procedure Reason (CWE)", () => {
    const ft1 = new FT1().medicallyNecessaryDuplicateProcedureReason({ code: "R1", text: "reason", codingSystem: "HL70476" });
    expect(at(ft1, 28)).toBe("R1^reason^HL70476");
  });

  test("FT1-29 NDC Code (CNE)", () => {
    expect(at(new FT1().ndcCode({ code: "0002-1433-80", text: "insulin", codingSystem: "NDC" }), 29)).toBe("0002-1433-80^insulin^NDC");
  });

  test("FT1-30 Payment Reference ID (CX): ten components", () => {
    const ft1 = new FT1().paymentReferenceId({
      idNumber: "1", checkDigit: "2", checkDigitScheme: "3", assigningAuthority: { namespaceId: "AA", universalId: "U" },
      identifierTypeCode: "5", assigningFacility: { namespaceId: "FAC" }, effectiveDate: "20240101", expirationDate: "20251231",
      assigningJurisdiction: { code: "J1", text: "jur" }, assigningAgencyOrDepartment: { code: "D1" },
    });
    expect(at(ft1, 30)).toBe("1^2^3^AA&U^5^FAC^20240101^20251231^J1&jur^D1");
  });

  test("FT1-31 Transaction Reference Key (SI, repeating)", () => {
    expect(at(new FT1().transactionReferenceKey("1", "2", "3"), 31)).toBe("1~2~3");
  });

  test("a message with FT1-31 populated keeps every earlier field in place", () => {
    const parts = new FT1().setId("1").transactionReferenceKey("9").encode().split("|");
    expect(parts).toHaveLength(32);
    expect(parts[1]).toBe("1");
    expect(parts[31]).toBe("9");
  });
});
