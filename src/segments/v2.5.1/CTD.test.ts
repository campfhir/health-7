// CTD in HL7 v2.5.1: CTD-1 repeats and CTD-7 is a PLN.
import { describe, test, expect } from "vitest";
import { CTD } from "./CTD.ts";
import { CTD as CTD_v23 } from "../v2.3/CTD.ts";

const at = (seg: CTD, n: number) => seg.encode().split("|")[n];

describe("CTD (v2.5.1)", () => {
  test("extends the v2.3 segment and keeps its setters", () => {
    expect(new CTD()).toBeInstanceOf(CTD_v23);
    expect(at(new CTD().contactName({ familyName: "Doe" }), 2)).toBe("Doe");
  });

  test("CTD-1 Contact Role repeats", () => {
    expect(at(new CTD().contactRole({ identifier: "EP" }, { identifier: "CP", text: "Contact person" }), 1)).toBe("EP~CP^Contact person");
  });

  test("CTD-7 Contact Identifiers is a PLN: four components, repeating", () => {
    const ctd = new CTD().contactIdentifiers(
      { idNumber: "1", typeOfIdNumber: "DL", stateOtherQualifyingInformation: "IL", expirationDate: "20301231" },
      { idNumber: "2" },
    );
    expect(at(ctd, 7)).toBe("1^DL^IL^20301231~2");
  });

  test("CTD-7 still accepts a v2.3 PI-shaped value", () => {
    expect(at(new CTD().contactIdentifiers({ idNumber: "1", typeOfIdNumber: "SS", otherQualifyingInfo: "q" }), 7)).toBe("1^SS^q");
  });
});
