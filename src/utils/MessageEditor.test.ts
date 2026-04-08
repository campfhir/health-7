import { test, expect, describe } from "vitest";
import { MessageEditor } from "./MessageEditor";
import { CustomSegment } from "./CustomSegment";

// Minimal encodable stub — returns a fixed HL7 string
function makeMessage(raw: string) {
  return { encode: () => raw };
}

const BASE = [
  "MSH|^~\\&|LAB|HOSP|EMR|CLINIC|20250101||ORU^R01|MSG001|P|2.5.1",
  "PID|1||12345^^^MRN^MR||Doe^John",
  "OBR|1|ORD001|LAB001|CBC^Complete Blood Count^LN",
  "OBX|1|NM|718-7^Hemoglobin^LN||15.5|g/dL",
  "OBX|2|NM|4544-3^Hematocrit^LN||45.0|%",
  "OBR|2|ORD002|LAB002|BMP^Basic Metabolic Panel^LN",
  "OBX|3|NM|2345-7^Glucose^LN||95|mg/dL",
].join("\r");

function lines(encoded: string) {
  return encoded.split("\r");
}

describe("MessageEditor.append", () => {
  test("appends segment at end of message", () => {
    const zseg = new CustomSegment("ZMH").setField(1, "end-data");
    const result = lines(new MessageEditor(makeMessage(BASE)).append(zseg).encode());
    expect(result[result.length - 1]).toBe("ZMH|end-data");
  });

  test("appends multiple segments in order", () => {
    const z1 = new CustomSegment("ZA1").setField(1, "first");
    const z2 = new CustomSegment("ZA2").setField(1, "second");
    const result = lines(
      new MessageEditor(makeMessage(BASE)).append(z1).append(z2).encode(),
    );
    expect(result[result.length - 2]).toBe("ZA1|first");
    expect(result[result.length - 1]).toBe("ZA2|second");
  });
});

describe("MessageEditor.insert.after", () => {
  test("inserts after last occurrence by default", () => {
    const zpd = new CustomSegment("ZPD").setField(1, "patient-data");
    const result = lines(
      new MessageEditor(makeMessage(BASE))
        .insert(zpd).after("PID").commit()
        .encode(),
    );
    const pidIdx = result.findIndex((l) => l.startsWith("PID|"));
    expect(result[pidIdx + 1]).toBe("ZPD|patient-data");
  });

  test("inserts after last occurrence explicitly", () => {
    const zob = new CustomSegment("ZOB").setField(1, "obs-data");
    // Last OBX is OBX|3 at index 6 in BASE — should insert after it
    const result = lines(
      new MessageEditor(makeMessage(BASE))
        .insert(zob).after("OBX").last().commit()
        .encode(),
    );
    const obxIndices = result
      .map((l, i) => (l.startsWith("OBX|") ? i : -1))
      .filter((i) => i !== -1);
    const lastObx = obxIndices[obxIndices.length - 1];
    expect(result[lastObx + 1]).toBe("ZOB|obs-data");
  });

  test("inserts after each occurrence", () => {
    const zob = new CustomSegment("ZOB").setField(1, "x");
    const result = lines(
      new MessageEditor(makeMessage(BASE))
        .insert(zob).after("OBX").each().commit()
        .encode(),
    );
    // There are 3 OBX segments — each should be followed by ZOB
    const obxIndices = result
      .map((l, i) => (l.startsWith("OBX|") ? i : -1))
      .filter((i) => i !== -1);
    expect(obxIndices.length).toBe(3);
    for (const idx of obxIndices) {
      expect(result[idx + 1]).toBe("ZOB|x");
    }
  });

  test("inserts after nth occurrence", () => {
    const zob = new CustomSegment("ZOB").setField(1, "second");
    const result = lines(
      new MessageEditor(makeMessage(BASE))
        .insert(zob).after("OBX").nth(2).commit()
        .encode(),
    );
    const obxIndices = result
      .map((l, i) => (l.startsWith("OBX|") ? i : -1))
      .filter((i) => i !== -1);
    // ZOB should appear after the 2nd OBX only
    expect(result[obxIndices[1] + 1]).toBe("ZOB|second");
    expect(result[obxIndices[0] + 1]).not.toBe("ZOB|second");
    expect(result[obxIndices[2] + 1]).not.toBe("ZOB|second");
  });

  test("does nothing when target segment not found", () => {
    const zseg = new CustomSegment("ZXX").setField(1, "data");
    const result = new MessageEditor(makeMessage(BASE))
      .insert(zseg).after("NK1").commit()
      .encode();
    expect(result).toBe(BASE);
  });

  test("nth beyond count does nothing", () => {
    const zseg = new CustomSegment("ZXX").setField(1, "data");
    const result = new MessageEditor(makeMessage(BASE))
      .insert(zseg).after("PID").nth(99).commit()
      .encode();
    expect(result).toBe(BASE);
  });
});

