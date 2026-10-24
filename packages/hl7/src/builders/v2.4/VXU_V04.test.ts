import { describe, test, expect } from "vitest";
import { VXU_V04, createVXU_V04 } from "./VXU_V04.ts";
import { parseVXU_V04 } from "../../parsers/v2.4/VXU_V04_Parser.ts";
import { MSH } from "../../segments/v2.4/MSH.ts";
import { PID } from "../../segments/v2.4/PID.ts";
import { PV1 } from "../../segments/v2.4/PV1.ts";
import { GT1 } from "../../segments/v2.4/GT1.ts";
import { IN1 } from "../../segments/v2.4/IN1.ts";
import { RXA } from "../../segments/v2.4/RXA.ts";

const makeMSH = () => new MSH().messageType({ messageCode: "VXU", triggerEvent: "V04" }).messageControlId("V1");
const makePID = () => new PID().setId("1");
const makeRXA = (n = "1") => new RXA().giveSubIdCounter("0").administrationSubIdCounter(n).administeredCode({ code: "08", text: "Hep B" });
const names = (wire: string) => wire.split("\r").map((s) => s.slice(0, 3));
const msh = () => makeMSH().encode();

const withGt1 = () => createVXU_V04(makeMSH(), makePID(), {
  visit: { pv1: new PV1().patientClass("O") },
  gt1List: [new GT1().setId("1"), new GT1().setId("2")],
  insurance: [{ in1: new IN1().setId("1") }],
  orders: [{ rxa: makeRXA("1") }],
});

describe("VXU_V04 (v2.4): adds [{GT1}] after the visit group", () => {
  test("extends the v2.3 builder", () => {
    expect(withGt1()).toBeInstanceOf(VXU_V04);
  });

  test("the builder accepts and orders GT1 between the visit and the insurance", () => {
    expect(withGt1().verify().valid).toBe(true);
    expect(names(withGt1().encode())).toEqual(["MSH", "PID", "PV1", "GT1", "GT1", "IN1", "RXA"]);
  });

  test("the ORC is still optional in v2.4", () => {
    expect(createVXU_V04(makeMSH(), makePID(), { orders: [{ rxa: makeRXA() }] }).verify().valid).toBe(true);
    expect(parseVXU_V04([msh(), "PID|1", "RXA|0|1"].join("\r")).ok).toBe(true);
  });

  test("the parser keeps GT1", () => {
    const result = parseVXU_V04(withGt1().encode());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.val.gt1List).toHaveLength(2);
      expect(result.val.gt1List[0]).toBeInstanceOf(GT1);
      expect(result.val.insurance).toHaveLength(1);
      expect(result.val.message.segments).toHaveLength(7);
    }
  });

  test("GT1 before PID is rejected", () => {
    expect(parseVXU_V04([msh(), "GT1|1", "PID|1"].join("\r")).ok).toBe(false);
  });

  test("a full v2.3-shaped message still round-trips", () => {
    const wire = [msh(), "PID|1", "NK1|1", "PV1|1", "IN1|1", "ORC|RE", "RXA|0|1", "RXR|IM", "OBX|1|CE", "NTE|1"].join("\r");
    const result = parseVXU_V04(wire);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.val.message.segments).toHaveLength(10);
  });
});
