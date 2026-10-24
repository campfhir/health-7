export interface BuilderConfig {
  /** Builder class name e.g. "ORU_R01" */
  name: string;
  /**
   * Non-MSH segments used in this builder, in rough encode order.
   * Each becomes a generic type parameter `T{Seg}`.
   */
  segments: string[];
  /**
   * When set, generate a thin re-export wrapper instead of a full stub.
   * Value is the base message name, e.g. "ADT_A01".
   */
  baseMessage?: string;
}

export interface ParserConfig {
  /** Parser class name e.g. "ORU_R01_Parser" */
  name: string;
  /** Standalone parse function name e.g. "parseORU_R01" */
  parseFn: string;
  /** Types to re-export from the base parser */
  exportTypes: string[];
  /**
   * Segments this parser handles, in switch-case order.
   * MSH is always first and handled separately (no encoding arg).
   * All others receive (s, encoding).
   */
  segments: string[];
  /**
   * When set, generate a thin wrapper subclass instead of a full stub.
   * Value is the base message name, e.g. "ADT_A01".
   */
  baseMessage?: string;
}

export interface VersionConfig {
  /** Directory name used in paths e.g. "v2.8" */
  version: string;
  /** Base version to inherit from e.g. "v2.5.1". Omit for base versions. */
  baseVersion?: string;
  /** Segment class names to generate wrappers for */
  segments: string[];
  /** Parser configurations */
  parsers: ParserConfig[];
  /** Builder stub configurations */
  builders?: BuilderConfig[];
}
