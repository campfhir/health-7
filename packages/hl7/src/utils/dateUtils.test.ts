import { test, expect, describe } from "vitest";
import {
  dateUtils,
  DateOnly,
  TimeOnly,
  DateTime,
  RFC3339,
  RFC3339Nano,
  RFC822Z,
  RFC1123Z,
  RubyDate,
  ANSIC,
  UnixDate,
  Kitchen,
  Stamp,
  StampMilli,
} from "./dateUtils.ts";

// Fixed local-time date used for format tests.
// Tests assert on local-time components (year/month/day/time) which are stable
// regardless of the runner's UTC offset.
const D = new Date(2026, 3, 28, 19, 9, 52, 123); // Apr 28 2026 19:09:52.123 local

// ─── format — year ───────────────────────────────────────────────────────────

describe("format: year", () => {
  test("2006 → 4-digit year", () => {
    expect(dateUtils.format(D, "2006")).toMatchObject({
      ok: true,
      val: "2026",
    });
  });

  test("06 → 2-digit year", () => {
    expect(dateUtils.format(D, "06")).toMatchObject({ ok: true, val: "26" });
  });
});

// ─── format — month ──────────────────────────────────────────────────────────

describe("format: month", () => {
  test("January → full month name", () => {
    expect(dateUtils.format(D, "January")).toMatchObject({
      ok: true,
      val: "April",
    });
  });

  test("Jan → short month name", () => {
    expect(dateUtils.format(D, "Jan")).toMatchObject({ ok: true, val: "Apr" });
  });

  test("01 → zero-padded month", () => {
    expect(dateUtils.format(D, "01")).toMatchObject({ ok: true, val: "04" });
  });

  test("1 → unpadded month", () => {
    expect(dateUtils.format(new Date(2026, 0, 1), "1")).toMatchObject({
      ok: true,
      val: "1",
    }); // January
    expect(dateUtils.format(D, "1")).toMatchObject({ ok: true, val: "4" }); // April
    expect(dateUtils.format(new Date(2026, 11, 1), "1")).toMatchObject({
      ok: true,
      val: "12",
    }); // December
  });
});

// ─── format — weekday ────────────────────────────────────────────────────────

describe("format: weekday", () => {
  test("Monday → full weekday", () => {
    expect(dateUtils.format(D, "Monday")).toMatchObject({
      ok: true,
      val: "Tuesday",
    });
  });

  test("Mon → short weekday", () => {
    expect(dateUtils.format(D, "Mon")).toMatchObject({ ok: true, val: "Tue" });
  });
});

// ─── format — day of month ───────────────────────────────────────────────────

describe("format: day of month", () => {
  test("02 → zero-padded day", () => {
    expect(dateUtils.format(D, "02")).toMatchObject({ ok: true, val: "28" });
    expect(dateUtils.format(new Date(2026, 0, 5), "02")).toMatchObject({
      ok: true,
      val: "05",
    });
  });

  test("_2 → space-padded day", () => {
    expect(dateUtils.format(D, "_2")).toMatchObject({ ok: true, val: "28" });
    expect(dateUtils.format(new Date(2026, 0, 5), "_2")).toMatchObject({
      ok: true,
      val: " 5",
    });
  });

  test("2 → unpadded day", () => {
    expect(dateUtils.format(D, "2")).toMatchObject({ ok: true, val: "28" });
    expect(dateUtils.format(new Date(2026, 0, 5), "2")).toMatchObject({
      ok: true,
      val: "5",
    });
  });
});

// ─── format — day of year ────────────────────────────────────────────────────

describe("format: day of year", () => {
  test("002 → zero-padded 3-char day of year", () => {
    expect(dateUtils.format(new Date(2026, 0, 1), "002")).toMatchObject({
      ok: true,
      val: "001",
    });
    expect(dateUtils.format(new Date(2026, 0, 10), "002")).toMatchObject({
      ok: true,
      val: "010",
    });
    expect(dateUtils.format(new Date(2026, 11, 31), "002")).toMatchObject({
      ok: true,
      val: "365",
    });
  });

  test("__2 → space-padded 3-char day of year", () => {
    expect(dateUtils.format(new Date(2026, 0, 1), "__2")).toMatchObject({
      ok: true,
      val: "  1",
    });
    expect(dateUtils.format(new Date(2026, 0, 10), "__2")).toMatchObject({
      ok: true,
      val: " 10",
    });
    expect(dateUtils.format(new Date(2026, 11, 31), "__2")).toMatchObject({
      ok: true,
      val: "365",
    });
  });
});

