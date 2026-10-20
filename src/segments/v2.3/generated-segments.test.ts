// Round-trip checks for the v2.3 segments generated from codegen/spec/v2.3-segments.json.
// Each one parses a minimal segment and encodes it back unchanged.
import { test, expect, describe } from "vitest";
import * as segments from "./index.ts";
import { DEFAULT_ENCODING } from "../../types/encoding.ts";

const GENERATED = [
  "APR",
  "ARQ",
  "AUT",
  "CDM",
  "CM0",
  "CM1",
  "CM2",
  "CSP",
  "CSR",
  "CSS",
  "EQL",
  "ERQ",
  "FAC",
  "GOL",
  "LCC",
  "LCH",
  "LDP",
  "LOC",
  "LRL",
  "MFA",
  "NCK",
  "NPU",
  "NSC",
  "NST",
  "OM1",
  "OM2",
  "OM3",
  "OM4",
  "OM5",
  "OM6",
  "PCR",
  "PDC",
  "PEO",
  "PES",
  "PRB",
  "PRC",
  "PRD",
  "PSH",
  "PTH",
  "RDF",
  "RDT",
  "RF1",
  "RXC",
  "RXG",
  "SPR",
  "TXA",
  "URD",
  "URS",
  "VAR",
  "VTQ",
] as const;

type ParseFn = (segmentString: string, encoding: typeof DEFAULT_ENCODING) => { ok: boolean; val?: { encode(): string } };

describe("generated v2.3 segments", () => {
  test.each(GENERATED)("%s round-trips a minimal segment", (code) => {
    const cls = (segments as unknown as Record<string, { parse: ParseFn }>)[code];
    const input = code + "|x";
    const result = cls.parse(input, DEFAULT_ENCODING);
    expect(result.ok).toBe(true);
    expect(result.val?.encode()).toBe(input);
  });

  test("repeating fields write one repetition per entry", () => {
    expect(new segments.CM0().alternateStudyId("A^B", "C").encode().split("|")[3]).toBe("A^B~C");
  });
});
