// v2.5.1 parsers for ACK, ORM^O01 and ORR^O02 (structure identical to v2.5; codegen overrides
// each segment parse so results are v2.5.1 segment classes).
import { describe, test, expect } from "vitest";
import { parseACK } from "./ACK_Parser.ts";
import { parseORM_O01 } from "./ORM_O01_Parser.ts";
import { parseORR_O02 } from "./ORR_O02_Parser.ts";
import { createACK } from "../../builders/v2.5.1/ACK.ts";
import { createORM_O01 } from "../../builders/v2.5.1/ORM_O01.ts";
import { createORR_O02 } from "../../builders/v2.5.1/ORR_O02.ts";
import { MSH } from "../../segments/v2.5.1/MSH.ts";
import { MSA } from "../../segments/v2.5.1/MSA.ts";
import { ERR } from "../../segments/v2.5.1/ERR.ts";
import { SFT } from "../../segments/v2.5.1/SFT.ts";
import { PID } from "../../segments/v2.5.1/PID.ts";
import { ORC } from "../../segments/v2.5.1/ORC.ts";
import { OBR } from "../../segments/v2.5.1/OBR.ts";
import { CTD } from "../../segments/v2.5.1/CTD.ts";
import { FT1 } from "../../segments/v2.5.1/FT1.ts";
import { IN1 } from "../../segments/v2.5.1/IN1.ts";
import { IN3 } from "../../segments/v2.5.1/IN3.ts";

const msh = (code: string, event?: string) =>
  new MSH().messageType({ messageCode: code, triggerEvent: event ?? "" }).messageControlId("1");

describe("v2.5.1 ACK", () => {
  test("parses SFT, MSA and repeating ERR into v2.5.1 classes", () => {
    const wire = createACK(msh("ACK"), new MSA().acknowledgmentCode("AE").messageControlId("9"), {
      sftList: [new SFT()],
      errList: [new ERR().helpDeskContactPoint({ telephoneNumber: "555" }), new ERR().overrideType({ code: "O" })],
    }).encode();
    const result = parseACK(wire);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.val.sftList[0]).toBeInstanceOf(SFT);
    expect(result.val.msa).toBeInstanceOf(MSA);
    expect(result.val.errList).toHaveLength(2);
    expect(result.val.errList[0]).toBeInstanceOf(ERR);
    expect(result.val.errList[0].encode()).toBe("ERR" + "|".repeat(12) + "555");
  });

  test("still rejects a message with no MSA", () => {
    expect(parseACK(msh("ACK").encode()).ok).toBe(false);
  });
});

describe("v2.5.1 ORM^O01", () => {
  test("parses CTD, FT1 and repeating IN3 into v2.5.1 classes", () => {
    const wire = createORM_O01(
      msh("ORM", "O01"),
      [{
        orc: new ORC().orderControl("NW"),
        detail: { segment: new OBR().setId("1"), ctd: new CTD().contactRole({ identifier: "EP" }, { identifier: "CP" }) },
        ftList: [new FT1().setId("1").transactionReferenceKey("7")],
      }],
      { patient: { pid: new PID().setId("1"), insurance: [{ in1: new IN1().setId("1"), in3List: [new IN3(), new IN3()] }] } },
    ).encode();
    const result = parseORM_O01(wire);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const order = result.val.orders[0];
    expect(order.detail?.segment).toBeInstanceOf(OBR);
    expect(order.detail?.ctd).toBeInstanceOf(CTD);
    expect(order.detail?.ctd?.encode()).toBe("CTD|EP~CP");
    expect(order.ftList[0]).toBeInstanceOf(FT1);
    expect(order.ftList[0].encode().split("|")[31]).toBe("7");
    expect(result.val.patient?.pid).toBeInstanceOf(PID);
    expect(result.val.patient?.insurance[0].in3List).toHaveLength(2);
  });
});

describe("v2.5.1 ORR^O02", () => {
  test("parses repeating ERR and the order group into v2.5.1 classes", () => {
    const wire = createORR_O02(msh("ORR", "O02"), new MSA().acknowledgmentCode("AA").messageControlId("1"), {
      errList: [new ERR().severity("W"), new ERR().severity("I")],
      patient: { pid: new PID().setId("1") },
      orders: [{ orc: new ORC().orderControl("OK"), detail: { segment: new OBR().setId("1") } }],
    }).encode();
    const result = parseORR_O02(wire);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.val.errList).toHaveLength(2);
    expect(result.val.errList[0]).toBeInstanceOf(ERR);
    expect(result.val.orders[0].detail?.segment).toBeInstanceOf(OBR);
  });
});
