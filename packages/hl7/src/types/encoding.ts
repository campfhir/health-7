/** Encoding Characters. */
export interface EncodingCharacters {
  /** The field separator value. */
  fieldSeparator: string;
  /** The component separator value. */
  componentSeparator: string;
  /** The repetition separator value. */
  repetitionSeparator: string;
  /** The escape character value. */
  escapeCharacter: string;
  /** The sub component separator value. */
  subComponentSeparator: string;
}

/** DEFAULT ENCODING. */
export const DEFAULT_ENCODING: EncodingCharacters = {
  fieldSeparator: '|',
  componentSeparator: '^',
  repetitionSeparator: '~',
  escapeCharacter: '\\',
  subComponentSeparator: '&',
};
