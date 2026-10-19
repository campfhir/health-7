// Behaviour of the order detail / billing segments that the generated
// field-position tests don't cover: date handling and the composite BLG fields.
import { describe, test, expect } from "vitest";
import { BLG } from "./BLG.ts";
import { RQD } from "./RQD.ts";
import { ODS } from "./ODS.ts";
import { ODT } from "./ODT.ts";

const field = (seg: { encode(): string }, n: number) => seg.encode().split("|")[n];

describe("BLG", () => {
  test("BLG-1 is code ^ timestamp; a Date is formatted as an HL7 timestamp", () => {
    const withDate = new BLG().whenToCharge({ whenToChargeCode: "T", dateTime: new Date(2024, 0, 2, 3, 4, 5) });
    expect(field(withDate, 1)).toBe("T^20240102030405");
    expect(field(new BLG().whenToCharge({ whenToChargeCode: "T", dateTime: "20240102" }), 1)).toBe("T^20240102");
    expect(field(new BLG().whenToCharge({ whenToChargeCode: "O" }), 1)).toBe("O");
  });

  test("BLG-3 is a CK: id ^ check digit ^ scheme ^ assigning authority", () => {
    const blg = new BLG().accountId({ idNumber: "123", checkDigit: "7", checkDigitScheme: "M10", assigningAuthority: "HOSP" });
    expect(field(blg, 3)).toBe("123^7^M10^HOSP");
  });

  test("fields keep their positions when earlier fields are unset", () => {
    expect(new BLG().accountId({ idNumber: "123" }).encode()).toBe("BLG|||123");
  });
});

describe("RQD", () => {
  test("RQD-10 Date Needed accepts a Date (DT) or a string", () => {
    expect(field(new RQD().dateNeeded(new Date(2024, 4, 6)), 10)).toBe("20240506");
    expect(field(new RQD().dateNeeded("20240506"), 10)).toBe("20240506");
  });

  test("CE fields carry all six components", () => {
    const rqd = new RQD().itemCodeInternal({
      identifier: "A", text: "B", nameOfCodingSystem: "C",
      alternateIdentifier: "D", alternateText: "E", nameOfAlternateCodingSystem: "F",
    });
    expect(field(rqd, 2)).toBe("A^B^C^D^E^F");
  });
});

describe("ODS / ODT", () => {
  test("ODS CE fields keep interior gaps", () => {
    expect(field(new ODS().servicePeriod({ identifier: "SP", alternateIdentifier: "ALT" }), 2)).toBe("SP^^^ALT");
  });

  test("ODT-3 Text Instruction", () => {
    expect(new ODT().textInstruction("no salt").encode()).toBe("ODT|||no salt");
  });
});