// ─── format — hour ───────────────────────────────────────────────────────────

describe("format: hour", () => {
  test("15 → zero-padded 24h hour", () => {
    expect(dateUtils.format(D, "15")).toMatchObject({ ok: true, val: "19" });
    expect(dateUtils.format(new Date(2026, 0, 1, 9), "15")).toMatchObject({
      ok: true,
      val: "09",
    });
  });

  test("3 → unpadded 12h hour", () => {
    expect(dateUtils.format(D, "3")).toMatchObject({ ok: true, val: "7" }); // 19 → 7 PM
    expect(dateUtils.format(new Date(2026, 0, 1, 12), "3")).toMatchObject({
      ok: true,
      val: "12",
    }); // noon
    expect(dateUtils.format(new Date(2026, 0, 1, 0), "3")).toMatchObject({
      ok: true,
      val: "12",
    }); // midnight
  });

  test("03 → zero-padded 12h hour", () => {
    expect(dateUtils.format(D, "03")).toMatchObject({ ok: true, val: "07" });
    expect(dateUtils.format(new Date(2026, 0, 1, 0), "03")).toMatchObject({
      ok: true,
      val: "12",
    }); // midnight = 12 AM
    expect(dateUtils.format(new Date(2026, 0, 1, 12), "03")).toMatchObject({
      ok: true,
      val: "12",
    }); // noon = 12 PM
  });
});

// ─── format — minute / second ────────────────────────────────────────────────

describe("format: minute and second", () => {
  test("04 → zero-padded minute", () => {
    expect(dateUtils.format(D, "04")).toMatchObject({ ok: true, val: "09" });
  });

  test("4 → unpadded minute", () => {
    expect(dateUtils.format(D, "4")).toMatchObject({ ok: true, val: "9" });
    expect(dateUtils.format(new Date(2026, 0, 1, 0, 30), "4")).toMatchObject({
      ok: true,
      val: "30",
    });
  });

  test("05 → zero-padded second", () => {
    expect(dateUtils.format(D, "05")).toMatchObject({ ok: true, val: "52" });
    expect(dateUtils.format(new Date(2026, 0, 1, 0, 0, 7), "05")).toMatchObject(
      {
        ok: true,
        val: "07",
      },
    );
  });

  test("5 → unpadded second", () => {
    expect(dateUtils.format(D, "5")).toMatchObject({ ok: true, val: "52" });
    expect(dateUtils.format(new Date(2026, 0, 1, 0, 0, 7), "5")).toMatchObject({
      ok: true,
      val: "7",
    });
  });
});

// ─── format — AM/PM ──────────────────────────────────────────────────────────

describe("format: AM/PM", () => {
  test("PM → uppercase mark", () => {
    expect(dateUtils.format(new Date(2026, 0, 1, 19), "PM")).toMatchObject({
      ok: true,
      val: "PM",
    });
    expect(dateUtils.format(new Date(2026, 0, 1, 9), "PM")).toMatchObject({
      ok: true,
      val: "AM",
    });
    expect(dateUtils.format(new Date(2026, 0, 1, 0), "PM")).toMatchObject({
      ok: true,
      val: "AM",
    });
    expect(dateUtils.format(new Date(2026, 0, 1, 12), "PM")).toMatchObject({
      ok: true,
      val: "PM",
    });
  });

  test("pm → lowercase mark", () => {
    expect(dateUtils.format(new Date(2026, 0, 1, 19), "pm")).toMatchObject({
      ok: true,
      val: "pm",
    });
    expect(dateUtils.format(new Date(2026, 0, 1, 9), "pm")).toMatchObject({
      ok: true,
      val: "am",
    });
  });
});

// ─── format — fractional seconds ─────────────────────────────────────────────

describe("format: fractional seconds", () => {
  test(".000 → 3-digit fixed ms", () => {
    expect(dateUtils.format(D, "15:04:05.000")).toMatchObject({
      ok: true,
      val: "19:09:52.123",
    });
    expect(
      dateUtils.format(new Date(2026, 0, 1, 0, 0, 0, 5), "15:04:05.000"),
    ).toMatchObject({ ok: true, val: "00:00:00.005" });
  });

  test(".999 → trimmed trailing zeros", () => {
    expect(
      dateUtils.format(new Date(2026, 0, 1, 0, 0, 0, 100), "15:04:05.999"),
    ).toMatchObject({ ok: true, val: "00:00:00.1" });
    expect(
      dateUtils.format(new Date(2026, 0, 1, 0, 0, 0, 0), "15:04:05.999"),
    ).toMatchObject({ ok: true, val: "00:00:00" });
    expect(dateUtils.format(D, "15:04:05.999")).toMatchObject({
      ok: true,
      val: "19:09:52.123",
    });
  });

  test(".000000 → 6-digit fixed (ms padded)", () => {
    expect(dateUtils.format(D, "15:04:05.000000")).toMatchObject({
      ok: true,
      val: "19:09:52.123000",
    });
  });

  test(",000 → comma separator", () => {
    expect(dateUtils.format(D, "15:04:05,000")).toMatchObject({
      ok: true,
      val: "19:09:52,123",
    });
  });
});

