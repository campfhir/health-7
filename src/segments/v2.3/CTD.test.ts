// Position and composite tests for CTD (HL7 v2.3, 7 fields).
import { describe, test, expect } from "vitest";
import { CTD } from "./CTD.ts";

const at = (seg: CTD, n: number) => seg.encode().split("|")[n];

describe("CTD", () => {
  const cases: [number, (s: CTD) => CTD, string][] = [
    [1, (s) => s.contactRole({ identifier: "EP", text: "Employer" }), "EP^Employer"],
    [2, (s) => s.contactName({ familyName: "Doe", givenName: "Jane" }, { familyName: "Roe" }), "Doe^Jane~Roe"],
    [3, (s) => s.contactAddress({ streetAddress: "1 Main St", city: "Springfield", stateOrProvince: "IL", zipOrPostalCode: "62701" }), "1 Main St^^Springfield^IL^62701"],
    [4, (s) => s.contactLocation({ pointOfCare: "ER", room: "1" }), "ER^1"],
    [5, (s) => s.contactCommunicationInformation({ telephoneNumber: "555-1212", telecommunicationUseCode: "WPN" }, "raw"), "555-1212^WPN~raw"],
    [6, (s) => s.preferredMethodOfContact({ identifier: "E" }), "E"],
    [7, (s) => s.contactIdentifiers({ idNumber: "123", typeOfIdNumber: "SS" }, { idNumber: "456" }), "123^SS~456"],
  ];

  test.each(cases)("CTD-%i", (n, set, expected) => {
    const parts = set(new CTD()).encode().split("|");
    expect(parts[n]).toBe(expected);
    expect(parts.filter((p, i) => i !== 0 && i !== n && p !== "")).toEqual([]);
  });

  test("covers every field of the segment", () => {
    expect(cases.map(([n]) => n)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test("XAD: ten components", () => {
    const ctd = new CTD().contactAddress({
      streetAddress: "1", otherDesignation: "2", city: "3", stateOrProvince: "4", zipOrPostalCode: "5",
      country: "6", addressType: "7", otherGeographicDesignation: "8", countyParishCode: "9", censusTract: "10",
    });
    expect(at(ctd, 3)).toBe("1^2^3^4^5^6^7^8^9^10");
  });

  test("XPN: eight components", () => {
    const ctd = new CTD().contactName({
      familyName: "1", givenName: "2", middleInitialOrName: "3", suffix: "4", prefix: "5", degree: "6",
      nameTypeCode: "7", nameRepresentationCode: "8",
    });
    expect(at(ctd, 2)).toBe("1^2^3^4^5^6^7^8");
  });

  test("XTN: nine components", () => {
    const ctd = new CTD().contactCommunicationInformation({
      telephoneNumber: "1", telecommunicationUseCode: "2", telecommunicationEquipmentType: "3", emailAddress: "4",
      countryCode: "5", areaCityCode: "6", phoneNumber: "7", extension: "8", anyText: "9",
    });
    expect(at(ctd, 5)).toBe("1^2^3^4^5^6^7^8^9");
  });

  test("PI: three components", () => {
    expect(at(new CTD().contactIdentifiers({ idNumber: "1", typeOfIdNumber: "2", otherQualifyingInfo: "3" }), 7)).toBe("1^2^3");
  });
});
