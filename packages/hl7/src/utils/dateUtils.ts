// Portions of this file are derived from the Go standard library (src/time/format.go)
// Copyright 2009 The Go Authors.
// Licensed under the BSD-style license: https://go.dev/LICENSE
//
// The layout-token system, reference time, nextStdChunk algorithm, predefined
// layout constants, and parse/format logic are adapted from Go's time package.
// Adaptations: TypeScript types, millisecond precision (JS Date limitation),
// and removal of IANA timezone database support.

import type { OkResult } from "../types/okResult.ts";
import type { Result } from "../types/result.ts";
import { Err } from "./err.ts";

/** Layout — `01/02 03:04:05PM '06 -0700`. */
export const Layout = "01/02 03:04:05PM '06 -0700";
/** ANSIC — `Mon Jan _2 15:04:05 2006`. */
export const ANSIC = "Mon Jan _2 15:04:05 2006";
/** Unix Date — `Mon Jan _2 15:04:05 MST 2006`. */
export const UnixDate = "Mon Jan _2 15:04:05 MST 2006";
/** Ruby Date — `Mon Jan 02 15:04:05 -0700 2006`. */
export const RubyDate = "Mon Jan 02 15:04:05 -0700 2006";
/** RFC822 — `02 Jan 06 15:04 MST`. */
export const RFC822 = "02 Jan 06 15:04 MST";
/** RFC822 Z — `02 Jan 06 15:04 -0700`. */
export const RFC822Z = "02 Jan 06 15:04 -0700";
/** RFC850 — `Monday, 02-Jan-06 15:04:05 MST`. */
export const RFC850 = "Monday, 02-Jan-06 15:04:05 MST";
/** RFC1123 — `Mon, 02 Jan 2006 15:04:05 MST`. */
export const RFC1123 = "Mon, 02 Jan 2006 15:04:05 MST";
/** RFC1123 Z — `Mon, 02 Jan 2006 15:04:05 -0700`. */
export const RFC1123Z = "Mon, 02 Jan 2006 15:04:05 -0700";
/** RFC3339 — `2006-01-02T15:04:05Z07:00`. */
export const RFC3339 = "2006-01-02T15:04:05Z07:00";
/** RFC3339 Nano — `2006-01-02T15:04:05.999999999Z07:00`. */
export const RFC3339Nano = "2006-01-02T15:04:05.999999999Z07:00";
/** Kitchen — `3:04PM`. */
export const Kitchen = "3:04PM";
/** Stamp — `Jan _2 15:04:05`. */
export const Stamp = "Jan _2 15:04:05";
/** Stamp Milli — `Jan _2 15:04:05.000`. */
export const StampMilli = "Jan _2 15:04:05.000";
/** Stamp Micro — `Jan _2 15:04:05.000000`. */
export const StampMicro = "Jan _2 15:04:05.000000";
/** Stamp Nano — `Jan _2 15:04:05.000000000`. */
export const StampNano = "Jan _2 15:04:05.000000000";
/** Date Time — `2006-01-02 15:04:05`. */
export const DateTime = "2006-01-02 15:04:05";
/** Date Only — `2006-01-02`. */
export const DateOnly = "2006-01-02";
/** Time Only — `15:04:05`. */
export const TimeOnly = "15:04:05";

/** The DateLayoutError type. */
export type DateLayoutError =
  | "parsing time with extra text"
  | "parsing prefix error"
  | "missing fractional second"
  | "missing timezone offset"
  | "invalid timezone offset"
  | "missing AM/PM"
  | "invalid AM/PM"
  | "bad year in value"
  | "bad 2-digit year in value"
  | "bad month in value"
  | "bad month abbreviation in value"
  | "bad weekday in value"
  | "bad day in value"
  | "bad zero-padded day in value"
  | "bad day-of-year in value"
  | "bad hour in value"
  | "bad 12-hour in value"
  | "bad minute in value"
  | "bad second in value"
  | "bad AM/PM in value"
  | "bad timezone in value"
  | "bad timezone offset in value"
  | "bad tz colon"
  | "time out of range";

/** The LayoutName type. */
export type LayoutName =
  | "Layout"
  | "ANSIC"
  | "UnixDate"
  | "RubyDate"
  | "RFC822"
  | "RFC822Z"
  | "RFC850"
  | "RFC1123"
  | "RFC1123Z"
  | "RFC3339"
  | "RFC3339Nano"
  | "Kitchen"
  | "Stamp"
  | "StampMilli"
  | "StampMicro"
  | "StampNano"
  | "DateTime"
  | "DateOnly"
  | "TimeOnly";