// ─── format — timezone ───────────────────────────────────────────────────────

describe("format: timezone", () => {
  test("-0700 → ±hhmm numeric offset", () => {
    const res = dateUtils.format(D, "-0700");
    if (!res.ok) throw res.err;
    expect(res.val).toMatch(/^[+-]\d{4}$/);
  });

  test("-07:00 → ±hh:mm numeric offset", () => {
    const res = dateUtils.format(D, "-07:00");
    if (!res.ok) throw res.err;
    expect(res.val).toMatch(/^[+-]\d{2}:\d{2}$/);
  });

  test("-07 → ±hh short offset", () => {
    const res = dateUtils.format(D, "-07");
    if (!res.ok) throw res.err;
    expect(res.val).toMatch(/^[+-]\d{2}$/);
  });

  test("Z07:00 → Z or ±hh:mm (ISO 8601)", () => {
    // We can't assume the runner is in UTC, but we can assert the format
    const res = dateUtils.format(D, "Z07:00");
    if (!res.ok) throw res.err;
    expect(res.val).toMatch(/^(Z|[+-]\d{2}:\d{2})$/);
  });

  test("MST → timezone abbreviation string", () => {
    const res = dateUtils.format(D, "MST");
    if (!res.ok) throw res.err;
    expect(typeof res.val).toBe("string");
    expect(res.val.length).toBeGreaterThan(0);
  });
});

// ─── format — compound layouts ───────────────────────────────────────────────

describe("format: compound layouts", () => {
  test("DateOnly", () => {
    expect(dateUtils.format(D, DateOnly)).toMatchObject({
      ok: true,
      val: "2026-04-28",
    });
  });

  test("TimeOnly", () => {
    expect(dateUtils.format(D, TimeOnly)).toMatchObject({
      ok: true,
      val: "19:09:52",
    });
  });

  test("DateTime", () => {
    expect(dateUtils.format(D, DateTime)).toMatchObject({
      ok: true,
      val: "2026-04-28 19:09:52",
    });
  });

  test("Kitchen", () => {
    expect(dateUtils.format(D, Kitchen)).toMatchObject({
      ok: true,
      val: "7:09PM",
    });
  });

  test("Stamp", () => {
    expect(dateUtils.format(D, Stamp)).toMatchObject({
      ok: true,
      val: "Apr 28 19:09:52",
    });
  });

  test("StampMilli", () => {
    expect(dateUtils.format(D, StampMilli)).toMatchObject({
      ok: true,
      val: "Apr 28 19:09:52.123",
    });
  });

  test("literal text passes through verbatim", () => {
    expect(dateUtils.format(D, "2006-01-02T15:04:05")).toMatchObject({
      ok: true,
      val: "2026-04-28T19:09:52",
    });
  });

  test("YYYYMMDD compact layout", () => {
    expect(dateUtils.format(D, "20060102")).toMatchObject({
      ok: true,
      val: "20260428",
    });
  });

  test("YYYYMMDDHHMMSS compact layout", () => {
    expect(dateUtils.format(D, "20060102150405")).toMatchObject({
      ok: true,
      val: "20260428190952",
    });
  });
});

// ─── format — options object form ────────────────────────────────────────────

describe("format: options form (convert between layouts)", () => {
  test("RFC3339 string → UnixDate", () => {
    const result = dateUtils.format({
      date: "2026-01-02T13:04:05Z",
      in: "RFC3339",
      out: "DateOnly",
    });
    // UTC date so result is 2026-01-02 regardless of locale
    expect(result).toMatchObject({ ok: true, val: "2026-01-02" });
  });

  test("accepts Date object as input", () => {
    const result = dateUtils.format({
      date: D,
      in: "RFC3339",
      out: "DateOnly",
    });
    expect(result).toMatchObject({ ok: true, val: "2026-04-28" });
  });

  test("DateTime string → DateOnly", () => {
    // Use a layout that has no timezone so parse is unambiguous
    const result = dateUtils.format({
      date: "2026-04-28 19:09:52",
      in: "DateTime",
      out: "DateOnly",
    });
    expect(result).toMatchObject({ ok: true, val: "2026-04-28" });
  });
});

