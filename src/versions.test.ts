import { describe, test, expect } from "vitest";
import * as seg23 from "./segments/v2.3/index.ts";
import * as seg231 from "./segments/v2.3.1/index.ts";
import * as seg24 from "./segments/v2.4/index.ts";
import * as seg25 from "./segments/v2.5/index.ts";
import * as seg251 from "./segments/v2.5.1/index.ts";
import * as par23 from "./parsers/v2.3/index.ts";
import * as par231 from "./parsers/v2.3.1/index.ts";
import * as par24 from "./parsers/v2.4/index.ts";
import * as par25 from "./parsers/v2.5/index.ts";
import * as par251 from "./parsers/v2.5.1/index.ts";
import * as bld23 from "./builders/v2.3/index.ts";
import * as bld24 from "./builders/v2.4/index.ts";

describe("segment introduction by version", () => {
  test("SFT, SPM and TQ1 are introduced in v2.5", () => {
    for (const name of ["SFT", "SPM", "TQ1"]) {
      expect(name in seg23).toBe(false);
      expect(name in seg231).toBe(false);
      expect(name in seg24).toBe(false);
      expect(name in seg25).toBe(true);
      expect(name in seg251).toBe(true);
    }
  });

  test("ROL and DB1 exist from v2.3", () => {
    for (const name of ["ROL", "DB1"]) {
      expect(name in seg23).toBe(true);
    }
  });
});

describe("re-export versions", () => {
  test("unchanged segments are the very same class as v2.3", () => {
    expect(seg231.PID).toBe(seg23.PID);
    expect(seg24.PID).toBe(seg23.PID);
    expect(seg25.OBX).toBe(seg23.OBX);
  });

  test("v2.5.1 builds on v2.5, not v2.3", () => {
    expect(Object.getPrototypeOf(seg251.PID)).toBe(seg25.PID);
    expect(seg251.SFT.prototype).toBeInstanceOf(seg25.SFT);
  });

  test("parsers and builders are re-exported", () => {
    expect(par231.parseADT_A01).toBe(par23.parseADT_A01);
    expect(par25.parseORU_R01).toBe(par23.parseORU_R01);
    expect(bld24.createADT_A01).toBe(bld23.createADT_A01);
  });
});

describe("ACK, ORM^O01 and ORR^O02", () => {
  test("v2.3.1 re-exports the v2.3 implementations", () => {
    for (const fn of ["parseACK", "parseORM_O01", "parseORR_O02"] as const) {
      expect(par231[fn]).toBe(par23[fn]);
    }
  });

  test("v2.4 changes only ORM^O01 (adds CTD and FT1); ACK and ORR^O02 are v2.3's", () => {
    expect(par24.parseACK).toBe(par23.parseACK);
    expect(par24.parseORR_O02).toBe(par23.parseORR_O02);
    expect(par24.parseORM_O01).not.toBe(par23.parseORM_O01);
    expect(bld24.createORM_O01).not.toBe(bld23.createORM_O01);
  });

  test("v2.5 has its own ACK (SFT, repeating ERR), ORR^O02 (repeating ERR) and ORM^O01 (repeating IN3)", () => {
    expect(par25.parseACK).not.toBe(par23.parseACK);
    expect(par25.parseORR_O02).not.toBe(par23.parseORR_O02);
    expect(par25.parseORM_O01).not.toBe(par24.parseORM_O01);
  });

  test("v2.5.1 has all three (parsers derived from v2.5)", () => {
    for (const fn of ["parseACK", "parseORM_O01", "parseORR_O02"] as const) {
      expect(typeof par251[fn]).toBe("function");
      expect(par251[fn]).not.toBe(par25[fn]);
    }
  });

  test("the order detail and billing segments exist from v2.3; FT1 and CTD too", () => {
    for (const name of ["RQD", "RQ1", "ODS", "ODT", "BLG", "FT1", "CTD"]) {
      expect(name in seg23).toBe(true);
      expect(name in seg251).toBe(true);
    }
  });
});