const LAYOUTS: Record<LayoutName, string> = {
  Layout,
  ANSIC,
  UnixDate,
  RubyDate,
  RFC822,
  RFC822Z,
  RFC850,
  RFC1123,
  RFC1123Z,
  RFC3339,
  RFC3339Nano,
  Kitchen,
  Stamp,
  StampMilli,
  StampMicro,
  StampNano,
  DateTime,
  DateOnly,
  TimeOnly,
};

// ─── token types ────────────────────────────────────────────────────────────

type FracToken = {
  kind: "frac";
  digits: number;
  trim: boolean;
  sep: "." | ",";
};
type StrToken =
  | "stdLongYear"
  | "stdYear"
  | "stdLongMonth"
  | "stdMonth"
  | "stdNumMonth"
  | "stdZeroMonth"
  | "stdLongWeekDay"
  | "stdWeekDay"
  | "stdDay"
  | "stdUnderDay"
  | "stdZeroDay"
  | "stdUnderYearDay"
  | "stdZeroYearDay"
  | "stdHour"
  | "stdHour12"
  | "stdZeroHour12"
  | "stdMinute"
  | "stdZeroMinute"
  | "stdSecond"
  | "stdZeroSecond"
  | "stdPM"
  | "stdpm"
  | "stdTZ"
  | "stdISO8601TZ"
  | "stdISO8601ColonTZ"
  | "stdISO8601ShortTZ"
  | "stdISO8601SecondsTZ"
  | "stdISO8601ColonSecondsTZ"
  | "stdNumTZ"
  | "stdNumColonTZ"
  | "stdNumShortTZ"
  | "stdNumSecondsTz"
  | "stdNumColonSecondsTZ";
type StdToken = StrToken | FracToken;

// std0x maps '1'-'6' (after '0') to tokens
const std0x: StrToken[] = [
  "stdZeroMonth",
  "stdZeroDay",
  "stdZeroHour12",
  "stdZeroMinute",
  "stdZeroSecond",
  "stdYear",
];

const shortMonthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const longMonthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const longDayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// ─── nextStdChunk ────────────────────────────────────────────────────────────

function startsWithLowerCase(s: string): boolean {
  if (s.length === 0) return false;
  const c = s.charCodeAt(0);
  return c >= 97 && c <= 122;
}

function isDigitAt(s: string, i: number): boolean {
  if (i >= s.length) return false;
  const c = s.charCodeAt(i);
  return c >= 48 && c <= 57;
}

