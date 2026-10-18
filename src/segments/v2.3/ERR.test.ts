// ERR in HL7 v2.3 has one field: ERR-1 Error Code and Location (ELD/CM, required, repeating).
import { describe, test, expect } from "vitest";
import { ERR } from "./ERR.ts";
import { DEFAULT_ENCODING } from "../../types/encoding.ts";

const encodeFields = (seg: ERR) => seg.encode().split("|").slice(1);

describe("ERR (v2.3)", () => {
  test("has only the ERR-1 setter (ERR-2..12 arrived in v2.5)", () => {
    const seg = new ERR() as unknown as Record<string, unknown>;
    for (const later of ["errorLocation", "hl7ErrorCode", "severity", "applicationErrorCode", "applicationErrorParameter", "diagnosticInfo", "userMessage", "informPersonIndicator"]) {
      expect(seg[later]).toBeUndefined();
    }
  });

  test("ERR-1 is segment ID ^ sequence ^ field position ^ code identifying error", () => {
    const err = new ERR().errorCodeAndLocation({
      segmentId: "PID",
      sequence: "1",
      fieldPosition: "5",
      codeIdentifyingError: { identifier: "101", text: "Required field missing", nameOfCodingSystem: "HL70357" },
    });
    expect(encodeFields(err)).toEqual(["PID^1^5^101&Required field missing&HL70357"]);
  });

  test("keeps interior gaps and trims trailing empty components", () => {
    expect(encodeFields(new ERR().errorCodeAndLocation({ segmentId: "PID" }))).toEqual(["PID"]);
    expect(encodeFields(new ERR().errorCodeAndLocation({ segmentId: "PID", fieldPosition: "5" }))).toEqual(["PID^^5"]);
    expect(
      encodeFields(new ERR().errorCodeAndLocation({ segmentId: "PID", codeIdentifyingError: { identifier: "101" } })),
    ).toEqual(["PID^^^101"]);
  });

  test("the code identifying error (CE) keeps its own interior gaps", () => {
    const err = new ERR().errorCodeAndLocation({
      segmentId: "PID",
      codeIdentifyingError: { identifier: "101", alternateIdentifier: "X" },
    });
    expect(encodeFields(err)).toEqual(["PID^^^101&&&X"]);
  });

  test("ERR-1 repeats: one argument per repetition, joined by the repetition separator", () => {
    const err = new ERR().errorCodeAndLocation(
      { segmentId: "PID", sequence: "1", fieldPosition: "5", codeIdentifyingError: { identifier: "101" } },
      { segmentId: "PV1", sequence: "1", fieldPosition: "2", codeIdentifyingError: { identifier: "102" } },
      { segmentId: "OBR" },
    );
    expect(encodeFields(err)).toEqual(["PID^1^5^101~PV1^1^2^102~OBR"]);
  });

  test("a string argument is used as raw field text, alone or as a repetition", () => {
    expect(encodeFields(new ERR().errorCodeAndLocation("PID^1^5^101"))).toEqual(["PID^1^5^101"]);
    expect(encodeFields(new ERR().errorCodeAndLocation("101", { segmentId: "PID" }))).toEqual(["101~PID"]);
  });

  test("honours custom encoding characters", () => {
    const err = new ERR().errorCodeAndLocation({ segmentId: "A", sequence: "1" }, { segmentId: "B" });
    const custom = { ...DEFAULT_ENCODING, fieldSeparator: "#", componentSeparator: "$", repetitionSeparator: "%" };
    expect(err.encode(custom)).toBe("ERR#A$1%B");
  });

  test("no arguments leaves an empty field", () => {
    expect(new ERR().errorCodeAndLocation().encode()).toBe("ERR|");
  });

  test("parse keeps the repeated field's text so it round-trips", () => {
    const wire = "ERR|PID^1^5^101&Required~PV1^1^2^102";
    const result = ERR.parse(wire, DEFAULT_ENCODING);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.val.encode()).toBe(wire);
  });

  test("parse rejects other segments", () => {
    expect(ERR.parse("MSA|AA", DEFAULT_ENCODING).ok).toBe(false);
  });
});