// ─── parse ───────────────────────────────────────────────────────────────────

describe("parse: date-only strings", () => {
  test("DateOnly → midnight local time", () => {
    const res = dateUtils.parse("2026-04-28", DateOnly);
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(3); // April
    expect(d.getDate()).toBe(28);
    expect(d.getHours()).toBe(0);
    expect(d.getMinutes()).toBe(0);
  });

  test("YYYYMMDD compact", () => {
    const res = dateUtils.parse("20260428", "20060102");
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(3);
    expect(d.getDate()).toBe(28);
  });
});

describe("parse: RFC3339 with timezone offsets", () => {
  test("Z suffix → UTC", () => {
    const res = dateUtils.parse("2026-04-28T19:09:52Z", RFC3339);
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.toISOString()).toBe("2026-04-28T19:09:52.000Z");
  });

  test("+07:00 offset", () => {
    const res = dateUtils.parse("2026-04-28T19:09:52+07:00", RFC3339);
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.toISOString()).toBe("2026-04-28T12:09:52.000Z");
  });

  test("-05:00 offset", () => {
    const res = dateUtils.parse("2026-04-28T19:09:52-05:00", RFC3339);
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.toISOString()).toBe("2026-04-29T00:09:52.000Z");
  });
});

describe("parse: fractional seconds", () => {
  test("RFC3339Nano", () => {
    const res = dateUtils.parse("2026-04-28T19:09:52.123456789Z", RFC3339Nano);
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getUTCMilliseconds()).toBe(123);
  });

  test(".000 layout", () => {
    const res = dateUtils.parse(
      "2026-04-28 19:09:52.456",
      "2006-01-02 15:04:05.000",
    );
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getMilliseconds()).toBe(456);
  });

  test(".999 layout (trimmed)", () => {
    const res = dateUtils.parse(
      "2026-04-28 19:09:52.1",
      "2006-01-02 15:04:05.999",
    );
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getMilliseconds()).toBe(100);
  });
});

describe("parse: 12-hour with AM/PM", () => {
  test("12PM → noon (hour 12)", () => {
    const res = dateUtils.parse("12:00PM", Kitchen);
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getHours()).toBe(12);
  });

  test("12AM → midnight (hour 0)", () => {
    const res = dateUtils.parse("12:00AM", Kitchen);
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getHours()).toBe(0);
  });

  test("7:09PM → hour 19", () => {
    const res = dateUtils.parse("7:09PM", Kitchen);
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getHours()).toBe(19);
    expect(d.getMinutes()).toBe(9);
  });

  test("3:04AM → hour 3", () => {
    const res = dateUtils.parse("3:04AM", Kitchen);
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getHours()).toBe(3);
  });
});

describe("parse: 2-digit year", () => {
  test(">= 69 → 1900s", () => {
    const res = dateUtils.parse("690101", "060102");
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getFullYear()).toBe(1969);
  });

  test("< 69 → 2000s", () => {
    const res = dateUtils.parse("260428", "060102");
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getFullYear()).toBe(2026);
  });

  test("00 → 2000", () => {
    const res = dateUtils.parse("000101", "060102");
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getFullYear()).toBe(2000);
  });
});

describe("parse: month formats", () => {
  test("January (full name)", () => {
    const res = dateUtils.parse("January 15, 2026", "January 2, 2006");
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getMonth()).toBe(0);
    expect(d.getDate()).toBe(15);
  });

  test("Jan (short name)", () => {
    const res = dateUtils.parse("Feb 03 2026", "Jan 02 2006");
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getMonth()).toBe(1);
    expect(d.getDate()).toBe(3);
  });

  test("case-insensitive month name", () => {
    const res = dateUtils.parse("MARCH 2026", "January 2006");
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getMonth()).toBe(2);
  });
});

describe("parse: weekday is ignored", () => {
  test("weekday consumed but does not affect date", () => {
    const res = dateUtils.parse("Mon Jan  5 15:04:05 2026", ANSIC);
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(0);
    expect(d.getDate()).toBe(5);
    expect(d.getHours()).toBe(15);
  });
});

