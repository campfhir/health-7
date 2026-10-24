import { describe, it, expect } from "vitest";
import { ORC } from "./ORC.ts";
import { DEFAULT_ENCODING } from "../../types/encoding.ts";

describe("ORC Segment Builder", () => {
  describe("Builder Methods", () => {
    it("should create ORC segment with order control", () => {
      const orc = new ORC().orderControl("NW");

      const encoded = orc.encode();
      expect(encoded).toMatch(/^ORC\|NW/);
    });

    it("should create ORC segment with placer order number", () => {
      const orc = new ORC().orderControl("NW").placerOrderNumber("ORDER123");
      const encoded = orc.encode();
      expect(encoded).toMatch(/^ORC\|NW\|ORDER123/);
    });

    it("should create ORC segment with filler order number", () => {
      const orc = new ORC()
        .orderControl("NW")
        .placerOrderNumber("ORDER123")
        .fillerOrderNumber("FILLER456");
      const encoded = orc.encode();
      const fields = encoded.split("|");
      expect(fields[3]).toBe("FILLER456");
    });

    it("should create ORC segment with order status", () => {
      const orc = new ORC().orderControl("NW").orderStatus("CM");

      const encoded = orc.encode();
      const fields = encoded.split("|");
      expect(fields[5]).toBe("CM");
    });

    it("should create ORC segment with quantity/timing", () => {
      const orc = new ORC().orderControl("NW").quantityTiming("BID");

      const encoded = orc.encode();
      const fields = encoded.split("|");
      expect(fields[7]).toBe("BID");
    });

    it("should create ORC segment with date/time of transaction", () => {
      const orc = new ORC()
        .orderControl("NW")
        .dateTimeOfTransaction("20251119120000");
      const encoded = orc.encode();
      const fields = encoded.split("|");
      expect(fields[9]).toBe("20251119120000");
    });

    it("should create ORC segment with entered by", () => {
      const orc = new ORC()
        .orderControl("NW")
        .enteredBy({ id: "1234", familyName: "Smith", givenName: "John" });
      const encoded = orc.encode();
      const fields = encoded.split("|");
      expect(fields[10]).toBe("1234^Smith^John");
    });

    it("should create ORC segment with ordering provider", () => {
      const orc = new ORC()
        .orderControl("NW")
        .orderingProvider({ id: "5678", familyName: "Johnson", givenName: "Robert" });
      const encoded = orc.encode();
      const fields = encoded.split("|");
      expect(fields[12]).toBe("5678^Johnson^Robert");
    });

    it("should support fluent interface chaining", () => {
      const orc = new ORC()
        .orderControl("NW")
        .placerOrderNumber("ORDER123")
        .fillerOrderNumber("FILLER456")
        .orderStatus("CM")
        .dateTimeOfTransaction("20251119120000")
        .orderingProvider({ id: "5678", familyName: "Johnson", givenName: "Robert" });
      const encoded = orc.encode();
      expect(encoded).toMatch(/^ORC\|NW\|ORDER123\|FILLER456/);
      const fields = encoded.split("|");
      expect(fields[5]).toBe("CM");
      expect(fields[9]).toBe("20251119120000");
      expect(fields[12]).toBe("5678^Johnson^Robert");
    });
  });

  describe("Field Encoding", () => {
    it("should encode empty ORC with only segment name", () => {
      const orc = new ORC();
      const encoded = orc.encode();
      // Empty builder creates fields array with at least one empty element
      expect(encoded === "ORC" || encoded === "ORC|").toBeTruthy();
    });

    it("should encode components with component separator", () => {
      const orc = new ORC().orderControl("NW").placerOrderNumber("ORDER123");
      const encoded = orc.encode();
      expect(encoded.includes("ORDER123")).toBeTruthy();
    });

    it("should handle missing optional components", () => {
      const orc = new ORC().orderControl("NW").placerOrderNumber("ORDER123");
      const encoded = orc.encode();
      const fields = encoded.split("|");
      expect(fields[2]).toBe("ORDER123");
    });

    it("should preserve field positions with empty fields", () => {
      const orc = new ORC().orderControl("NW").orderStatus("CM");

      const encoded = orc.encode();
      const fields = encoded.split("|");
      expect(fields[0]).toBe("ORC");
      expect(fields[1]).toBe("NW");
      expect(fields[2]).toBe("");
      expect(fields[3]).toBe("");
      expect(fields[4]).toBe("");
      expect(fields[5]).toBe("CM");
    });
  });

  describe("Order Control Values", () => {
    const validOrderControls = ["NW", "OK", "UA", "CA", "OC"];

    validOrderControls.forEach((control) => {
      it(`should accept order control: ${control}`, () => {
        const orc = new ORC().orderControl(control);
        const encoded = orc.encode();
        expect(encoded).toMatch(new RegExp(`^ORC\\|${control}`));
      });
    });
  });

  describe("Order Status Values", () => {
    const validStatuses = ["A", "CA", "CM", "DC", "ER", "HD", "IP", "RP", "SC"];

    validStatuses.forEach((status) => {
      it(`should accept order status: ${status}`, () => {
        const orc = new ORC().orderControl("NW").orderStatus(status);

        const encoded = orc.encode();
        const fields = encoded.split("|");
        expect(fields[5]).toBe(status);
      });
    });
  });

  describe("Complex Scenarios", () => {
    it("should create complete ORC for point-of-care order", () => {
      const orc = new ORC()
        .orderControl("NW")
        .placerOrderNumber("POC12345")
        .orderStatus("CM")
        .dateTimeOfTransaction("20251119120000")
        .orderingProvider({ id: "5678", familyName: "Johnson", givenName: "Robert" });
      const encoded = orc.encode();
      const fields = encoded.split("|");

      expect(fields[0]).toBe("ORC");
      expect(fields[1]).toBe("NW");
      expect(fields[2]).toBe("POC12345");
      expect(fields[5]).toBe("CM");
      expect(fields[9]).toBe("20251119120000");
      expect(fields[12]).toBe("5678^Johnson^Robert");
    });

    it("should handle multiple provider name components", () => {
      const orc = new ORC()
        .orderControl("NW")
        .orderingProvider({ id: "5678", familyName: "Johnson", givenName: "Robert" });
      const encoded = orc.encode();
      const fields = encoded.split("|");
      expect(fields[12]).toBe("5678^Johnson^Robert");
    });
  });
});

