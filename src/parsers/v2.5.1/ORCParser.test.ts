import { describe, it } from "node:test";
import assert from "node:assert";
import { ORCParser } from "./ORCParser.js";
import { ORC } from "../../segments/v2.5.1/ORC.js";
import { DEFAULT_ENCODING } from "../../types/encoding.js";

describe("ORCParser", () => {
  const parser = new ORCParser();

  describe("Basic Parsing", () => {
    it("should parse minimal ORC segment", () => {
      const segment = "ORC|NW";
      const result = parser.parse(segment);

      assert.strictEqual(result.success, true);
      if (result.success && result.data) {
        const encoded = result.data.encode();
        assert.match(encoded, /^ORC\|NW/);
      }
    });

    it("should parse ORC with placer order number", () => {
      const segment = "ORC|NW|ORDER123";
      const result = parser.parse(segment);

      assert.strictEqual(result.success, true);
      if (result.success && result.data) {
        const encoded = result.data.encode();
        assert.ok(encoded.includes("ORDER123"));
      }
    });

    it("should parse ORC with placer order number components", () => {
      const segment = "ORC|NW|ORDER123^LAB^ISO";
      const result = parser.parse(segment);

      assert.strictEqual(result.success, true);
      if (result.success && result.data) {
        const encoded = result.data.encode();
        assert.ok(encoded.includes("ORDER123^LAB^ISO"));
      }
    });

    it("should parse ORC with filler order number", () => {
      const segment = "ORC|NW|ORDER123|FILLER456";
      const result = parser.parse(segment);

      assert.strictEqual(result.success, true);
      if (result.success && result.data) {
        const encoded = result.data.encode();
        assert.ok(encoded.includes("FILLER456"));
      }
    });
  });

  describe("Order Status Parsing", () => {
    it("should parse ORC with order status", () => {
      const segment = "ORC|NW||||CM";
      const result = parser.parse(segment);

      assert.strictEqual(result.success, true);
      if (result.success && result.data) {
        const encoded = result.data.encode();
        const fields = encoded.split("|");
        assert.strictEqual(fields[5], "CM");
      }
    });

    it("should parse various order statuses", () => {
      const statuses = ["A", "CA", "CM", "DC", "ER", "HD", "IP", "RP", "SC"];

      statuses.forEach((status) => {
        const segment = `ORC|NW||||${status}`;
        const result = parser.parse(segment);

        assert.strictEqual(result.success, true);
        if (result.success && result.data) {
          const encoded = result.data.encode();
          assert.ok(encoded.includes(status));
        }
      });
    });
  });

  describe("Date/Time Parsing", () => {
    it("should parse date/time of transaction", () => {
      const segment = "ORC|NW||||||||20251119120000";
      const result = parser.parse(segment);

      assert.strictEqual(result.success, true);
      if (result.success && result.data) {
        const encoded = result.data.encode();
        assert.ok(encoded.includes("20251119120000"));
      }
    });
  });

  describe("Provider Information Parsing", () => {
    it("should parse entered by", () => {
      const segment = "ORC|NW|||||||||1234^Smith^John";
      const result = parser.parse(segment);

      assert.strictEqual(result.success, true);
      if (result.success && result.data) {
        const encoded = result.data.encode();
        assert.ok(encoded.includes("1234^Smith^John"));
      }
    });

    it("should parse ordering provider", () => {
      const segment = "ORC|NW|||||||||||5678^Johnson^Robert";
      const result = parser.parse(segment);

      assert.strictEqual(result.success, true);
      if (result.success && result.data) {
        const encoded = result.data.encode();
        assert.ok(encoded.includes("5678^Johnson^Robert"));
      }
    });

    it("should parse ordering provider with all name components", () => {
      const segment = "ORC|NW|||||||||||5678^Johnson^Robert^MD^Dr";
      const result = parser.parse(segment);

      assert.strictEqual(result.success, true);
      if (result.success && result.data) {
        const encoded = result.data.encode();
        assert.ok(encoded.includes("5678^Johnson^Robert"));
      }
    });
  });

  describe("Complete ORC Parsing", () => {
    it("should parse complete ORC segment", () => {
      const segment =
        "ORC|NW|POC12345||||||CM||20251119120000|||5678^Johnson^Robert^Dr";
      const result = parser.parse(segment);

      assert.strictEqual(result.success, true);
      if (result.success && result.data) {
        const encoded = result.data.encode();
        const fields = encoded.split("|");

        assert.strictEqual(fields[0], "ORC");
        assert.strictEqual(fields[1], "NW");
        assert.strictEqual(fields[2], "POC12345");
        assert.ok(encoded.includes("CM"));
        assert.ok(encoded.includes("20251119120000"));
        assert.ok(encoded.includes("5678^Johnson^Robert"));
      }
    });
  });

  describe("Round-trip Consistency", () => {
    it("should maintain data through build->encode->parse->encode cycle", () => {
      const original = new ORC()
        .orderControl("NW")
        .placerOrderNumber("ORDER123")
        .orderStatus("CM")
        .dateTimeOfTransaction("20251119120000")
        .orderingProvider("5678", "Johnson", "Robert");

      const encoded1 = original.encode();
      const parseResult = parser.parse(encoded1);

      assert.strictEqual(parseResult.success, true);
      if (parseResult.success && parseResult.data) {
        const encoded2 = parseResult.data.encode();
        assert.strictEqual(encoded1, encoded2);
      }
    });

    it("should handle minimal ORC round-trip", () => {
      const original = new ORC().orderControl("NW");
      const encoded1 = original.encode();
      const parseResult = parser.parse(encoded1);

      assert.strictEqual(parseResult.success, true);
      if (parseResult.success && parseResult.data) {
        const encoded2 = parseResult.data.encode();
        assert.strictEqual(encoded1, encoded2);
      }
    });

    it("should handle complex ORC round-trip", () => {
      const original = new ORC()
        .orderControl("NW")
        .placerOrderNumber("POC12345")
        .fillerOrderNumber("FILLER456")
        .orderStatus("CM")
        .quantityTiming("BID")
        .dateTimeOfTransaction("20251119120000")
        .enteredBy("1234", "Smith", "John")
        .orderingProvider("5678", "Johnson", "Robert");

      const encoded1 = original.encode();
      const parseResult = parser.parse(encoded1);

      assert.strictEqual(parseResult.success, true);
      if (parseResult.success && parseResult.data) {
        const encoded2 = parseResult.data.encode();
        assert.strictEqual(encoded1, encoded2);
      }
    });
  });

  describe("Error Handling", () => {
    it("should return error for non-ORC segment", () => {
      const segment = "PID|1||12345";
      const result = parser.parse(segment);

      assert.strictEqual(result.success, false);
      if (!result.success) {
        assert.ok(result.error?.includes("ORC"));
      }
    });

    it("should return error for empty segment", () => {
      const segment = "";
      const result = parser.parse(segment);

      assert.strictEqual(result.success, false);
    });
  });

  describe("Empty Field Handling", () => {
    it("should handle empty fields between populated fields", () => {
      const segment = "ORC|NW||||CM";
      const result = parser.parse(segment);

      assert.strictEqual(result.success, true);
      if (result.success && result.data) {
        const encoded = result.data.encode();
        const fields = encoded.split("|");
        assert.strictEqual(fields[2], "");
        assert.strictEqual(fields[3], "");
        assert.strictEqual(fields[4], "");
        assert.strictEqual(fields[5], "CM");
      }
    });

    it("should handle trailing empty fields", () => {
      const segment = "ORC|NW|ORDER123|||||||||||";
      const result = parser.parse(segment);

      assert.strictEqual(result.success, true);
      if (result.success && result.data) {
        const encoded = result.data.encode();
        assert.ok(encoded.includes("ORDER123"));
      }
    });
  });
});