function nextStdChunk(layout: string): {
  prefix: string;
  std: StdToken | null;
  suffix: string;
} {
  for (let i = 0; i < layout.length; i++) {
    switch (layout[i]) {
      case "J":
        if (layout.length >= i + 7 && layout.slice(i, i + 7) === "January")
          return {
            prefix: layout.slice(0, i),
            std: "stdLongMonth",
            suffix: layout.slice(i + 7),
          };
        if (
          layout.length >= i + 3 &&
          layout.slice(i, i + 3) === "Jan" &&
          !startsWithLowerCase(layout.slice(i + 3))
        )
          return {
            prefix: layout.slice(0, i),
            std: "stdMonth",
            suffix: layout.slice(i + 3),
          };
        break;

      case "M":
        if (layout.length >= i + 6 && layout.slice(i, i + 6) === "Monday")
          return {
            prefix: layout.slice(0, i),
            std: "stdLongWeekDay",
            suffix: layout.slice(i + 6),
          };
        if (
          layout.length >= i + 3 &&
          layout.slice(i, i + 3) === "Mon" &&
          !startsWithLowerCase(layout.slice(i + 3))
        )
          return {
            prefix: layout.slice(0, i),
            std: "stdWeekDay",
            suffix: layout.slice(i + 3),
          };
        if (layout.length >= i + 3 && layout.slice(i, i + 3) === "MST")
          return {
            prefix: layout.slice(0, i),
            std: "stdTZ",
            suffix: layout.slice(i + 3),
          };
        break;

      case "0": {
        const next = layout.charCodeAt(i + 1);
        if (
          layout.length >= i + 3 &&
          layout[i + 1] === "0" &&
          layout[i + 2] === "2"
        )
          return {
            prefix: layout.slice(0, i),
            std: "stdZeroYearDay",
            suffix: layout.slice(i + 3),
          };
        if (layout.length >= i + 2 && next >= 49 && next <= 54)
          return {
            prefix: layout.slice(0, i),
            std: std0x[next - 49],
            suffix: layout.slice(i + 2),
          };
        break;
      }

      case "1":
        if (layout.length >= i + 2 && layout[i + 1] === "5")
          return {
            prefix: layout.slice(0, i),
            std: "stdHour",
            suffix: layout.slice(i + 2),
          };
        return {
          prefix: layout.slice(0, i),
          std: "stdNumMonth",
          suffix: layout.slice(i + 1),
        };

      case "2":
        if (layout.length >= i + 4 && layout.slice(i, i + 4) === "2006")
          return {
            prefix: layout.slice(0, i),
            std: "stdLongYear",
            suffix: layout.slice(i + 4),
          };
        return {
          prefix: layout.slice(0, i),
          std: "stdDay",
          suffix: layout.slice(i + 1),
        };

      case "_":
        if (
          layout.length >= i + 3 &&
          layout[i + 1] === "_" &&
          layout[i + 2] === "2"
        )
          return {
            prefix: layout.slice(0, i),
            std: "stdUnderYearDay",
            suffix: layout.slice(i + 3),
          };
        if (layout.length >= i + 2 && layout[i + 1] === "2") {
          // _2006 is literal '_' then stdLongYear
          if (layout.length >= i + 5 && layout.slice(i + 1, i + 5) === "2006")
            return {
              prefix: layout.slice(0, i + 1),
              std: "stdLongYear",
              suffix: layout.slice(i + 5),
            };
          return {
            prefix: layout.slice(0, i),
            std: "stdUnderDay",
            suffix: layout.slice(i + 2),
          };
        }
        break;

      case "3":
        return {
          prefix: layout.slice(0, i),
          std: "stdHour12",
          suffix: layout.slice(i + 1),
        };
      case "4":
        return {
          prefix: layout.slice(0, i),
          std: "stdMinute",
          suffix: layout.slice(i + 1),
        };
      case "5":
        return {
          prefix: layout.slice(0, i),
          std: "stdSecond",
          suffix: layout.slice(i + 1),
        };

      case "P":
        if (layout.length >= i + 2 && layout[i + 1] === "M")
          return {
            prefix: layout.slice(0, i),
            std: "stdPM",
            suffix: layout.slice(i + 2),
          };
        break;

      case "p":
        if (layout.length >= i + 2 && layout[i + 1] === "m")
          return {
            prefix: layout.slice(0, i),
            std: "stdpm",
            suffix: layout.slice(i + 2),
          };
        break;

      case "-":
        if (layout.length >= i + 9 && layout.slice(i, i + 9) === "-07:00:00")
          return {
            prefix: layout.slice(0, i),
            std: "stdNumColonSecondsTZ",
            suffix: layout.slice(i + 9),
          };
        if (layout.length >= i + 7 && layout.slice(i, i + 7) === "-070000")
          return {
            prefix: layout.slice(0, i),
            std: "stdNumSecondsTz",
            suffix: layout.slice(i + 7),
          };
        if (layout.length >= i + 6 && layout.slice(i, i + 6) === "-07:00")
          return {
            prefix: layout.slice(0, i),
            std: "stdNumColonTZ",
            suffix: layout.slice(i + 6),
          };
        if (layout.length >= i + 5 && layout.slice(i, i + 5) === "-0700")
          return {
            prefix: layout.slice(0, i),
            std: "stdNumTZ",
            suffix: layout.slice(i + 5),
          };
        if (layout.length >= i + 3 && layout.slice(i, i + 3) === "-07")
          return {
            prefix: layout.slice(0, i),
            std: "stdNumShortTZ",
            suffix: layout.slice(i + 3),
          };
        break;

      case "Z":
        if (layout.length >= i + 9 && layout.slice(i, i + 9) === "Z07:00:00")
          return {
            prefix: layout.slice(0, i),
            std: "stdISO8601ColonSecondsTZ",
            suffix: layout.slice(i + 9),
          };
        if (layout.length >= i + 7 && layout.slice(i, i + 7) === "Z070000")
          return {
            prefix: layout.slice(0, i),
            std: "stdISO8601SecondsTZ",
            suffix: layout.slice(i + 7),
          };
        if (layout.length >= i + 6 && layout.slice(i, i + 6) === "Z07:00")
          return {
            prefix: layout.slice(0, i),
            std: "stdISO8601ColonTZ",
            suffix: layout.slice(i + 6),
          };
        if (layout.length >= i + 5 && layout.slice(i, i + 5) === "Z0700")
          return {
            prefix: layout.slice(0, i),
            std: "stdISO8601TZ",
            suffix: layout.slice(i + 5),
          };
        if (layout.length >= i + 3 && layout.slice(i, i + 3) === "Z07")
          return {
            prefix: layout.slice(0, i),
            std: "stdISO8601ShortTZ",
            suffix: layout.slice(i + 3),
          };
        break;

      case ".":
      case ",": {
        const sep = layout[i] as "." | ",";
        if (
          i + 1 < layout.length &&
          (layout[i + 1] === "0" || layout[i + 1] === "9")
        ) {
          const ch = layout[i + 1];
          let j = i + 1;
          while (j < layout.length && layout[j] === ch) j++;
          if (!isDigitAt(layout, j)) {
            return {
              prefix: layout.slice(0, i),
              std: { kind: "frac", digits: j - (i + 1), trim: ch === "9", sep },
              suffix: layout.slice(j),
            };
          }
        }
        break;
      }
    }
  }
  return { prefix: layout, std: null, suffix: "" };
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function p2(n: number): string {
  return n < 10 ? "0" + n : String(n);
}
function p3(n: number): string {
  return n < 10 ? "00" + n : n < 100 ? "0" + n : String(n);
}
function p4(n: number): string {
  return n < 10
    ? "000" + n
    : n < 100
      ? "00" + n
      : n < 1000
        ? "0" + n
        : String(n);
}

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  return Math.floor((date.getTime() - start.getTime()) / 86400000) + 1;
}

