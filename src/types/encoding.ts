export interface EncodingCharacters {
  fieldSeparator: string;
  componentSeparator: string;
  repetitionSeparator: string;
  escapeCharacter: string;
  subComponentSeparator: string;
}

export const DEFAULT_ENCODING: EncodingCharacters = {
  fieldSeparator: '|',
  componentSeparator: '^',
  repetitionSeparator: '~',
  escapeCharacter: '\\',
  subComponentSeparator: '&',
};