describe("parse: named layout by string key", () => {
  test("'RFC3339' key resolves to layout", () => {
    const res = dateUtils.parse("2026-04-28T00:00:00Z", "RFC3339");
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.toISOString()).toBe("2026-04-28T00:00:00.000Z");
  });

  test("'DateOnly' key resolves to layout", () => {
    const res = dateUtils.parse("2026-04-28", "DateOnly");
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(3);
    expect(d.getDate()).toBe(28);
  });
});

describe("parse: RFC822Z / RFC1123Z", () => {
  test("RFC822Z numeric offset", () => {
    const res = dateUtils.parse("28 Apr 26 19:09 +0000", RFC822Z);
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getUTCFullYear()).toBe(2026);
    expect(d.getUTCMonth()).toBe(3);
    expect(d.getUTCDate()).toBe(28);
    expect(d.getUTCHours()).toBe(19);
    expect(d.getUTCMinutes()).toBe(9);
  });

  test("RFC1123Z numeric offset", () => {
    const res = dateUtils.parse("Tue, 28 Apr 2026 19:09:52 +0000", RFC1123Z);
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.toISOString()).toBe("2026-04-28T19:09:52.000Z");
  });
});

describe("parse: RubyDate", () => {
  test("parses RubyDate format", () => {
    const res = dateUtils.parse("Tue Apr 28 19:09:52 +0000 2026", RubyDate);
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.toISOString()).toBe("2026-04-28T19:09:52.000Z");
  });
});

// ─── round-trips ─────────────────────────────────────────────────────────────

describe("round-trip: format → parse", () => {
  test("DateOnly", () => {
    const formatRes = dateUtils.format(D, DateOnly);
    if (!formatRes.ok) throw formatRes.err;
    const parseRes = dateUtils.parse(formatRes.val, DateOnly);
    if (!parseRes.ok) throw parseRes.err;
    const parsed = parseRes.val;
    expect(parsed.getFullYear()).toBe(D.getFullYear());
    expect(parsed.getMonth()).toBe(D.getMonth());
    expect(parsed.getDate()).toBe(D.getDate());
  });

  test("DateTime", () => {
    const formatRes = dateUtils.format(D, DateTime);
    if (!formatRes.ok) throw formatRes.err;
    const parseRes = dateUtils.parse(formatRes.val, DateTime);
    if (!parseRes.ok) throw parseRes.err;
    const parsed = parseRes.val;
    expect(parsed.getFullYear()).toBe(D.getFullYear());
    expect(parsed.getMonth()).toBe(D.getMonth());
    expect(parsed.getDate()).toBe(D.getDate());
    expect(parsed.getHours()).toBe(D.getHours());
    expect(parsed.getMinutes()).toBe(D.getMinutes());
    expect(parsed.getSeconds()).toBe(D.getSeconds());
  });

  test("RFC3339 with UTC date", () => {
    const utc = new Date(Date.UTC(2026, 3, 28, 19, 9, 52));
    const formatRes = dateUtils.format(utc, RFC3339);
    if (!formatRes.ok) throw formatRes.err;
    const parseRes = dateUtils.parse(formatRes.val, RFC3339);
    if (!parseRes.ok) throw parseRes.err;
    const parsed = parseRes.val;
    expect(parsed.toISOString()).toBe(utc.toISOString());
  });

  test("RFC3339Nano preserves milliseconds", () => {
    const utc = new Date(Date.UTC(2026, 3, 28, 19, 9, 52, 456));
    const formatRes = dateUtils.format(utc, RFC3339Nano);
    if (!formatRes.ok) throw formatRes.err;
    const parseRes = dateUtils.parse(formatRes.val, RFC3339Nano);
    if (!parseRes.ok) throw parseRes.err;
    const parsed = parseRes.val;
    expect(parsed.getUTCMilliseconds()).toBe(456);
  });

  test("compact YYYYMMDDHHMMSS", () => {
    const formatRes = dateUtils.format(D, "20060102150405");
    if (!formatRes.ok) throw formatRes.err;
    const parseRes = dateUtils.parse(formatRes.val, "20060102150405");
    if (!parseRes.ok) throw parseRes.err;
    const parsed = parseRes.val;
    expect(parsed.getFullYear()).toBe(D.getFullYear());
    expect(parsed.getMonth()).toBe(D.getMonth());
    expect(parsed.getDate()).toBe(D.getDate());
    expect(parsed.getHours()).toBe(D.getHours());
    expect(parsed.getMinutes()).toBe(D.getMinutes());
    expect(parsed.getSeconds()).toBe(D.getSeconds());
  });
});

// ─── error cases ─────────────────────────────────────────────────────────────

