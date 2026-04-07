import { Result } from "../types/result";
import { EncodingCharacters } from "./encoding";
import { Segment, Field, Component } from "./segment";

export class ParserUtils {
  static parseField(fieldStr: string, encoding: EncodingCharacters): Field {
    if (!fieldStr) {
      return { components: [{ subComponents: [""] }] };
    }

    const componentStrings = fieldStr.split(encoding.componentSeparator);
    const components: Component[] = componentStrings.map((compStr) => {
      const subComponents = compStr.split(encoding.subComponentSeparator);
      return { subComponents };
    });

    return { components };
  }

  static getFieldString(field: Field, encoding: EncodingCharacters): string {
    return field.components
      .map((comp) => comp.subComponents.join(encoding.subComponentSeparator))
      .join(encoding.componentSeparator);
  }

  static getComponent(field: Field, index: number): string {
    if (!field.components[index]) return "";
    return field.components[index].subComponents[0] || "";
  }

  static getSubComponent(
    field: Field,
    compIndex: number,
    subCompIndex: number,
  ): string {
    if (!field.components[compIndex]) return "";
    return field.components[compIndex].subComponents[subCompIndex] || "";
  }

  static extractEncodingCharacters(mshSegment: string): EncodingCharacters {
    if (!mshSegment.startsWith("MSH")) {
      throw new Error("Invalid MSH segment");
    }

    const fieldSeparator = mshSegment[3];
    const encodingChars = mshSegment.substring(4, 8);

    return {
      fieldSeparator,
      componentSeparator: encodingChars[0],
      repetitionSeparator: encodingChars[1],
      escapeCharacter: encodingChars[2],
      subComponentSeparator: encodingChars[3],
    };
  }
}

export interface SegmentParser<T extends Segment> {
  parse(segmentString: string, encoding?: EncodingCharacters): Result<T>;
}