function tzAbbr(date: Date): string {
  try {
    const parts = Intl.DateTimeFormat("en-US", {
      timeZoneName: "short",
    }).formatToParts(date);
    return (
      parts.find((p) => p.type === "timeZoneName")?.value ??
      tzNumeric(date, "hhmm")
    );
  } catch {
    return tzNumeric(date, "hhmm");
  }
}

function tzNumeric(
  date: Date,
  style: "hhmm" | "hh:mm" | "hh" | "hhmmss" | "hh:mm:ss",
  useZ = false,
): string {
  const off = -date.getTimezoneOffset();
  if (useZ && off === 0) return "Z";
  const sign = off >= 0 ? "+" : "-";
  const abs = Math.abs(off);
  const hh = Math.floor(abs / 60);
  const mm = abs % 60;
  switch (style) {
    case "hh":
      return sign + p2(hh);
    case "hhmm":
      return sign + p2(hh) + p2(mm);
    case "hh:mm":
      return sign + p2(hh) + ":" + p2(mm);
    case "hhmmss":
      return sign + p2(hh) + p2(mm) + "00";
    case "hh:mm:ss":
      return sign + p2(hh) + ":" + p2(mm) + ":00";
  }
}

// ─── format ──────────────────────────────────────────────────────────────────

function formatWithLayout(date: Date, layout: string): string {
  let out = "";
  let rem = layout;

  while (rem !== "") {
    const { prefix, std, suffix } = nextStdChunk(rem);
    out += prefix;
    if (std === null) break;
    rem = suffix;

    if (typeof std === "object") {
      const msStr = String(date.getMilliseconds()).padStart(3, "0");
      let frac = (msStr + "000000").slice(0, std.digits);
      if (std.trim) {
        frac = frac.replace(/0+$/, "");
        if (frac.length > 0) out += std.sep + frac;
      } else {
        out += std.sep + frac;
      }
      continue;
    }

    const yr = date.getFullYear();
    const mon = date.getMonth(); // 0-based
    const day = date.getDate();
    const hr = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();

    switch (std) {
      case "stdLongYear":
        out += p4(yr);
        break;
      case "stdYear":
        out += p2(Math.abs(yr) % 100);
        break;
      case "stdLongMonth":
        out += longMonthNames[mon];
        break;
      case "stdMonth":
        out += shortMonthNames[mon];
        break;
      case "stdNumMonth":
        out += String(mon + 1);
        break;
      case "stdZeroMonth":
        out += p2(mon + 1);
        break;
      case "stdLongWeekDay":
        out += longDayNames[date.getDay()];
        break;
      case "stdWeekDay":
        out += shortDayNames[date.getDay()];
        break;
      case "stdDay":
        out += String(day);
        break;
      case "stdUnderDay":
        out += day < 10 ? " " + day : String(day);
        break;
      case "stdZeroDay":
        out += p2(day);
        break;
      case "stdUnderYearDay": {
        const y = dayOfYear(date);
        out += y < 10 ? "  " + y : y < 100 ? " " + y : String(y);
        break;
      }
      case "stdZeroYearDay":
        out += p3(dayOfYear(date));
        break;
      case "stdHour":
        out += p2(hr);
        break;
      case "stdHour12": {
        const h = hr % 12 || 12;
        out += String(h);
        break;
      }
      case "stdZeroHour12": {
        const h = hr % 12 || 12;
        out += p2(h);
        break;
      }
      case "stdMinute":
        out += String(min);
        break;
      case "stdZeroMinute":
        out += p2(min);
        break;
      case "stdSecond":
        out += String(sec);
        break;
      case "stdZeroSecond":
        out += p2(sec);
        break;
      case "stdPM":
        out += hr >= 12 ? "PM" : "AM";
        break;
      case "stdpm":
        out += hr >= 12 ? "pm" : "am";
        break;
      case "stdTZ":
        out += tzAbbr(date);
        break;
      case "stdISO8601TZ":
        out += tzNumeric(date, "hhmm", true);
        break;
      case "stdISO8601ColonTZ":
        out += tzNumeric(date, "hh:mm", true);
        break;
      case "stdISO8601ShortTZ":
        out += tzNumeric(date, "hh", true);
        break;
      case "stdISO8601SecondsTZ":
        out += tzNumeric(date, "hhmmss", true);
        break;
      case "stdISO8601ColonSecondsTZ":
        out += tzNumeric(date, "hh:mm:ss", true);
        break;
      case "stdNumTZ":
        out += tzNumeric(date, "hhmm");
        break;
      case "stdNumColonTZ":
        out += tzNumeric(date, "hh:mm");
        break;
      case "stdNumShortTZ":
        out += tzNumeric(date, "hh");
        break;
      case "stdNumSecondsTz":
        out += tzNumeric(date, "hhmmss");
        break;
      case "stdNumColonSecondsTZ":
        out += tzNumeric(date, "hh:mm:ss");
        break;
    }
  }
  return out;
}

