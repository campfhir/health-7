import { DEFAULT_ENCODING, type EncodingCharacters } from "./encoding.ts";

/** Field. */
export interface Field {
  /** The components of the field (of its first repetition, when the field repeats). */
  components: Component[];
  /**
   * Further repetitions of a repeating field, in order. The first repetition always lives in
   * `components`, so code that only reads `components` keeps seeing the first one.
   */
  repetitions?: Field[];
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
/** A raw field value: a string, a list of components, or components with subcomponents. */
export type SegmentFieldValue = string | string[] | string[][];

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
    const first = field.components
      .map((comp) => this.encodeComponent(comp, encoding))
      .join(encoding.componentSeparator);
    if (!field.repetitions?.length) return first;
    return [first, ...field.repetitions.map((rep) => this.encodeField(rep, encoding))].join(
      encoding.repetitionSeparator,
    );
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

  /**
   * Build a repeating field from its repetitions (each a field built with createField /
   * createComponentsField). The first repetition becomes the field's `components`, the rest
   * go in `repetitions`, and encode() joins them with the repetition separator. No
   * repetitions gives an empty field.
   */
  protected createRepeatingField(repetitions: readonly Field[]): Field {
    if (repetitions.length === 0) return this.createEmptyField();
    const [first, ...rest] = repetitions;
    return rest.length > 0 ? { components: first.components, repetitions: rest } : first;
  }

  /** Create empty field. */
  protected createEmptyField(): Field {
    return {
      components: [{ subComponents: [""] }],
    };
  }
}
