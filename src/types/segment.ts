import { DEFAULT_ENCODING, type EncodingCharacters } from "./encoding.ts";

export interface Field {
  components: Component[];
}

export interface Component {
  subComponents: string[];
}

export interface Segment {
  name: string;
  fields: Field[];
  encode(encoding?: EncodingCharacters): string;
}

export abstract class BaseSegment implements Segment {
  abstract name: string;
  fields: Field[] = [];

  encode(_encoding?: EncodingCharacters): string {
    const encoding = _encoding ?? DEFAULT_ENCODING;
    const encodedFields = this.fields.map((field) =>
      this.encodeField(field, encoding),
    );
    return `${this.name}${encoding.fieldSeparator}${encodedFields.join(encoding.fieldSeparator)}`;
  }

  private encodeField(field: Field, encoding: EncodingCharacters): string {
    return field.components
      .map((comp) => this.encodeComponent(comp, encoding))
      .join(encoding.componentSeparator);
  }

  private encodeComponent(
    component: Component,
    encoding: EncodingCharacters,
  ): string {
    return component.subComponents.join(encoding.subComponentSeparator);
  }

  protected createField(value: string | string[] | string[][]): Field {
    if (typeof value === "string") {
      return {
        components: [{ subComponents: [value] }],
      };
    }

    if (
      Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === "string"
    ) {
      return {
        components: (value as string[]).map((v) => ({ subComponents: [v] })),
      };
    }

    return {
      components: (value as string[][]).map((subComps) => ({
        subComponents: subComps,
      })),
    };
  }

  protected createEmptyField(): Field {
    return {
      components: [{ subComponents: [""] }],
    };
  }
}
