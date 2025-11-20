import { MSH } from "../../segments/v2.5.1/MSH";
import { EncodingCharacters } from "../../types/encoding";
import { ParseResult, ParserUtils, SegmentParser } from "../../types/parser";

export class MSHParser implements SegmentParser<MSH> {
  parse(segmentString: string): ParseResult<MSH> {
    try {
      // First, extract the field separator (character after MSH)
      if (!segmentString.startsWith("MSH")) {
        return {
          success: false,
          error: "Not a valid MSH segment",
        };
      }

      if (segmentString.length < 8) {
        return {
          success: false,
          error: "MSH segment too short to contain encoding characters",
        };
      }

      const fieldSeparator = segmentString[3]; // Character right after "MSH"

      // Extract encoding characters from MSH-2 (the 4 characters after field separator)
      // Format: ^~\& (component^repetition~escape\subcomponent&)
      const encodingChars = segmentString.substring(4, 8);

      if (encodingChars.length < 4) {
        return {
          success: false,
          error: "Invalid encoding characters in MSH segment",
        };
      }

      const encoding: EncodingCharacters = {
        fieldSeparator: fieldSeparator,
        componentSeparator: encodingChars[0],
        repetitionSeparator: encodingChars[1],
        escapeCharacter: encodingChars[2],
        subComponentSeparator: encodingChars[3],
      };

      // Now parse the segment using the extracted encoding
      const fields = segmentString.split(encoding.fieldSeparator);

      const msh = new MSH();
      msh.fields = [];

      // Store the encoding in the MSH segment
      msh.setEncoding(encoding);

      // Field 0 is always empty for MSH
      msh.fields[0] = ParserUtils.parseField("", encoding);

      // Skip field 1 (encoding characters themselves) and start from field 2
      for (let i = 2; i < fields.length; i++) {
        msh.fields[i - 1] = ParserUtils.parseField(fields[i], encoding);
      }

      return {
        success: true,
        data: msh,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to parse MSH segment: ${error}`,
      };
    }
  }
}
