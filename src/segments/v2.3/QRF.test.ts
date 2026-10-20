import { test, expect, describe } from "vitest";
import { QRF } from "./QRF.ts";
import { DEFAULT_ENCODING } from "../../types/encoding.ts";

describe("QRF field positions", () => {
  test("QRF-1 Where Subject Filter repeats", () => {
    expect(new QRF().whereSubjectFilter("W1", "W2").encode().split("|")[1]).toBe("W1~W2");
  });

  test("QRF-2 When Data Start Date/Time", () => {
    expect(new QRF().whenDataStartDateTime("20250101").encode().split("|")[2]).toBe("20250101");
  });

  test("QRF-3 When Data End Date/Time", () => {
    expect(new QRF().whenDataEndDateTime("20250131").encode().split("|")[3]).toBe("20250131");
  });

  test("QRF-4 What User Qualifier repeats", () => {
    expect(new QRF().whatUserQualifier("U1", "U2").encode().split("|")[4]).toBe("U1~U2");
  });

  test("QRF-5 Other QRY Subject Filter repeats", () => {
    expect(new QRF().otherQrySubjectFilter("O1").encode().split("|")[5]).toBe("O1");
  });

  test("QRF-6 Which Date/Time Qualifier repeats", () => {
    expect(new QRF().whichDateTimeQualifier("R", "C").encode().split("|")[6]).toBe("R~C");
  });

  test("QRF-7 Which Date/Time Status Qualifier repeats", () => {
    expect(new QRF().whichDateTimeStatusQualifier("S1").encode().split("|")[7]).toBe("S1");
  });

  test("QRF-8 Date/Time Selection Qualifier repeats", () => {
    expect(new QRF().dateTimeSelectionQualifier("SEL").encode().split("|")[8]).toBe("SEL");
  });

  test("QRF-9 When Quantity/Timing Qualifier", () => {
    expect(new QRF().whenQuantityTimingQualifier("C1", "C2").encode().split("|")[9]).toBe("C1^C2");
  });
});

describe("QRF parse/encode", () => {
  test("round-trips a query filter", () => {
    const input = "QRF|W1~W2|20250101|20250131||||||";
    const result = QRF.parse(input, DEFAULT_ENCODING);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.val.encode()).toBe(input);
  });

  test("rejects a segment that is not QRF", () => {
    expect(QRF.parse("QRD|W1", DEFAULT_ENCODING).ok).toBe(false);
  });
});
