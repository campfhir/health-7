import { PID } from "../../segments/v2.5.1/PID";
import { DEFAULT_ENCODING, EncodingCharacters } from "../../types/encoding";
import { ParseResult, ParserUtils, SegmentParser } from "../../types/parser";

export class PIDParser implements SegmentParser<PID> {
  parse(
    segmentString: string,
    _encoding?: EncodingCharacters,
  ): ParseResult<PID> {
    const encoding = _encoding ?? DEFAULT_ENCODING;
    try {
      const fields = segmentString.split(encoding.fieldSeparator);

      if (fields[0] !== "PID") {
        return {
          success: false,
          error: "Not a valid PID segment",
        };
      }

      const pid = new PID();
      pid.fields = [];

      for (let i = 1; i < fields.length; i++) {
        pid.fields[i - 1] = ParserUtils.parseField(fields[i], encoding);
      }

      return {
        success: true,
        data: pid,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to parse PID segment: ${error}`,
      };
    }
  }
}