// ---------------------------------------------------------------------------
// ORC.parse
// ---------------------------------------------------------------------------

describe("ORC.parse", () => {
  describe("Basic Parsing", () => {
    it("should parse minimal ORC segment", () => {
      const result = ORC.parse("ORC|NW", DEFAULT_ENCODING);
      expect(result.ok).toBe(true);
      if (result.ok && result.val) {
        expect(result.val.encode()).toMatch(/^ORC\|NW/);
      }
    });

    it("should parse ORC with placer order number", () => {
      const result = ORC.parse("ORC|NW|ORDER123", DEFAULT_ENCODING);
      expect(result.ok).toBe(true);
      if (result.ok && result.val) {
        expect(result.val.encode().includes("ORDER123")).toBeTruthy();
      }
    });

    it("should parse ORC with placer order number components", () => {
      const result = ORC.parse("ORC|NW|ORDER123^LAB^ISO", DEFAULT_ENCODING);
      expect(result.ok).toBe(true);
      if (result.ok && result.val) {
        expect(result.val.encode().includes("ORDER123^LAB^ISO")).toBeTruthy();
      }
    });

    it("should parse ORC with filler order number", () => {
      const result = ORC.parse("ORC|NW|ORDER123|FILLER456", DEFAULT_ENCODING);
      expect(result.ok).toBe(true);
      if (result.ok && result.val) {
        expect(result.val.encode().includes("FILLER456")).toBeTruthy();
      }
    });
  });

  describe("Order Status Parsing", () => {
    it("should parse ORC with order status", () => {
      const result = ORC.parse("ORC|NW||||CM", DEFAULT_ENCODING);
      expect(result.ok).toBe(true);
      if (result.ok && result.val) {
        expect(result.val.encode().split("|")[5]).toBe("CM");
      }
    });

    it("should parse various order statuses", () => {
      for (const status of ["A", "CA", "CM", "DC", "ER", "HD", "IP", "RP", "SC"]) {
        const result = ORC.parse(`ORC|NW||||${status}`, DEFAULT_ENCODING);
        expect(result.ok).toBe(true);
        if (result.ok && result.val) {
          expect(result.val.encode().includes(status)).toBeTruthy();
        }
      }
    });
  });

  describe("Provider Information Parsing", () => {
    it("should parse entered by", () => {
      const result = ORC.parse("ORC|NW|||||||||1234^Smith^John", DEFAULT_ENCODING);
      expect(result.ok).toBe(true);
      if (result.ok && result.val) {
        expect(result.val.encode().includes("1234^Smith^John")).toBeTruthy();
      }
    });

    it("should parse ordering provider", () => {
      const result = ORC.parse("ORC|NW|||||||||||5678^Johnson^Robert", DEFAULT_ENCODING);
      expect(result.ok).toBe(true);
      if (result.ok && result.val) {
        expect(result.val.encode().includes("5678^Johnson^Robert")).toBeTruthy();
      }
    });
  });

  describe("Round-trip Consistency", () => {
    it("should maintain data through build->encode->parse->encode cycle", () => {
      const original = new ORC()
        .orderControl("NW").placerOrderNumber("ORDER123").orderStatus("CM")
        .dateTimeOfTransaction("20251119120000").orderingProvider({ id: "5678", familyName: "Johnson", givenName: "Robert" });
      const encoded1 = original.encode();
      const parseResult = ORC.parse(encoded1, DEFAULT_ENCODING);
      expect(parseResult.ok).toBe(true);
      if (parseResult.ok && parseResult.val) {
        expect(parseResult.val.encode()).toBe(encoded1);
      }
    });

    it("should handle complex ORC round-trip", () => {
      const original = new ORC()
        .orderControl("NW").placerOrderNumber("POC12345").fillerOrderNumber("FILLER456")
        .orderStatus("CM").quantityTiming("BID").dateTimeOfTransaction("20251119120000")
        .enteredBy({ id: "1234", familyName: "Smith", givenName: "John" }).orderingProvider({ id: "5678", familyName: "Johnson", givenName: "Robert" });
      const encoded1 = original.encode();
      const parseResult = ORC.parse(encoded1, DEFAULT_ENCODING);
      expect(parseResult.ok).toBe(true);
      if (parseResult.ok && parseResult.val) {
        expect(parseResult.val.encode()).toBe(encoded1);
      }
    });
  });

  describe("Error Handling", () => {
    it("should return error for non-ORC segment", () => {
      const result = ORC.parse("PID|1||12345", DEFAULT_ENCODING);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.err.message?.includes("ORC")).toBeTruthy();
      }
    });

    it("should return error for empty segment", () => {
      expect(ORC.parse("", DEFAULT_ENCODING).ok).toBe(false);
    });
  });

  describe("Empty Field Handling", () => {
    it("should handle empty fields between populated fields", () => {
      const result = ORC.parse("ORC|NW||||CM", DEFAULT_ENCODING);
      expect(result.ok).toBe(true);
      if (result.ok && result.val) {
        const fields = result.val.encode().split("|");
        expect(fields[2]).toBe("");
        expect(fields[3]).toBe("");
        expect(fields[4]).toBe("");
        expect(fields[5]).toBe("CM");
      }
    });
  });
});
