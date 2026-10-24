/**
 * The derived ADT events added in 0.11: A32/A33 reuse the A01 builder/parser (like A21),
 * A46/A48/A49/A50/A51 reuse the A34 builder/parser (like A47). Checks that every wrapper
 * exists in v2.3 and v2.5.1, encodes its trigger event and parses under its own name.
 */
import { describe, test, expect } from "vitest";
import * as b23 from "./index.ts";
import * as p23 from "../../parsers/v2.3/index.ts";
import * as b251 from "../v2.5.1/index.ts";
import * as p251 from "../../parsers/v2.5.1/index.ts";
import { MSH } from "../../segments/v2.3/MSH.ts";
import { EVN } from "../../segments/v2.3/EVN.ts";
import { PID } from "../../segments/v2.3/PID.ts";
import { PV1 } from "../../segments/v2.3/PV1.ts";
import { MRG } from "../../segments/v2.3/MRG.ts";
import type { Result } from "../../types/result.ts";

const msh = (event: string) => new MSH().sendingApplication("TEST").messageType({ messageCode: "ADT", triggerEvent: event });
const pid = () => new PID().setId("1").patientName({ familyName: "Doe", givenName: "John" });

const A01_LIKE = ["A32", "A33"] as const;
const A34_LIKE = ["A46", "A48", "A49", "A50", "A51"] as const;

for (const [label, builders, parsers] of [
  ["v2.3", b23, p23],
  ["v2.5.1", b251, p251],
] as const) {
  describe(`${label} derived ADT events`, () => {
    for (const event of A01_LIKE) {
      test(`ADT^${event} (A01 structure) builds, encodes and parses`, () => {
        const create = (builders as Record<string, unknown>)[`createADT_${event}`] as typeof b23.createADT_A01;
        const parse = (parsers as Record<string, unknown>)[`parseADT_${event}`] as (s: string) => Result<{ pid: unknown }>;
        const encoded = create(msh(event), new EVN().eventTypeCode(event), pid(), new PV1().patientClass("I")).encode();
        expect(encoded.split("\r").map((s) => s.substring(0, 3))).toEqual(["MSH", "EVN", "PID", "PV1"]);
        expect(encoded).toContain(`ADT^${event}`);
        const parsed = parse(encoded);
        expect(parsed.ok).toBe(true);
        expect(parsed.val!.pid).toBeTruthy();
        const missingPid = parse(`MSH|^~\\&|TEST|||||ADT^${event}\rEVN|${event}`);
        expect(missingPid.ok).toBe(false);
        expect(missingPid.err!.message).toContain(`ADT_${event} message must contain a PID segment`);
      });
    }
    for (const event of A34_LIKE) {
      test(`ADT^${event} (A34 structure) builds, encodes and parses`, () => {
        const create = (builders as Record<string, unknown>)[`createADT_${event}`] as typeof b23.createADT_A34;
        const parse = (parsers as Record<string, unknown>)[`parseADT_${event}`] as (s: string) => Result<{ mrg: unknown }>;
        const mrg = new MRG().priorPatientId({ id: "OLD-1" });
        const options = event === "A50" || event === "A51" ? { pv1: new PV1().patientClass("I") } : {};
        const encoded = create(msh(event), pid(), mrg, options).encode();
        const expected = ["MSH", "PID", "MRG", ...(options.pv1 ? ["PV1"] : [])];
        expect(encoded.split("\r").map((s) => s.substring(0, 3))).toEqual(expected);
        const parsed = parse(encoded);
        expect(parsed.ok).toBe(true);
        expect(parsed.val!.mrg).toBeTruthy();
        const missingMrg = parse(`MSH|^~\\&|TEST|||||ADT^${event}\rPID|1`);
        expect(missingMrg.ok).toBe(false);
        expect(missingMrg.err!.message).toContain(`ADT_${event} message must contain a MRG segment`);
      });
    }
  });
}
