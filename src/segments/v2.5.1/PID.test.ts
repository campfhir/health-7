import { test, expect, describe } from "vitest";
import { PID } from "./PID";
import { ParserUtils } from "../../types/parser";
import { DEFAULT_ENCODING } from "../../types/encoding";
import { DateTimeLayout, DateLayout } from "../../utils/hl7DateUtils";

test("PID builder creates valid segment", () => {
  const pid = new PID()
    .setId("1")
    .patientIdentifierList("12345", "", "", "MRN", "MR")
    .patientName("Doe", "John")
    .dateTimeOfBirth("19800115")
    .administrativeSex("M");
  expect(pid.name).toBe("PID");
  expect(pid.fields.length > 0).toBeTruthy();
});

test("PID encodes patient name correctly", () => {
  const pid = new PID().patientName("Smith", "Jane", "Marie", "Jr", "Dr");
  const encoded = pid.encode();
  expect(encoded.includes("Smith^Jane^Marie^Jr^Dr")).toBeTruthy();
});

test("PID encodes patient name with minimal fields", () => {
  const pid = new PID().patientName("Doe");
  const encoded = pid.encode();
  expect(encoded.includes("Doe")).toBeTruthy();
});

test("PID encodes patient identifier list", () => {
  const pid = new PID().patientIdentifierList("12345", "1", "M10", "MRN", "MR");
  const encoded = pid.encode();
  expect(encoded.includes("12345^1^M10^MRN^MR")).toBeTruthy();
});

test("PID encodes address correctly", () => {
  const pid = new PID().patientAddress(
    "123 Main St",
    "Apt 4",
    "Springfield",
    "IL",
    "62701",
    "USA",
  );
  const encoded = pid.encode();
  expect(
    encoded.includes("123 Main St^Apt 4^Springfield^IL^62701^USA"),
  ).toBeTruthy();
});

test("PID encodes sex and DOB", () => {
  const pid = new PID().dateTimeOfBirth("19800115").administrativeSex("F");
  const encoded = pid.encode();
  expect(encoded.includes("19800115")).toBeTruthy();
  expect(encoded.includes("F")).toBeTruthy();
});

test("PID encodes phone numbers", () => {
  const pid = new PID()
    .phoneNumberHome("555-1234")
    .phoneNumberBusiness("555-5678");
  const encoded = pid.encode();
  expect(encoded.includes("555-1234")).toBeTruthy();
  expect(encoded.includes("555-5678")).toBeTruthy();
});

test("PID encodes mothers maiden name", () => {
  const pid = new PID().mothersMaidenName("Johnson", "Mary");
  const encoded = pid.encode();
  expect(encoded.includes("Johnson^Mary")).toBeTruthy();
});

test("PID builder fluent interface", () => {
  const result = new PID()
    .setId("1")
    .patientName("Doe", "John")
    .administrativeSex("M");

  expect(result).toBeTruthy();
  expect(result.name).toBe("PID");
  expect(result.fields.length >= 0).toBeTruthy();
});

test("PID with SSN", () => {
  const pid = new PID().ssn("123-45-6789");
  const encoded = pid.encode();
  expect(encoded.includes("123-45-6789")).toBeTruthy();
});

test("PID with race and religion", () => {
  const pid = new PID().race("2106-3").religion("CHR");
  const encoded = pid.encode();
  expect(encoded.includes("2106-3")).toBeTruthy();
  expect(encoded.includes("CHR")).toBeTruthy();
});

test("PID with marital status and language", () => {
  const pid = new PID().maritalStatus("M").primaryLanguage("en");
  const encoded = pid.encode();
  expect(encoded.includes("M")).toBeTruthy();
  expect(encoded.includes("en")).toBeTruthy();
});

// ---------------------------------------------------------------------------
// PID.parse
// ---------------------------------------------------------------------------

test("PID.parse parses valid PID segment", () => {
  const pidString = "PID|1||12345^^^MRN^MR||Doe^John^Q||19800115|M";

  const result = PID.parse(pidString, DEFAULT_ENCODING);

  expect(result.ok).toBe(true);
  expect(result.val).toBeTruthy();
  expect(result.val!.name).toBe("PID");
});

test("PID.parse extracts patient name", () => {
  const pidString = "PID|1||12345||Smith^Jane^Marie^Jr^Dr||19900101|F";

  const result = PID.parse(pidString, DEFAULT_ENCODING);

  expect(result.val).toBeTruthy();
  const familyName = ParserUtils.getComponent(result.val!.fields[4], 0);
  const givenName = ParserUtils.getComponent(result.val!.fields[4], 1);
  const middleName = ParserUtils.getComponent(result.val!.fields[4], 2);
  const suffix = ParserUtils.getComponent(result.val!.fields[4], 3);
  const prefix = ParserUtils.getComponent(result.val!.fields[4], 4);

  expect(familyName).toBe("Smith");
  expect(givenName).toBe("Jane");
  expect(middleName).toBe("Marie");
  expect(suffix).toBe("Jr");
  expect(prefix).toBe("Dr");
});

