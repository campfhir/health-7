import { BaseSegment } from "../types/segment";

/**
 * A generic HL7 segment for custom or Z-segments not defined in the library.
 *
 * Fields use 1-based HL7 numbering (matching the spec).
 * Gaps between set fields are filled with empty fields automatically.
 *
 * @example
 * const zpd = new CustomSegment('ZPD')
 *   .setField(1, 'value')
 *   .setField(2, ['comp1', 'comp2'])
 *   .setField(3, [['sub1a', 'sub1b'], ['sub2']]);
 */
export class CustomSegment extends BaseSegment {
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }

  setField(fieldNumber: number, value: string | string[] | string[][]): this {
    const index = fieldNumber - 1;
    while (this.fields.length <= index) {
      this.fields.push(this.createEmptyField());
    }
    this.fields[index] = this.createField(value);
    return this;
  }
}