describe("parse: errors", () => {
  test("bad month number returns error", () => {
    const res = dateUtils.parse("2026-13-01", DateOnly);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.err.message).toBe("bad month in value");
    }
  });

  test("bad hour returns error", () => {
    const res = dateUtils.parse("25:00:00", TimeOnly);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.err.message).toBe("bad hour in value");
    }
  });

  test("extra text returns error", () => {
    const res = dateUtils.parse("2026-04-28 extra", DateOnly);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.err.message).toBe("parsing time with extra text");
    }
  });

  test("literal mismatch returns error", () => {
    const res = dateUtils.parse("2026/04/28", "2006-01-02");
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.err.message).toBe("parsing prefix error");
    }
  });

  test("bad year returns error", () => {
    const res = dateUtils.parse("202-04-28", DateOnly);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.err.message).toBe("bad year in value");
    }
  });

  test("bad timezone offset returns error", () => {
    const res = dateUtils.parse("2026-04-28T19:09:52+99:99", RFC3339);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.err.message).toBe("invalid timezone offset");
    }
  });

  test("missing fractional second returns error", () => {
    const res = dateUtils.parse(
      "2026-04-28 19:09:52.",
      "2006-01-02 15:04:05.000",
    );
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.err.message).toBe("missing fractional second");
    }
  });

  test("bad timezone returns error", () => {
    const res = dateUtils.parse("Thu Feb  4 21:00:57 123 2010", UnixDate);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.err.message).toBe("bad timezone in value");
    }
  });

  test("bad AM/PM returns error", () => {
    const res = dateUtils.parse("07:09XX", Kitchen);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.err.message).toBe("bad AM/PM in value");
    }
  });
});

// ─── Go Parity ───────────────────────────────────────────────────────────────

describe("Go parity: literal collisions and whitespace", () => {
  test("Janet literal collision (format)", () => {
    expect(dateUtils.format(D, "Hi Janet, the Month is January")).toMatchObject(
      {
        ok: true,
        val: "Hi Janet, the Month is April",
      },
    );
  });

  test("Janet literal collision (parse)", () => {
    const res = dateUtils.parse(
      "Hi Janet, the Month is April",
      "Hi Janet, the Month is January",
    );
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getMonth()).toBe(3); // April
  });

  test("whitespace robustness", () => {
    const res = dateUtils.parse(
      "Thu      Feb     4     21:00:57     2010",
      ANSIC,
    );
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getFullYear()).toBe(2010);
    expect(d.getMonth()).toBe(1); // February
    expect(d.getDate()).toBe(4);
  });
});

// ─── Go parity: format token interactions ────────────────────────────────────
// Reference: Feb 4 2009 21:00:57.012 local — mirrors Go's Unix(0,1233810057012345600)
const FEB4 = new Date(2009, 1, 4, 21, 0, 57, 12);

describe("Go parity: format token interactions", () => {
  test("YearDay: 002 and __2 together", () => {
    // Feb 4 is day 35 of a non-leap year
    expect(dateUtils.format(FEB4, "Jan  2 002 __2 2")).toMatchObject({
      ok: true,
      val: "Feb  4 035  35 4",
    });
  });

  test("Year: literal non-token chars after 06", () => {
    // '6', '_6', '__6', '___6' are all literal — only '06' and '2006' are tokens
    expect(dateUtils.format(FEB4, "2006 6 06 _6 __6 ___6")).toMatchObject({
      ok: true,
      val: "2009 6 09 _6 __6 ___6",
    });
  });

  test("Month: _1 is literal underscore + numMonth", () => {
    expect(dateUtils.format(FEB4, "Jan January 1 01 _1")).toMatchObject({
      ok: true,
      val: "Feb February 2 02 _2",
    });
  });

  test("DayOfMonth: __2 is day-of-year, not day-of-month", () => {
    // _2 = space-padded day of month (4 → " 4"), __2 = space-padded day of year (35 → " 35")
    expect(dateUtils.format(FEB4, "2 02 _2 __2")).toMatchObject({
      ok: true,
      val: "4 04  4  35",
    });
  });

  test("DayOfWeek: Mon and Monday", () => {
    expect(dateUtils.format(FEB4, "Mon Monday")).toMatchObject({
      ok: true,
      val: "Wed Wednesday",
    });
  });

  test("Hour: _3 is literal underscore + 12h hour", () => {
    expect(dateUtils.format(FEB4, "15 3 03 _3")).toMatchObject({
      ok: true,
      val: "21 9 09 _9",
    });
  });

  test("Minute: _4 is literal underscore + minute", () => {
    expect(dateUtils.format(FEB4, "4 04 _4")).toMatchObject({
      ok: true,
      val: "0 00 _0",
    });
  });

  test("Second: _5 is literal underscore + second", () => {
    expect(dateUtils.format(FEB4, "5 05 _5")).toMatchObject({
      ok: true,
      val: "57 57 _57",
    });
  });

  test("single-digit format 3:4:5 (TestFormatSingleDigits)", () => {
    const d = new Date(2001, 1, 3, 4, 5, 6); // Feb 3 2001 04:05:06
    expect(dateUtils.format(d, "3:4:5")).toMatchObject({
      ok: true,
      val: "4:5:6",
    });
  });
});

