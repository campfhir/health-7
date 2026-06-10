import { DEFAULT_ENCODING, type EncodingCharacters } from "./encoding.ts";

/** Field. */
export interface Field {
  /** The components value. */
  components: Component[];
}

/** Component. */
export interface Component {
  /** The sub components value. */
  subComponents: string[];
}

/** Segment. */
export interface Segment {
  /** The HL7 segment identifier. */
  name: string;
  /** The fields value. */
  fields: Field[];
  /** Encodes this message to its HL7 wire string. */
  encode(encoding?: EncodingCharacters): string;
}

/** Base Segment. */
export abstract class BaseSegment implements Segment {
  /** The HL7 segment identifier. */
  abstract name: string;
  /** The fields value. */
  fields: Field[] = [];

  /** Encodes this message to its HL7 wire string. */
  encode(_encoding?: EncodingCharacters): string {
    const encoding = _encoding ?? DEFAULT_ENCODING;
    const encodedFields = this.fields.map((field) =>
      this.encodeField(field, encoding),
    );
    return `${this.name}${encoding.fieldSeparator}${encodedFields.join(encoding.fieldSeparator)}`;
  }

  /** Encode field. */
  private encodeField(field: Field, encoding: EncodingCharacters): string {
    return field.components
      .map((comp) => this.encodeComponent(comp, encoding))
      .join(encoding.componentSeparator);
  }

  /** Encode component. */
  private encodeComponent(
    component: Component,
    encoding: EncodingCharacters,
  ): string {
    return component.subComponents.join(encoding.subComponentSeparator);
  }

  /** Create field. */
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

  /** Create empty field. */
  protected createEmptyField(): Field {
    return {
      components: [{ subComponents: [""] }],
    };
  }
}
