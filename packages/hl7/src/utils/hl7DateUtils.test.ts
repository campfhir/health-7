import { test, expect, describe } from "vitest";
import {
  formatHL7Date,
  DateLayout,
  DateTimeLayout,
  TimeLayout,
  TimeWithSecondsLayout,
} from "./hl7DateUtils.ts";

// Fixed local-time date for deterministic assertions.
const D = new Date(1980, 0, 15, 9, 5, 3, 0); // Jan 15 1980 09:05:03 local

// ─── string passthrough ──────────────────────────────────────────────────────

describe("formatHL7Date: string passthrough", () => {
  test("returns string unchanged regardless of layout", () => {
    expect(formatHL7Date("19800115")).toBe("19800115");
    expect(formatHL7Date("19800115090503", DateTimeLayout)).toBe(
      "19800115090503",
    );
    expect(formatHL7Date("already-formatted", DateLayout)).toBe(
      "already-formatted",
    );
  });
});

// ─── Date → HL7Date (YYYYMMDD) ───────────────────────────────────────────────

describe("formatHL7Date: Date with HL7Date layout", () => {
  test("formats Date as YYYYMMDD using format string", () => {
    expect(formatHL7Date(D, DateLayout)).toBe("19800115");
  });

  test('formats Date as YYYYMMDD using "Date" alias', () => {
    expect(formatHL7Date(D, "Date")).toBe("19800115");
  });
});

// ─── Date → HL7DateTime (YYYYMMDDHHmmss) ────────────────────────────────────

describe("formatHL7Date: Date with HL7DateTime layout", () => {
  test("formats Date as YYYYMMDDHHmmss using format string", () => {
    expect(formatHL7Date(D, DateTimeLayout)).toBe("19800115090503");
  });

  test('formats Date as YYYYMMDDHHmmss using "DateTime" alias', () => {
    expect(formatHL7Date(D, "DateTime")).toBe("19800115090503");
  });

  test("defaults to HL7DateTime when no layout provided", () => {
    expect(formatHL7Date(D)).toBe("19800115090503");
  });
});

// ─── Date → HL7Time ──────────────────────────────────────────────────────────

describe("formatHL7Date: Date with HL7Time layout", () => {
  test("formats Date as HHmmss using format string", () => {
    expect(formatHL7Date(D, TimeLayout)).toBe("090503");
  });

  test('formats Date as HHmmss using "Time" alias', () => {
    expect(formatHL7Date(D, "Time")).toBe("090503");
  });
});

// ─── Date → HL7TimeWithSeconds ───────────────────────────────────────────────

describe("formatHL7Date: Date with HL7TimeWithSeconds layout", () => {
  test("formats Date as HHmmss.SSS using format string", () => {
    expect(formatHL7Date(D, TimeWithSecondsLayout)).toBe("090503.000");
  });

  test('formats Date as HHmmss.SSS using "TimeWithSeconds" alias', () => {
    expect(formatHL7Date(D, "TimeWithSeconds")).toBe("090503.000");
  });
});

// ─── custom layout passthrough ───────────────────────────────────────────────

describe("formatHL7Date: custom layout string", () => {
  test("passes arbitrary layout string through to dateUtils", () => {
    expect(formatHL7Date(D, "2006")).toBe("1980");
    expect(formatHL7Date(D, "01/02/2006")).toBe("01/15/1980");
  });
});
