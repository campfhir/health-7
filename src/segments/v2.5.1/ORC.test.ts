import { describe, it } from "node:test";
import assert from "node:assert";
import { ORC } from "./ORC.js";

describe("ORC Segment Builder", () => {
  describe("Builder Methods", () => {
    it("should create ORC segment with order control", () => {
      const orc = new ORC().orderControl("NW");

      const encoded = orc.encode();
      assert.match(encoded, /^ORC\|NW/);
    });

    it("should create ORC segment with placer order number", () => {
      const orc = new ORC().orderControl("NW").placerOrderNumber("ORDER123");
      const encoded = orc.encode();
      assert.match(encoded, /^ORC\|NW\|ORDER123/);
    });

    it("should create ORC segment with filler order number", () => {
      const orc = new ORC()
        .orderControl("NW")
        .placerOrderNumber("ORDER123")
        .fillerOrderNumber("FILLER456");
      const encoded = orc.encode();
      const fields = encoded.split("|");
      assert.strictEqual(fields[3], "FILLER456");
    });

    it("should create ORC segment with order status", () => {
      const orc = new ORC().orderControl("NW").orderStatus("CM");

      const encoded = orc.encode();
      const fields = encoded.split("|");
      assert.strictEqual(fields[5], "CM");
    });

    it("should create ORC segment with quantity/timing", () => {
      const orc = new ORC().orderControl("NW").quantityTiming("BID");

      const encoded = orc.encode();
      const fields = encoded.split("|");
      assert.strictEqual(fields[7], "BID");
    });

    it("should create ORC segment with date/time of transaction", () => {
      const orc = new ORC()
        .orderControl("NW")
        .dateTimeOfTransaction("20251119120000");
      const encoded = orc.encode();
      const fields = encoded.split("|");
      assert.strictEqual(fields[9], "20251119120000");
    });

    it("should create ORC segment with entered by", () => {
      const orc = new ORC()
        .orderControl("NW")
        .enteredBy("1234", "Smith", "John");
      const encoded = orc.encode();
      const fields = encoded.split("|");
      assert.strictEqual(fields[10], "1234^Smith^John");
    });

    it("should create ORC segment with ordering provider", () => {
      const orc = new ORC()
        .orderControl("NW")
        .orderingProvider("5678", "Johnson", "Robert");
      const encoded = orc.encode();
      const fields = encoded.split("|");
      assert.strictEqual(fields[12], "5678^Johnson^Robert");
    });

    it("should support fluent interface chaining", () => {
      const orc = new ORC()
        .orderControl("NW")
        .placerOrderNumber("ORDER123")
        .fillerOrderNumber("FILLER456")
        .orderStatus("CM")
        .dateTimeOfTransaction("20251119120000")
        .orderingProvider("5678", "Johnson", "Robert");
      const encoded = orc.encode();
      assert.match(encoded, /^ORC\|NW\|ORDER123\|FILLER456/);
      const fields = encoded.split("|");
      assert.strictEqual(fields[5], "CM");
      assert.strictEqual(fields[9], "20251119120000");
      assert.strictEqual(fields[12], "5678^Johnson^Robert");
    });
  });

  describe("Field Encoding", () => {
    it("should encode empty ORC with only segment name", () => {
      const orc = new ORC();
      const encoded = orc.encode();
      // Empty builder creates fields array with at least one empty element
      assert.ok(encoded === "ORC" || encoded === "ORC|");
    });

    it("should encode components with component separator", () => {
      const orc = new ORC().orderControl("NW").placerOrderNumber("ORDER123");
      const encoded = orc.encode();
      assert.ok(encoded.includes("ORDER123"));
    });

    it("should handle missing optional components", () => {
      const orc = new ORC().orderControl("NW").placerOrderNumber("ORDER123");
      const encoded = orc.encode();
      const fields = encoded.split("|");
      assert.strictEqual(fields[2], "ORDER123");
    });

    it("should preserve field positions with empty fields", () => {
      const orc = new ORC().orderControl("NW").orderStatus("CM");

      const encoded = orc.encode();
      const fields = encoded.split("|");
      assert.strictEqual(fields[0], "ORC");
      assert.strictEqual(fields[1], "NW");
      assert.strictEqual(fields[2], "");
      assert.strictEqual(fields[3], "");
      assert.strictEqual(fields[4], "");
      assert.strictEqual(fields[5], "CM");
    });
  });

  describe("Order Control Values", () => {
    const validOrderControls = ["NW", "OK", "UA", "CA", "OC"];

    validOrderControls.forEach((control) => {
      it(`should accept order control: ${control}`, () => {
        const orc = new ORC().orderControl(control);
        const encoded = orc.encode();
        assert.match(encoded, new RegExp(`^ORC\\|${control}`));
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
        assert.strictEqual(fields[5], status);
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
        .orderingProvider("5678", "Johnson", "Robert");
      const encoded = orc.encode();
      const fields = encoded.split("|");

      assert.strictEqual(fields[0], "ORC");
      assert.strictEqual(fields[1], "NW");
      assert.strictEqual(fields[2], "POC12345");
      assert.strictEqual(fields[5], "CM");
      assert.strictEqual(fields[9], "20251119120000");
      assert.strictEqual(fields[12], "5678^Johnson^Robert");
    });

    it("should handle multiple provider name components", () => {
      const orc = new ORC()
        .orderControl("NW")
        .orderingProvider("5678", "Johnson", "Robert");
      const encoded = orc.encode();
      const fields = encoded.split("|");
      assert.strictEqual(fields[12], "5678^Johnson^Robert");
    });
  });
});