// ─── Go parity: parse edge cases ─────────────────────────────────────────────

describe("Go parity: parse — optional inline fractional seconds", () => {
  test("fractional after seconds even when layout has no frac token (1 digit)", () => {
    // ANSIC has no .xxx in layout but value can have it
    const res = dateUtils.parse("Thu Feb  4 21:00:57.0 2010", ANSIC);
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getFullYear()).toBe(2010);
    expect(d.getSeconds()).toBe(57);
    expect(d.getMilliseconds()).toBe(0);
  });

  test("fractional after seconds even when layout has no frac token (3 digits)", () => {
    const res = dateUtils.parse("Thu Feb 04 21:00:57.012 -0800 2010", RubyDate);
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getSeconds()).toBe(57);
    expect(d.getMilliseconds()).toBe(12);
  });
});

describe("Go parity: parse — case insensitivity", () => {
  test("all-uppercase month and weekday (THU FEB)", () => {
    const res = dateUtils.parse("THU FEB 4 21:00:57 2010", ANSIC);
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getFullYear()).toBe(2010);
    expect(d.getMonth()).toBe(1);
    expect(d.getDate()).toBe(4);
  });

  test("all-lowercase month and weekday (thu feb)", () => {
    const res = dateUtils.parse("thu feb 4 21:00:57 2010", ANSIC);
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getFullYear()).toBe(2010);
    expect(d.getMonth()).toBe(1);
    expect(d.getDate()).toBe(4);
  });
});

describe("Go parity: parse — GMT±N timezone", () => {
  test("GMT-8 is parsed as UTC-8 offset", () => {
    // "Fri Feb  5 05:00:57 GMT-8 2010" in UTC-8 = 2010-02-05T13:00:57Z
    const res = dateUtils.parse("Fri Feb  5 05:00:57 GMT-8 2010", UnixDate);
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.toISOString()).toBe("2010-02-05T13:00:57.000Z");
  });
});

describe("Go parity: parse — all ISO 8601 / numeric timezone variants", () => {
  const base = "2010-02-04T21:00:57";

  test("Z07 — Z suffix", () => {
    const res = dateUtils.parse(`${base}Z`, "2006-01-02T15:04:05Z07");
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.toISOString()).toBe("2010-02-04T21:00:57.000Z");
  });

  test("Z07 — positive offset", () => {
    const res = dateUtils.parse(`${base}+08`, "2006-01-02T15:04:05Z07");
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.toISOString()).toBe("2010-02-04T13:00:57.000Z");
  });

  test("Z07 — negative offset", () => {
    const res = dateUtils.parse(`${base}-08`, "2006-01-02T15:04:05Z07");
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.toISOString()).toBe("2010-02-05T05:00:57.000Z");
  });

  test("Z0700 — Z suffix", () => {
    const res = dateUtils.parse(`${base}Z`, "2006-01-02T15:04:05Z0700");
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.toISOString()).toBe("2010-02-04T21:00:57.000Z");
  });

  test("Z0700 — ±hhmm", () => {
    const res = dateUtils.parse(`${base}+0800`, "2006-01-02T15:04:05Z0700");
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.toISOString()).toBe("2010-02-04T13:00:57.000Z");
  });

  test("Z070000 — Z suffix", () => {
    const res = dateUtils.parse(`${base}Z`, "2006-01-02T15:04:05Z070000");
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.toISOString()).toBe("2010-02-04T21:00:57.000Z");
  });

  test("Z070000 — ±hhmmss", () => {
    const res = dateUtils.parse(`${base}+080000`, "2006-01-02T15:04:05Z070000");
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.toISOString()).toBe("2010-02-04T13:00:57.000Z");
  });

  test("Z07:00 — Z suffix", () => {
    const res = dateUtils.parse(`${base}Z`, "2006-01-02T15:04:05Z07:00");
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.toISOString()).toBe("2010-02-04T21:00:57.000Z");
  });

  test("Z07:00 — ±hh:mm", () => {
    const res = dateUtils.parse(`${base}+08:00`, "2006-01-02T15:04:05Z07:00");
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.toISOString()).toBe("2010-02-04T13:00:57.000Z");
  });

  test("Z07:00:00 — Z suffix", () => {
    const res = dateUtils.parse(`${base}Z`, "2006-01-02T15:04:05Z07:00:00");
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.toISOString()).toBe("2010-02-04T21:00:57.000Z");
  });

  test("Z07:00:00 — ±hh:mm:ss", () => {
    const res = dateUtils.parse(
      `${base}+08:00:00`,
      "2006-01-02T15:04:05Z07:00:00",
    );
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.toISOString()).toBe("2010-02-04T13:00:57.000Z");
  });

  test("-0700 short layout custom", () => {
    const res = dateUtils.parse(
      "2010-02-04 21:00:57-08",
      "2006-01-02 15:04:05-07",
    );
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.toISOString()).toBe("2010-02-05T05:00:57.000Z");
  });
});

