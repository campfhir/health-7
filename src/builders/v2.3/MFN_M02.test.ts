import { describe, test, expect } from "vitest";
import { createMFN_M02, MFN_M02 } from "./MFN_M02.ts";
import { MSH } from "../../segments/v2.5.1/MSH.ts";
import { MFI } from "../../segments/v2.3/MFI.ts";
import { MFE } from "../../segments/v2.3/MFE.ts";
import { STF } from "../../segments/v2.3/STF.ts";
import { PRA } from "../../segments/v2.3/PRA.ts";
import { parseMFN_M02 } from "../../parsers/v2.3/MFN_M02_Parser.ts";

function buildBasicMessage() {
  const msh = new MSH()
    .sendingApplication("LAB")
    .messageType("MFN", "M02")
    .messageControlId("MSG001")
    .processingId("P")
    .versionId("2.3");

  const mfi = new MFI()
    .masterFileIdentifier("STF", "Staff Master File")
    .fileLevelEventCode("UPD")
    .responseLevelCode("NE");

  const mfe = new MFE()
    .recordLevelEventCode("MAD")
    .mfnControlId("CTL001")
    .primaryKeyValue("DOC001");

  const stf = new STF()
    .primaryKeyValue("DOC001")
    .staffName("Smith", "John", "A")
    .staffType("MD")
    .administrativeSex("M")
    .activeInactiveFlag("A");

  return { msh, mfi, mfe, stf };
}

describe("MFN_M02 builder", () => {
  test("createMFN_M02 returns MFN_M02 instance", () => {
    const { msh, mfi, mfe, stf } = buildBasicMessage();
    const message = createMFN_M02(msh, mfi, [{ mfe, stf }]);

    expect(message instanceof MFN_M02).toBeTruthy();
  });

  test("verify() detects missing MSH", () => {
    const { mfi, mfe, stf } = buildBasicMessage();
    const message = new MFN_M02(null as any, mfi, [{ mfe, stf }]);

    const result = message.verify();
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("MSH segment is required"))).toBe(true);
  });

  test("verify() detects missing MFI", () => {
    const { msh, mfe, stf } = buildBasicMessage();
    const message = new MFN_M02(msh, null as any, [{ mfe, stf }]);

    const result = message.verify();
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("MFI segment is required"))).toBe(true);
  });

  test("verify() detects empty staff entries", () => {
    const { msh, mfi } = buildBasicMessage();
    const message = new MFN_M02(msh, mfi, []);

    const result = message.verify();
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("At least one staff entry"))).toBe(true);
  });

  test("encode() produces parseable MFN_M02 message", () => {
    const { msh, mfi, mfe, stf } = buildBasicMessage();
    const message = createMFN_M02(msh, mfi, [{ mfe, stf }]);

    const encoded = message.encode();
    const parsed = parseMFN_M02(encoded);

    expect(parsed.ok).toBe(true);
    expect(parsed.val?.staffEntries.length).toBe(1);
    expect(parsed.val?.staffEntries[0].stf.getStaffName().familyName).toBe("Smith");
  });

  test("encode() includes PRA when present", () => {
    const { msh, mfi, mfe, stf } = buildBasicMessage();

    const pra = new PRA()
      .primaryKeyValue("DOC001")
      .practitionerCategory("OP");

    const message = createMFN_M02(msh, mfi, [{ mfe, stf, pra }]);
    const encoded = message.encode();
    const parsed = parseMFN_M02(encoded);

    expect(parsed.ok).toBe(true);
    expect(parsed.val?.staffEntries[0].pra).toBeDefined();
    expect(parsed.val?.staffEntries[0].pra?.getPractitionerCategory()).toBe("OP");
  });

  test("encode() handles multiple staff entries", () => {
    const { msh, mfi } = buildBasicMessage();

    const entries = ["DOC001", "DOC002", "DOC003"].map((id, i) => ({
      mfe: new MFE().recordLevelEventCode("MAD").mfnControlId(`CTL00${i + 1}`).primaryKeyValue(id),
      stf: new STF().primaryKeyValue(id).staffName(`Doctor${i + 1}`).activeInactiveFlag("A"),
    }));

    const message = createMFN_M02(msh, mfi, entries);
    const encoded = message.encode();
    const parsed = parseMFN_M02(encoded);

    expect(parsed.ok).toBe(true);
    expect(parsed.val?.staffEntries.length).toBe(3);
  });

  test("encode() round-trips through parse", () => {
    const { msh, mfi, mfe, stf } = buildBasicMessage();
    const message = createMFN_M02(msh, mfi, [{ mfe, stf }]);
    const encoded = message.encode();

    const parsed = parseMFN_M02(encoded);
    expect(parsed.ok).toBe(true);

    // Re-encode from parsed data
    const rebuilt = createMFN_M02(
      parsed.val!.msh,
      parsed.val!.mfi,
      parsed.val!.staffEntries,
    );
    const reencoded = rebuilt.encode();

    expect(reencoded).toBe(encoded);
  });
});
