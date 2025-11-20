import { PV1 } from "../../segments/v2.5.1/PV1";
import { DEFAULT_ENCODING, EncodingCharacters } from "../../types/encoding";
import { ParseResult, ParserUtils, SegmentParser } from "../../types/parser";

export class PV1Parser implements SegmentParser<PV1> {
  parse(
    segmentString: string,
    _encoding?: EncodingCharacters,
  ): ParseResult<PV1> {
    const encoding = _encoding ?? DEFAULT_ENCODING;
    try {
      const fields = segmentString.split(encoding.fieldSeparator);

      if (fields[0] !== "PV1") {
        return {
          success: false,
          error: "Not a valid PV1 segment",
        };
      }

      const pv1 = new PV1();
      pv1.fields = [];

      for (let i = 1; i < fields.length; i++) {
        pv1.fields[i - 1] = ParserUtils.parseField(fields[i], encoding);
      }

      return {
        success: true,
        data: pv1,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to parse PV1 segment: ${error}`,
      };
    }
  }
}
