import { OBR } from "../../segments/v2.5.1/OBR";
import { DEFAULT_ENCODING, EncodingCharacters } from "../../types/encoding";
import { ParseResult, ParserUtils, SegmentParser } from "../../types/parser";

export class OBRParser implements SegmentParser<OBR> {
  parse(
    segmentString: string,
    _encoding?: EncodingCharacters,
  ): ParseResult<OBR> {
    const encoding = _encoding ?? DEFAULT_ENCODING;
    try {
      const fields = segmentString.split(encoding.fieldSeparator);

      if (fields[0] !== "OBR") {
        return {
          success: false,
          error: "Not a valid OBR segment",
        };
      }

      const obr = new OBR();
      obr.fields = [];

      for (let i = 1; i < fields.length; i++) {
        obr.fields[i - 1] = ParserUtils.parseField(fields[i], encoding);
      }

      return {
        success: true,
        data: obr,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to parse OBR segment: ${error}`,
      };
    }
  }
}
