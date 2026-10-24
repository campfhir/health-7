// RXR in HL7 v2.3.1 adds RXR-5 Routing Instruction.
import { test, expect } from "vitest";
import { RXR } from "./RXR.ts";
import { RXR as RXR_v23 } from "../v2.3/RXR.ts";

test("RXR (v2.3.1) extends v2.3 and adds RXR-5 Routing Instruction (CE)", () => {
  const rxr = new RXR().routingInstruction({ identifier: "R1", text: "instr" });
  expect(rxr).toBeInstanceOf(RXR_v23);
  expect(rxr.encode()).toBe("RXR|||||R1^instr");
});