// ─── parse ───────────────────────────────────────────────────────────────────

// Returns [value, rest, error]
function getnum(s: string, fixed: boolean): [number, string, boolean] {
  if (!isDigitAt(s, 0)) return [0, s, true];
  if (!isDigitAt(s, 1)) {
    if (fixed) return [0, s, true];
    return [s.charCodeAt(0) - 48, s.slice(1), false];
  }
  return [
    (s.charCodeAt(0) - 48) * 10 + (s.charCodeAt(1) - 48),
    s.slice(2),
    false,
  ];
}

function skipPrefix(
  value: string,
  prefix: string,
): Result<string, "parsing prefix error"> {
  let vi = 0;
  for (let pi = 0; pi < prefix.length; pi++) {
    if (prefix[pi] === " ") {
      while (vi < value.length && value[vi] === " ") vi++;
      continue;
    }
    if (vi >= value.length || value[vi] !== prefix[pi])
      return {
        ok: false,
        err: new Err("parsing prefix error").addCause(
          `cannot match literal "${prefix[pi]}" in "${value}"`,
        ),
      };
    vi++;
  }
  return { ok: true, val: value.slice(vi) } satisfies OkResult<string>;
}

function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

function ydayToMonthDay(
  yday: number,
  year: number,
): { month: number; day: number } {
  const dims = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  let m = 0;
  let d = yday;
  while (m < 12 && d > dims[m]) {
    d -= dims[m];
    m++;
  }
  return { month: m, day: d };
}

