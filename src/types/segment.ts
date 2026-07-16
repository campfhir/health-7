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

  /**
   * Build a field from positional components.
   *
   * Each array element maps to the HL7 component at that position (index 0 ->
   * component 1). Nullish/omitted entries become empty components, which
   * PRESERVES interior gaps — e.g. a CX where the assigning authority is
   * component 4 is written as `id, undefined, undefined, authority` and encodes
   * as `id^^^authority`. Trailing empty components are trimmed so a single
   * value encodes as just `id`, not `id^^^`.
   *
   * Use this for any composite field (CE, CX, XPN, XAD, XCN, …). Do NOT build
   * fields with `if (x) components.push(x)` — that collapses gaps and shifts
   * later components to the wrong position.
   */
  protected createComponentsField(
    values: readonly (string | undefined | null)[],
  ): Field {
    const comps = values.map((v) => v ?? "");
    while (comps.length > 0 && comps[comps.length - 1] === "") comps.pop();
    if (comps.length === 0) return this.createEmptyField();
    return { components: comps.map((v) => ({ subComponents: [v] })) };
  }

  /** Create empty field. */
  protected createEmptyField(): Field {
    return {
      components: [{ subComponents: [""] }],
    };
  }
}
