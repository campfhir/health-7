import { ORC } from "../../segments/v2.5.1/ORC";
import { DEFAULT_ENCODING, EncodingCharacters } from "../../types/encoding";
import { ParseResult, ParserUtils, SegmentParser } from "../../types/parser";

export class ORCParser implements SegmentParser<ORC> {
  parse(
    segmentString: string,
    _encoding?: EncodingCharacters,
  ): ParseResult<ORC> {
    const encoding = _encoding ?? DEFAULT_ENCODING;
    try {
      const fields = segmentString.split(encoding.fieldSeparator);

      if (fields[0] !== "ORC") {
        return {
          success: false,
          error: "Not a valid ORC segment",
        };
      }

      const orc = new ORC();
      orc.fields = [];

      for (let i = 1; i < fields.length; i++) {
        orc.fields[i - 1] = ParserUtils.parseField(fields[i], encoding);
      }

      return {
        success: true,
        data: orc,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to parse ORC segment: ${error}`,
      };
    }
  }
}