function parseWithLayout(
  value: string,
  layout: string,
): Result<Date, DateLayoutError> {
  let rem = value;
  let layRem = layout;

  let year = 0,
    month = 0,
    day = 1,
    hour = 0,
    min = 0,
    sec = 0,
    ms = 0;
  let zoneOffMin: number | null = null;
  let pmSet = false,
    amSet = false;
  let yearSet = false;

  while (true) {
    const { prefix, std, suffix } = nextStdChunk(layRem);

    if (prefix !== "") {
      const i = skipPrefix(rem, prefix);
      if (!i.ok) return i;
      rem = i.val;
    }
    if (std === null) {
      if (rem.length !== 0)
        return {
          ok: false,
          err: new Err("parsing time with extra text").addCause(
            `parsing time "${value}": extra text: "${rem}"`,
          ),
        };
      break;
    }
    layRem = suffix;

    // fractional seconds
    if (typeof std === "object") {
      if (
        rem.length < 2 ||
        (rem[0] !== "." && rem[0] !== ",") ||
        !isDigitAt(rem, 1)
      ) {
        if (std.trim) continue; // optional
        return {
          ok: false,
          err: new Err("missing fractional second").addCause(
            `parsing time "${value}": missing fractional second`,
          ),
        };
      }
      let j = 1;
      while (isDigitAt(rem, j)) j++;
      const digits = rem.slice(1, j);
      ms = parseInt(digits.padEnd(3, "0").slice(0, 3));
      rem = rem.slice(j);
      continue;
    }

    let v: number, rest: string, err: boolean;

    switch (std) {
      case "stdLongYear":
        if (
          rem.length < 4 ||
          !isDigitAt(rem, 0) ||
          !isDigitAt(rem, 1) ||
          !isDigitAt(rem, 2) ||
          !isDigitAt(rem, 3)
        )
          return {
            ok: false,
            err: new Err("bad year in value").addCause(
              `bad year in "${value}"`,
            ),
          };
        year = parseInt(rem.slice(0, 4));
        rem = rem.slice(4);
        yearSet = true;
        break;

      case "stdYear": {
        if (rem.length < 2) {
          return {
            ok: false,
            err: new Err("bad 2-digit year in value").addCause(
              `bad 2-digit year in "${value}"`,
            ),
          };
        }
        const y2 = parseInt(rem.slice(0, 2));
        rem = rem.slice(2);
        year = y2 >= 69 ? 1900 + y2 : 2000 + y2;
        yearSet = true;
        break;
      }

      case "stdLongMonth": {
        const idx = longMonthNames.findIndex(
          (m) => rem.slice(0, m.length).toLowerCase() === m.toLowerCase(),
        );
        if (idx === -1) {
          return {
            ok: false,
            err: new Err("bad month in value").addCause(
              `bad month in "${value}"`,
            ),
          };
        }
        month = idx;
        rem = rem.slice(longMonthNames[idx].length);
        break;
      }

      case "stdMonth": {
        const idx = shortMonthNames.findIndex(
          (m) => rem.slice(0, 3).toLowerCase() === m.toLowerCase(),
        );
        if (idx === -1) {
          return {
            ok: false,
            err: new Err("bad month abbreviation in value").addCause(
              `bad month abbreviation in "${value}"`,
            ),
          };
        }
        month = idx;
        rem = rem.slice(3);
        break;
      }

      case "stdNumMonth":
      case "stdZeroMonth":
        [v, rest, err] = getnum(rem, std === "stdZeroMonth");
        if (err || v < 1 || v > 12) {
          return {
            ok: false,
            err: new Err("bad month in value").addCause(
              `bad month in "${value}"`,
            ),
          };
        }
        month = v - 1;
        rem = rest;
        break;

      case "stdLongWeekDay": {
        const idx = longDayNames.findIndex(
          (d) => rem.slice(0, d.length).toLowerCase() === d.toLowerCase(),
        );
        if (idx === -1) {
          return {
            ok: false,
            err: new Err("bad weekday in value").addCause(
              `bad weekday in "${value}"`,
            ),
          };
        }
        rem = rem.slice(longDayNames[idx].length);
        break;
      }

      case "stdWeekDay": {
        const idx = shortDayNames.findIndex(
          (d) => rem.slice(0, 3).toLowerCase() === d.toLowerCase(),
        );
        if (idx === -1) {
          return {
            ok: false,
            err: new Err("bad weekday in value").addCause(
              `bad weekday in "${value}"`,
            ),
          };
        }
        rem = rem.slice(3);
        break;
      }

      case "stdDay":
        [v, rest, err] = getnum(rem, false);
        if (err) {
          return {
            ok: false,
            err: new Err("bad day in value").addCause(`bad day in "${value}"`),
          };
        }
        day = v;
        rem = rest;
        break;

      case "stdUnderDay":
        if (rem[0] === " ") rem = rem.slice(1);
        [v, rest, err] = getnum(rem, false);
        if (err) {
          return {
            ok: false,
            err: new Err("bad day in value").addCause(`bad day in "${value}"`),
          };
        }
        day = v;
        rem = rest;
        break;

      case "stdZeroDay":
        [v, rest, err] = getnum(rem, true);
        if (err) {
          return {
            ok: false,
            err: new Err("bad zero-padded day in value").addCause(
              `bad zero-padded day in "${value}"`,
            ),
          };
        }
        day = v;
        rem = rest;
        break;

      case "stdUnderYearDay":
        while (rem[0] === " ") rem = rem.slice(1);
      // fall through
      case "stdZeroYearDay": {
        let j = 0;
        while (j < 3 && isDigitAt(rem, j)) j++;
        if (j === 0) {
          return {
            ok: false,
            err: new Err("bad day-of-year in value").addCause(
              `bad day-of-year in "${value}"`,
            ),
          };
        }
        const yday = parseInt(rem.slice(0, j));
        rem = rem.slice(j);
        const yr = yearSet ? year : new Date().getFullYear();
        const { month: m, day: d } = ydayToMonthDay(yday, yr);
        month = m;
        day = d;
        break;
      }

      case "stdHour":
        [v, rest, err] = getnum(rem, false);
        if (err || v < 0 || v > 23) {
          return {
            ok: false,
            err: new Err("bad hour in value").addCause(
              `bad hour in "${value}"`,
            ),
          };
        }
        hour = v;
        rem = rest;
        break;

      case "stdHour12":
      case "stdZeroHour12":
        [v, rest, err] = getnum(rem, std === "stdZeroHour12");
        if (err || v < 1 || v > 12) {
          return {
            ok: false,
            err: new Err("bad 12-hour in value").addCause(
              `bad 12-hour in "${value}"`,
            ),
          };
        }
        hour = v;
        rem = rest;
        break;

      case "stdMinute":
      case "stdZeroMinute":
        [v, rest, err] = getnum(rem, std === "stdZeroMinute");
        if (err || v < 0 || v > 59) {
          return {
            ok: false,
            err: new Err("bad minute in value").addCause(
              `bad minute in "${value}"`,
            ),
          };
        }
        min = v;
        rem = rest;
        break;

      case "stdSecond":
      case "stdZeroSecond":
        [v, rest, err] = getnum(rem, std === "stdZeroSecond");
        if (err || v < 0 || v > 59) {
          return {
            ok: false,
            err: new Err("bad second in value").addCause(
              `bad second in "${value}"`,
            ),
          };
        }
        sec = v;
        rem = rest;
        // consume optional fractional part only when next layout token is NOT a frac token
        // (mirrors Go's time.parse peek-ahead for this special case)
        if (
          rem.length >= 2 &&
          (rem[0] === "." || rem[0] === ",") &&
          isDigitAt(rem, 1)
        ) {
          const { std: nextStd } = nextStdChunk(layRem);
          if (typeof nextStd !== "object") {
            let j = 1;
            while (isDigitAt(rem, j)) j++;
            ms = parseInt(rem.slice(1, j).padEnd(3, "0").slice(0, 3));
            rem = rem.slice(j);
          }
        }
        break;

      case "stdPM":
      case "stdpm": {
        if (rem.length < 2) {
          return {
            ok: false,
            err: new Err("bad AM/PM in value").addCause(
              `bad AM/PM in "${value}"`,
            ),
          };
        }
        const mark = rem.slice(0, 2).toLowerCase();
        if (mark === "pm") pmSet = true;
        else if (mark === "am") amSet = true;
        else {
          return {
            ok: false,
            err: new Err("bad AM/PM in value").addCause(
              `bad AM/PM in "${value}"`,
            ),
          };
        }
        rem = rem.slice(2);
        break;
      }

      case "stdTZ": {
        let j = 0;
        if (rem.slice(0, 4) === "ChST" || rem.slice(0, 4) === "MeST") {
          j = 4;
        } else if (rem.slice(0, 3) === "UTC") {
          j = 3;
          zoneOffMin = 0;
        } else if (rem.slice(0, 3) === "GMT") {
          j = 3;
          zoneOffMin = 0;
          // handle GMT±N (e.g. "GMT-8", "GMT+5")
          if (j < rem.length && (rem[j] === "+" || rem[j] === "-")) {
            const gSign = rem[j] === "-" ? -1 : 1;
            let k = j + 1;
            while (k < rem.length && isDigitAt(rem, k)) k++;
            if (k > j + 1) {
              zoneOffMin = gSign * parseInt(rem.slice(j + 1, k)) * 60;
              j = k;
            }
          }
        } else {
          while (
            j < 5 &&
            j < rem.length &&
            rem.charCodeAt(j) >= 65 &&
            rem.charCodeAt(j) <= 90
          )
            j++;
        }
        if (j === 0) {
          return {
            ok: false,
            err: new Err("bad timezone in value").addCause(
              `bad timezone in "${value}"`,
            ),
          };
        }
        rem = rem.slice(j);
        break;
      }

      case "stdISO8601TZ":
      case "stdISO8601ColonTZ":
      case "stdISO8601ShortTZ":
      case "stdISO8601SecondsTZ":
      case "stdISO8601ColonSecondsTZ":
        if (rem[0] === "Z") {
          zoneOffMin = 0;
          rem = rem.slice(1);
          break;
        }
      // fall through to numeric offset parsing
      case "stdNumTZ":
      case "stdNumColonTZ":
      case "stdNumShortTZ":
      case "stdNumSecondsTz":
      case "stdNumColonSecondsTZ": {
        if (rem.length === 0 || (rem[0] !== "+" && rem[0] !== "-")) {
          return {
            ok: false,
            err: new Err("bad timezone offset in value").addCause(
              `bad timezone offset in "${value}"`,
            ),
          };
        }
        const sign = rem[0] === "-" ? -1 : 1;
        rem = rem.slice(1);

        const isColon =
          std === "stdISO8601ColonTZ" ||
          std === "stdNumColonTZ" ||
          std === "stdISO8601ColonSecondsTZ" ||
          std === "stdNumColonSecondsTZ";
        const isShort = std === "stdISO8601ShortTZ" || std === "stdNumShortTZ";
        const isSec =
          std === "stdISO8601SecondsTZ" ||
          std === "stdNumSecondsTz" ||
          std === "stdISO8601ColonSecondsTZ" ||
          std === "stdNumColonSecondsTZ";

        const tzHH = parseInt(rem.slice(0, 2));
        if (tzHH > 23)
          return {
            ok: false,
            err: new Err("invalid timezone offset").addCause(
              `bad timezone hour in "${value}"`,
            ),
          };
        rem = rem.slice(2);
        let tzMM = 0;
        if (!isShort) {
          if (isColon) {
            if (rem[0] !== ":") {
              return {
                ok: false,
                err: new Err("bad tz colon").addCause(`bad tz colon`),
              };
            }
            rem = rem.slice(1);
          }
          tzMM = parseInt(rem.slice(0, 2));
          if (tzMM > 59)
            return {
              ok: false,
              err: new Err("invalid timezone offset").addCause(
                `bad timezone minute in "${value}"`,
              ),
            };
          rem = rem.slice(2);
          if (isSec) {
            if (isColon) {
              if (rem[0] !== ":") {
                return {
                  ok: false,
                  err: new Err("bad tz colon").addCause(`bad tz colon`),
                };
              }
              rem = rem.slice(1);
            }
            rem = rem.slice(2); // consume seconds but ignore (JS has no sub-minute tz)
          }
        }
        zoneOffMin = sign * (tzHH * 60 + tzMM);
        break;
      }
    }
  }

  if (pmSet && hour < 12) hour += 12;
  else if (amSet && hour === 12) hour = 0;

  const daysInMon = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  if (day < 1 || day > daysInMon[month]) {
    return {
      ok: false,
      err: new Err("time out of range").addCause(
        `parsing time "${value}": day out of range`,
      ),
    };
  }

  if (zoneOffMin !== null) {
    return {
      ok: true,
      val: new Date(
        Date.UTC(year, month, day, hour, min, sec, ms) - zoneOffMin * 60000,
      ),
    };
  }
  return {
    ok: true,
    val: new Date(year, month, day, hour, min, sec, ms),
  };
}

