// ERR in HL7 v2.5 has twelve fields; ERR-1 is retained for backward compatibility.
import { describe, test, expect } from "vitest";
import { ERR } from "./ERR.ts";
import { ERR as ERR_v23 } from "../v2.3/ERR.ts";
import { ERR as ERR_v251 } from "../v2.5.1/ERR.ts";
import { DEFAULT_ENCODING } from "../../types/encoding.ts";

const fieldsOf = (seg: ERR) => seg.encode().split("|");
const field = (seg: ERR, n: number) => fieldsOf(seg)[n];

describe("ERR (v2.5)", () => {
  test("extends the v2.3 segment and keeps ERR-1", () => {
    expect(new ERR()).toBeInstanceOf(ERR_v23);
    expect(field(new ERR().errorCodeAndLocation({ segmentId: "PID", sequence: "1" }), 1)).toBe("PID^1");
  });

  test("ERR-2 Error Location (ERL): six components, repeating", () => {
    const err = new ERR().errorLocation(
      { segmentId: "C1", segmentSequence: "C2", fieldPosition: "C3", fieldRepetition: "C4", componentNumber: "C5", subComponentNumber: "C6" },
      { segmentId: "PV1", fieldPosition: "2" },
    );
    expect(field(err, 2)).toBe("C1^C2^C3^C4^C5^C6~PV1^^2");
  });

  test("ERR-3 HL7 Error Code (CWE): nine components", () => {
    const err = new ERR().hl7ErrorCode({
      code: "C1", text: "C2", codingSystem: "C3", alternateIdentifier: "C4", alternateText: "C5",
      alternateCodingSystem: "C6", codingSystemVersionId: "C7", alternateCodingSystemVersionId: "C8", originalText: "C9",
    });
    expect(field(err, 3)).toBe("C1^C2^C3^C4^C5^C6^C7^C8^C9");
    expect(field(new ERR().hl7ErrorCode({ code: "101" }), 3)).toBe("101");
  });

  test("ERR-4 Severity", () => {
    expect(field(new ERR().severity("E"), 4)).toBe("E");
  });

  test("ERR-5 Application Error Code (CWE)", () => {
    expect(field(new ERR().applicationErrorCode({ code: "A1", text: "app error" }), 5)).toBe("A1^app error");
  });

  test("ERR-6 Application Error Parameter (ST): repeating", () => {
    expect(field(new ERR().applicationErrorParameter("p1", "p2"), 6)).toBe("p1~p2");
  });

  test("ERR-7 Diagnostic Information and ERR-8 User Message", () => {
    const err = new ERR().diagnosticInfo("stack").userMessage("try again");
    expect(field(err, 7)).toBe("stack");
    expect(field(err, 8)).toBe("try again");
  });

  test("ERR-9 Inform Person Indicator (IS): repeating", () => {
    expect(field(new ERR().informPersonIndicator("U", "P"), 9)).toBe("U~P");
  });

  test("ERR-10 Override Type (CWE) and ERR-11 Override Reason Code (CWE, repeating)", () => {
    const err = new ERR()
      .overrideType({ code: "O1", text: "type" })
      .overrideReasonCode({ code: "R1", text: "r one" }, { code: "R2" });
    expect(field(err, 10)).toBe("O1^type");
    expect(field(err, 11)).toBe("R1^r one~R2");
  });

  test("ERR-12 Help Desk Contact Point (XTN): twelve components, repeating", () => {
    const err = new ERR().helpDeskContactPoint(
      {
        telephoneNumber: "C1", telecommunicationUseCode: "C2", telecommunicationEquipmentType: "C3", emailAddress: "C4",
        countryCode: "C5", areaCityCode: "C6", localNumber: "C7", extension: "C8", anyText: "C9",
        extensionPrefix: "C10", speedDialCode: "C11", unformattedTelephoneNumber: "C12",
      },
      { emailAddress: "help@example.org" },
      "raw text",
    );
    expect(field(err, 12)).toBe("C1^C2^C3^C4^C5^C6^C7^C8^C9^C10^C11^C12~^^^help@example.org~raw text");
  });

  test("fields land at their own positions and nowhere else", () => {
    const err = new ERR().severity("E").userMessage("m").overrideType({ code: "O" });
    expect(fieldsOf(err)).toEqual(["ERR", "", "", "", "E", "", "", "", "m", "", "O"]);
  });

  test("parse round-trips a message with repeating fields", () => {
    const wire = "ERR||PID^1^5~PV1^1^2|101^bad^HL70357|E||p1~p2|diag|msg|U~P";
    const result = ERR.parse(wire, DEFAULT_ENCODING);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.val.encode()).toBe(wire);
  });

  test("v2.5.1 inherits all twelve fields from v2.5", () => {
    const err = new ERR_v251().helpDeskContactPoint("555").overrideType({ code: "O" });
    expect(err).toBeInstanceOf(ERR);
    expect(err.encode()).toBe("ERR" + "|".repeat(10) + "O||555");
  });
});