test("PID.parse extracts patient identifier", () => {
  const pidString = "PID|1||12345^1^M10^MRN^MR||Doe^John||19800115|M";

  const result = PID.parse(pidString, DEFAULT_ENCODING);

  expect(result.val).toBeTruthy();
  const id = ParserUtils.getComponent(result.val!.fields[2], 0);
  const checkDigit = ParserUtils.getComponent(result.val!.fields[2], 1);
  const idType = ParserUtils.getComponent(result.val!.fields[2], 4);

  expect(id).toBe("12345");
  expect(checkDigit).toBe("1");
  expect(idType).toBe("MR");
});

test("PID.parse extracts date of birth and sex", () => {
  const pidString = "PID|1||12345||Doe^John||19800115|M";

  const result = PID.parse(pidString, DEFAULT_ENCODING);

  expect(result.val).toBeTruthy();
  const dob = ParserUtils.getComponent(result.val!.fields[6], 0);
  const sex = ParserUtils.getComponent(result.val!.fields[7], 0);

  expect(dob).toBe("19800115");
  expect(sex).toBe("M");
});

test("PID.parse extracts address", () => {
  const pidString =
    "PID|1||12345||Doe^John||19800115|M|||123 Main St^Apt 4^Springfield^IL^62701^USA";

  const result = PID.parse(pidString, DEFAULT_ENCODING);

  expect(result.val).toBeTruthy();
  const street = ParserUtils.getComponent(result.val!.fields[10], 0);
  const other = ParserUtils.getComponent(result.val!.fields[10], 1);
  const city = ParserUtils.getComponent(result.val!.fields[10], 2);
  const state = ParserUtils.getComponent(result.val!.fields[10], 3);
  const zip = ParserUtils.getComponent(result.val!.fields[10], 4);
  const country = ParserUtils.getComponent(result.val!.fields[10], 5);

  expect(street).toBe("123 Main St");
  expect(other).toBe("Apt 4");
  expect(city).toBe("Springfield");
  expect(state).toBe("IL");
  expect(zip).toBe("62701");
  expect(country).toBe("USA");
});

test("PID.parse fails on non-PID segment", () => {
  const mshString = "MSH|^~\\&|LAB";

  const result = PID.parse(mshString, DEFAULT_ENCODING);

  expect(result.ok).toBe(false);
  expect(result.err!.message).toBeTruthy();
  expect(result.err!.message.includes("PID")).toBeTruthy();
});

test("PID.parse round-trip consistency", () => {
  const original =
    "PID|1||12345^^^MRN^MR||Doe^John^Q||19800115|M|||123 Main St^^Springfield^IL^62701^USA||555-1234";

  const parseResult = PID.parse(original, DEFAULT_ENCODING);
  expect(parseResult.val).toBeTruthy();

  const reEncoded = parseResult.val!.encode();
  expect(reEncoded).toBe(original);
});

test("PID.parse handles empty fields", () => {
  const pidString = "PID|1||||Doe^John||19800115|M";

  const result = PID.parse(pidString, DEFAULT_ENCODING);

  expect(result.val).toBeTruthy();
  const patientId = ParserUtils.getComponent(result.val!.fields[1], 0);
  const altId = ParserUtils.getComponent(result.val!.fields[3], 0);

  expect(patientId).toBe("");
  expect(altId).toBe("");
});

test("PID.parse extracts phone numbers", () => {
  const pidString =
    "PID|1||12345||Doe^John||19800115|M|||||||555-1234|555-5678";

  const result = PID.parse(pidString, DEFAULT_ENCODING);

  expect(result.val).toBeTruthy();
  const homePhone = ParserUtils.getComponent(result.val!.fields[14], 0);
  const workPhone = ParserUtils.getComponent(result.val!.fields[15], 0);

  expect(homePhone).toBe("555-1234");
  expect(workPhone).toBe("555-5678");
});

// ─── dateTimeOfBirth with Date object ────────────────────────────────────────

describe("PID.dateTimeOfBirth: Date input", () => {
  const dob = new Date(1980, 0, 15); // Jan 15 1980 local

  test("Date formats as YYYYMMDD by default", () => {
    const pid = new PID().dateTimeOfBirth(dob);
    expect(pid.encode()).toContain("19800115");
  });

  test("Date with explicit HL7Date layout", () => {
    const pid = new PID().dateTimeOfBirth(dob, DateLayout);
    expect(pid.encode()).toContain("19800115");
  });

  test("Date with HL7LayoutDate alias", () => {
    const pid = new PID().dateTimeOfBirth(dob, "Date");
    expect(pid.encode()).toContain("19800115");
  });

  test("Date with HL7DateTime layout includes time", () => {
    const dobWithTime = new Date(1980, 0, 15, 9, 5, 3);
    const pid = new PID().dateTimeOfBirth(dobWithTime, DateTimeLayout);
    expect(pid.encode()).toContain("19800115090503");
  });

  test("string still passes through unchanged", () => {
    const pid = new PID().dateTimeOfBirth("19800115");
    expect(pid.encode()).toContain("19800115");
  });
});
