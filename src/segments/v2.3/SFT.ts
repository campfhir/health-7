import { Err } from "../../utils/err";
import { Result } from "../../types/result";
import { BaseSegment } from "../../types/segment";
import { EncodingCharacters } from "../../types/encoding";
import { ParserUtils } from "../../types/parser";

/**
 * SFT - Software Segment (HL7 v2.3)
 */
export class SFT extends BaseSegment {
  name = "SFT";

  constructor() {
    super();
    this.fields = [];
  }

  /** SFT-1: Software Vendor Organization (XON) */
  softwareVendorOrganization(value: string): this {
    this.fields[0] = this.createField(value);
    return this;
  }

  /** SFT-2: Software Certified Version or Release Number (ST) */
  softwareVersion(value: string): this {
    this.fields[1] = this.createField(value);
    return this;
  }

  /** SFT-3: Software Product Name (ST) */
  softwareProductName(value: string): this {
    this.fields[2] = this.createField(value);
    return this;
  }

  /** SFT-4: Software Binary ID (ST) */
  softwareBinaryId(value: string): this {
    this.fields[3] = this.createField(value);
    return this;
  }

  /** SFT-5: Software Product Information (TX) */
  softwareProductInfo(value: string): this {
    this.fields[4] = this.createField(value);
    return this;
  }

  /** SFT-6: Software Install Date (TS) */
  softwareInstallDate(value: string): this {
    this.fields[5] = this.createField(value);
    return this;
  }

  static parse(
    segmentString: string,
    encoding: EncodingCharacters,
  ): Result<SFT> {
    const parts = segmentString.split(encoding.fieldSeparator);
    if (parts[0] !== "SFT") {
      return {
        ok: false,
        err: new Err(`Expected SFT segment, got ${parts[0]}`),
      };
    }
    const seg = new SFT();
    for (let i = 1; i < parts.length; i++) {
      seg.fields[i - 1] = ParserUtils.parseField(parts[i], encoding);
    }
    return { ok: true, val: seg };
  }
}