describe("MessageEditor.insert.before", () => {
  test("inserts before last occurrence by default", () => {
    const zob = new CustomSegment("ZOB").setField(1, "before-last-obr");
    const result = lines(
      new MessageEditor(makeMessage(BASE))
        .insert(zob).before("OBR").commit()
        .encode(),
    );
    const obrIndices = result
      .map((l, i) => (l.startsWith("OBR|") ? i : -1))
      .filter((i) => i !== -1);
    const lastObr = obrIndices[obrIndices.length - 1];
    expect(result[lastObr - 1]).toBe("ZOB|before-last-obr");
  });

  test("inserts before each occurrence", () => {
    const zob = new CustomSegment("ZOB").setField(1, "x");
    const result = lines(
      new MessageEditor(makeMessage(BASE))
        .insert(zob).before("OBR").each().commit()
        .encode(),
    );
    const obrIndices = result
      .map((l, i) => (l.startsWith("OBR|") ? i : -1))
      .filter((i) => i !== -1);
    expect(obrIndices.length).toBe(2);
    for (const idx of obrIndices) {
      expect(result[idx - 1]).toBe("ZOB|x");
    }
  });

  test("inserts before nth occurrence", () => {
    const zob = new CustomSegment("ZOB").setField(1, "before-second-obr");
    const result = lines(
      new MessageEditor(makeMessage(BASE))
        .insert(zob).before("OBR").nth(2).commit()
        .encode(),
    );
    const obrIndices = result
      .map((l, i) => (l.startsWith("OBR|") ? i : -1))
      .filter((i) => i !== -1);
    expect(result[obrIndices[1] - 1]).toBe("ZOB|before-second-obr");
    expect(result[obrIndices[0] - 1]).not.toBe("ZOB|before-second-obr");
  });
});

describe("MessageEditor chaining", () => {
  test("multiple insertions applied in order", () => {
    const zpd = new CustomSegment("ZPD").setField(1, "patient");
    const zmh = new CustomSegment("ZMH").setField(1, "message");
    const result = lines(
      new MessageEditor(makeMessage(BASE))
        .insert(zpd).after("PID").commit()
        .append(zmh)
        .encode(),
    );
    const pidIdx = result.findIndex((l) => l.startsWith("PID|"));
    expect(result[pidIdx + 1]).toBe("ZPD|patient");
    expect(result[result.length - 1]).toBe("ZMH|message");
  });

  test("each insertions do not corrupt indices of subsequent insertions", () => {
    const zob = new CustomSegment("ZOB").setField(1, "obs");
    const zmh = new CustomSegment("ZMH").setField(1, "end");
    const result = lines(
      new MessageEditor(makeMessage(BASE))
        .insert(zob).after("OBX").each().commit()
        .append(zmh)
        .encode(),
    );
    expect(result[result.length - 1]).toBe("ZMH|end");
    // All 3 OBX segments still followed by ZOB
    const obxIndices = result
      .map((l, i) => (l.startsWith("OBX|") ? i : -1))
      .filter((i) => i !== -1);
    for (const idx of obxIndices) {
      expect(result[idx + 1]).toBe("ZOB|obs");
    }
  });
});
