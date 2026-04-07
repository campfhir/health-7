export interface BuilderConfig {
  /** Builder class name e.g. "ORU_R01" */
  name: string;
  /**
   * Non-MSH segments used in this builder, in rough encode order.
   * Each becomes a generic type parameter `T{Seg}`.
   */
  segments: string[];
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
}

export interface VersionConfig {
  /** Directory name used in paths e.g. "v2.8" */
  version: string;
  /** Base version to inherit from e.g. "v2.5.1" */
  baseVersion: string;
  /** Segment class names to generate wrappers for */
  segments: string[];
  /** Parser configurations */
  parsers: ParserConfig[];
  /** Builder stub configurations */
  builders?: BuilderConfig[];
}