// ─── public API ──────────────────────────────────────────────────────────────

function resolveLayout(name: string): string {
  return (LAYOUTS as Record<string, string>)[name] ?? name;
}

/** The FormatOptions type. */
export type FormatOptions = {
  date: Date | string;
  in: LayoutName;
  out: LayoutName | string;
};

function isFormatOptions(v: unknown): v is FormatOptions {
  return typeof v === "object" && v !== null && "in" in v && "out" in v;
}

/**
 * Public surface of {@link dateUtils}. Declared explicitly so the symbol has a
 * non-inferred type (required for JSR / fast type-checking).
 */
export interface DateUtils {
  format(
    dateOrOpts: Date | string | FormatOptions,
    layout?: string,
  ): Result<string, DateLayoutError>;
  parse(
    value: string,
    layout: LayoutName | (string & Record<never, never>),
  ): Result<Date, DateLayoutError>;
}

/** Date Utils. */
export const dateUtils: DateUtils = {
  /**
   * Formats a date using the specified layout.
   *
   * @param dateOrOpts the date to format, can be a {@link Date} object, a string, or a {@link FormatOptions} object
   * @param layout the layout to use for formatting, uses a {@link LayoutName} or custom layout string
   * @returns a formatted string
   */
  format(
    dateOrOpts: Date | string | FormatOptions,
    layout?: string,
  ): Result<string, DateLayoutError> {
    if (isFormatOptions(dateOrOpts)) {
      const inLayout = resolveLayout(dateOrOpts.in);
      const outLayout = resolveLayout(dateOrOpts.out);

      const date =
        typeof dateOrOpts.date === "string"
          ? parseWithLayout(dateOrOpts.date, inLayout)
          : ({ ok: true, val: dateOrOpts.date } satisfies OkResult<Date>);
      if (!date.ok) return { ok: false, err: date.err };
      return {
        ok: true,
        val: formatWithLayout(date.val, outLayout),
      } satisfies Result<string>;
    }
    const date = dateOrOpts instanceof Date ? dateOrOpts : new Date(dateOrOpts);
    return {
      ok: true,
      val: formatWithLayout(date, layout ?? DateOnly),
    } satisfies Result<string>;
  },
  /**
   *
   * @param value takes a string value to parse
   * @param layout the layout to use for parsing, uses a {@link LayoutName} or custom layout string
   * @returns a parsed {@link Date} object
   */
  parse(
    value: string,
    layout: LayoutName | (string & Record<never, never>),
  ): Result<Date, DateLayoutError> {
    return parseWithLayout(value, resolveLayout(layout));
  },
};
