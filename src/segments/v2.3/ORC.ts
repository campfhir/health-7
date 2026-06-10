/**
 * ORC segment definition for HL7 v2.3.
 *
 * @module
 */
import { Err } from "../../utils/err.ts";
import type { Result } from "../../types/result.ts";
import { BaseSegment } from "../../types/segment.ts";
import type { EncodingCharacters } from "../../types/encoding.ts";
import { ParserUtils } from "../../types/parser.ts";
import { formatHL7Date, DateTimeLayout, type HL7DateTimeLayout } from "../../utils/hl7DateUtils.ts";

/**
 * ORC - Common Order Segment (HL7 v2.3)
 */
export class ORC extends BaseSegment {
  /** The HL7 segment identifier. */
  name = "ORC";

  constructor() {
    super();
    this.fields = [];
  }

  /** Sets the order control field (chainable). */
  orderControl(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** Sets the placer order number field (chainable). */
  placerOrderNumber(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** Sets the filler order number field (chainable). */
  fillerOrderNumber(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** Sets the placer group number field (chainable). */
  placerGroupNumber(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** Sets the order status field (chainable). */
  orderStatus(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** Sets the response flag field (chainable). */
  responseFlag(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  /** Sets the quantity timing field (chainable). */
  quantityTiming(value: string): this {
    this.fields[6] = this.createField(value);
    return this;
  }

  /** Sets the parent field (chainable). */
  parent(value: string): this {
    this.fields[7] = this.createField(value);
    return this;
  }

  /** Sets the date time of transaction field (chainable). */
  dateTimeOfTransaction(value: string, format?: never): this;
  /** Sets the date time of transaction field (chainable). */
  dateTimeOfTransaction(value: Date, format?: HL7DateTimeLayout): this;
  dateTimeOfTransaction(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[8] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** Sets the entered by field (chainable). */
  enteredBy(id: string, familyName?: string, givenName?: string): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[9] = this.createField(components);
    return this;
  }

  /** Sets the verified by field (chainable). */
  verifiedBy(id: string, familyName?: string, givenName?: string): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[10] = this.createField(components);
    return this;
  }

  /** Sets the ordering provider field (chainable). */
  orderingProvider(id: string, familyName?: string, givenName?: string): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[11] = this.createField(components);
    return this;
  }

  /** Sets the enterers location field (chainable). */
  enterersLocation(value: string): this {
    this.fields[12] = this.createField(value);
    return this;
  }

  /** Sets the call back phone number field (chainable). */
  callBackPhoneNumber(value: string): this {
    this.fields[13] = this.createField(value);
    return this;
  }

  /** Sets the order effective date time field (chainable). */
  orderEffectiveDateTime(value: string, format?: never): this;
  /** Sets the order effective date time field (chainable). */
  orderEffectiveDateTime(value: Date, format?: HL7DateTimeLayout): this;
  orderEffectiveDateTime(value: string | Date, format?: HL7DateTimeLayout): this {
    this.fields[14] = this.createField(
      formatHL7Date(value, format ?? DateTimeLayout),
    );
    return this;
  }

  /** Sets the order control code reason field (chainable). */
  orderControlCodeReason(value: string): this {
    this.fields[15] = this.createField(value);
    return this;
  }

  /** Sets the entering organization field (chainable). */
  enteringOrganization(value: string): this {
    this.fields[16] = this.createField(value);
    return this;
  }

  /** Sets the entering device field (chainable). */
  enteringDevice(value: string): this {
    this.fields[17] = this.createField(value);
    return this;
  }

  /** Sets the action by field (chainable). */
  actionBy(id: string, familyName?: string, givenName?: string): this {
    const components = [id];
    if (familyName) components.push(familyName);
    if (givenName) components.push(givenName);

    this.fields[18] = this.createField(components);
    return this;
  }

  /** Parses the input string into a structured instance. */
  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<ORC> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "ORC") {
      return {
        ok: false,
        err: new Err(`Expected ORC segment, got ${parts[0]}`),
      };
    }
    const orc = new ORC();
    for (let i = 1; i < parts.length; i++) {
      orc.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: orc };
  }
}
