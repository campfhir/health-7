import { OBX } from '../../segments/v2.5.1/OBX';
import { EncodingCharacters } from '../../types/encoding';
import { ParseResult, ParserUtils, SegmentParser } from '../../types/parser';

export class OBXParser implements SegmentParser<OBX> {
  parse(segmentString: string, encoding: EncodingCharacters): ParseResult<OBX> {
    try {
      const fields = segmentString.split(encoding.fieldSeparator);

      if (fields[0] !== 'OBX') {
        return {
          success: false,
          error: 'Not a valid OBX segment',
        };
      }

      const obx = new OBX();
      obx.fields = [];

      for (let i = 1; i < fields.length; i++) {
        obx.fields[i - 1] = ParserUtils.parseField(fields[i], encoding);
      }

      return {
        success: true,
        data: obx,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to parse OBX segment: ${error}`,
      };
    }
  }
}