describe("Go parity: parse — .999 accepts zero fractional digits", () => {
  test(".999 layout with no fractional in value", () => {
    const res = dateUtils.parse(
      "Feb  4 21:00:57 2010",
      "Jan _2 15:04:05.999 2006",
    );
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getSeconds()).toBe(57);
    expect(d.getMilliseconds()).toBe(0);
  });

  test(".999 layout with trimmed value", () => {
    const res = dateUtils.parse(
      "Feb  4 21:00:57.012300000 2010",
      "Jan _2 15:04:05.999 2006",
    );
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getMilliseconds()).toBe(12);
  });
});

describe("Go parity: parse — day-of-year", () => {
  test("2006-01-02 002 layout (yday + date)", () => {
    const res = dateUtils.parse(
      "2010-02-04 035 21:00:57",
      "2006-01-02 002 15:04:05",
    );
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getMonth()).toBe(1);
    expect(d.getDate()).toBe(4);
  });

  test("2006-002 layout (yday only)", () => {
    const res = dateUtils.parse("2010-035 21:00:57", "2006-002 15:04:05");
    if (!res.ok) throw res.err;
    const d = res.val;
    expect(d.getFullYear()).toBe(2010);
    expect(d.getMonth()).toBe(1);
    expect(d.getDate()).toBe(4);
  });
});

// mirrors Go's dayOutOfRangeTests (all parsed with ANSIC "Mon Jan _2 15:04:05 2006")
describe("Go parity: day-out-of-range (dayOutOfRangeTests)", () => {
  const valid: string[] = [
    "Thu Jan 31 21:00:57 2010",
    "Thu Feb 28 21:00:57 2012",
    "Thu Feb 29 21:00:57 2012", // leap year
    "Thu Mar 31 21:00:57 2010",
    "Thu Apr 30 21:00:57 2010",
    "Thu May 31 21:00:57 2010",
    "Thu Jun 30 21:00:57 2010",
    "Thu Jul 31 21:00:57 2010",
    "Thu Aug 31 21:00:57 2010",
    "Thu Sep 30 21:00:57 2010",
    "Thu Oct 31 21:00:57 2010",
    "Thu Nov 30 21:00:57 2010",
    "Thu Dec 31 21:00:57 2010",
  ];
  const invalid: string[] = [
    "Thu Jan 99 21:00:57 2010",
    "Thu Jan 32 21:00:57 2010",
    "Thu Feb 29 21:00:57 2010", // non-leap year
    "Thu Mar 32 21:00:57 2010",
    "Thu Apr 31 21:00:57 2010",
    "Thu May 32 21:00:57 2010",
    "Thu Jun 31 21:00:57 2010",
    "Thu Jul 32 21:00:57 2010",
    "Thu Aug 32 21:00:57 2010",
    "Thu Sep 31 21:00:57 2010",
    "Thu Oct 32 21:00:57 2010",
    "Thu Nov 31 21:00:57 2010",
    "Thu Dec 32 21:00:57 2010",
    "Thu Dec 00 21:00:57 2010",
  ];

  for (const s of valid) {
    test(`valid: "${s}"`, () => {
      expect(dateUtils.parse(s, ANSIC).ok).toBe(true);
    });
  }
  for (const s of invalid) {
    test(`invalid: "${s}"`, () => {
      const res = dateUtils.parse(s, ANSIC);
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.err.message).toBe("time out of range");
      }
    });
  }
});
