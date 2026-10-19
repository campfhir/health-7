import { test, expect, describe } from "vitest";
import { QRD } from "./QRD.ts";
import { DEFAULT_ENCODING } from "../../types/encoding.ts";

describe("QRD field positions", () => {
  test("QRD-1 Query Date/Time", () => {
    expect(new QRD().queryDateTime("20250101120000").encode().split("|")[1]).toBe("20250101120000");
  });

  test("QRD-2 Query Format Code", () => {
    expect(new QRD().queryFormatCode("R").encode().split("|")[2]).toBe("R");
  });

  test("QRD-3 Query Priority", () => {
    expect(new QRD().queryPriority("I").encode().split("|")[3]).toBe("I");
  });

  test("QRD-4 Query ID", () => {
    expect(new QRD().queryId("Q1").encode().split("|")[4]).toBe("Q1");
  });

  test("QRD-5 Deferred Response Type", () => {
    expect(new QRD().deferredResponseType("B").encode().split("|")[5]).toBe("B");
  });

  test("QRD-6 Deferred Response Date/Time", () => {
    expect(new QRD().deferredResponseDateTime("20250102120000").encode().split("|")[6]).toBe("20250102120000");
  });

  test("QRD-7 Quantity Limited Request", () => {
    expect(new QRD().quantityLimitedRequest({ quantity: "100", units: "RD" }).encode().split("|")[7]).toBe("100^RD");
  });

  test("QRD-8 Who Subject Filter repeats", () => {
    const parts = new QRD()
      .whoSubjectFilter(
{ id: "DOC1", familyName: "Smith", givenName: "John" },
        { id: "DOC2" }
      )
      .encode()
      .split("|");
    expect(parts[8]).toBe("DOC1^Smith^John~DOC2");
  });

  test("QRD-9 What Subject Filter repeats", () => {
    const parts = new QRD()
      .whatSubjectFilter({ code: "C1", text: "T1", codingSystem: "S1" }, { code: "C2" })
      .encode()
      .split("|");
    expect(parts[9]).toBe("C1^T1^S1~C2");
  });

  test("QRD-10 What Department Data Code repeats", () => {
    const parts = new QRD()
      .whatDepartmentDataCode({ code: "D1", text: "DT", codingSystem: "DS" })
      .encode()
      .split("|");
    expect(parts[10]).toBe("D1^DT^DS");
  });

  test("QRD-11 What Data Code Value Qualifier repeats", () => {
    expect(new QRD().whatDataCodeValueQualifier("A", "B").encode().split("|")[11]).toBe("A~B");
  });

  test("QRD-12 Query Results Level", () => {
    expect(new QRD().queryResultsLevel("T").encode().split("|")[12]).toBe("T");
  });
});

describe("QRD parse/encode", () => {
  test("round-trips a query definition", () => {
    const input = "QRD|20250101120000|R|I|Q1|||100^RD|DOC1^Smith^John|CODE1^Text^SYS|||";
    const result = QRD.parse(input, DEFAULT_ENCODING);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.val.encode()).toBe(input);
  });

  test("rejects a segment that is not QRD", () => {
    expect(QRD.parse("QRF|W1", DEFAULT_ENCODING).ok).toBe(false);
  });
});
