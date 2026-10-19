// ORM^O01 in v2.5 is the v2.4 message with IN3 repeating in each insurance group.
import { describe, test, expect } from "vitest";
import { ORM_O01, createORM_O01 } from "./ORM_O01.ts";
import { ORM_O01 as ORM_O01_v24 } from "../v2.4/ORM_O01.ts";
import { parseORM_O01 } from "../../parsers/v2.5/ORM_O01_Parser.ts";
import { parseORM_O01 as parseORM_O01_v24 } from "../../parsers/v2.4/ORM_O01_Parser.ts";
import { MSH } from "../../segments/v2.5/MSH.ts";
import { PID } from "../../segments/v2.5/PID.ts";
import { IN1 } from "../../segments/v2.5/IN1.ts";
import { IN3 } from "../../segments/v2.5/IN3.ts";
import { ORC } from "../../segments/v2.5/ORC.ts";

const makeMSH = () => new MSH().messageType({ messageCode: "ORM", triggerEvent: "O01" }).messageControlId("1");
const withIn3s = (n: number) =>
  createORM_O01(makeMSH(), [{ orc: new ORC().orderControl("NW") }], {
    patient: { pid: new PID().setId("1"), insurance: [{ in1: new IN1().setId("1"), in3List: Array.from({ length: n }, () => new IN3()) }] },
  });

describe("ORM_O01 (v2.5)", () => {
  test("extends the v2.4 builder", () => {
    expect(withIn3s(1)).toBeInstanceOf(ORM_O01);
    expect(withIn3s(1)).toBeInstanceOf(ORM_O01_v24);
  });

  test("the builder accepts repeated IN3 and encodes them in order", () => {
    const msg = withIn3s(3);
    expect(msg.verify().valid).toBe(true);
    expect(msg.encode().split("\r").map((s) => s.slice(0, 3))).toEqual(["MSH", "PID", "IN1", "IN3", "IN3", "IN3", "ORC"]);
  });

  test("the parser keeps repeated IN3", () => {
    const result = parseORM_O01(withIn3s(3).encode());
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.val.patient?.insurance[0].in3List).toHaveLength(3);
  });

  test("the v2.4 parser still rejects the same message", () => {
    expect(parseORM_O01_v24(withIn3s(2).encode()).ok).toBe(false);
  });
});
