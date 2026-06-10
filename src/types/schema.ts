/** Segment Definition. */
export interface SegmentDefinition {
  /** The HL7 segment identifier. */
  name: string;
  /** The required value. */
  required: boolean;
  /** The repeating value. */
  repeating: boolean;
  /** The max occurrences value. */
  maxOccurrences?: number;
}

/** Segment Group. */
export interface SegmentGroup {
  /** The HL7 segment identifier. */
  name: string;
  /** The required value. */
  required: boolean;
  /** The repeating value. */
  repeating: boolean;
  /** The segments value. */
  segments: (SegmentDefinition | SegmentGroup)[];
  /** Override the generated Parsed* type name (defaults to Parsed + PascalCase of name) */
  exportTypeName?: string;
}

/** Message Schema. */
export interface MessageSchema {
  /** The message type value. */
  messageType: string;
  /** The trigger event value. */
  triggerEvent: string;
  /** The version value. */
  version: string;
  /** The structure value. */
  structure: (SegmentDefinition | SegmentGroup)[];
  /**
   * When set, codegen generates a thin wrapper (parser subclass + builder re-export)
   * instead of a full stub. Value is the base message name, e.g. "ADT_A01".
   */
  baseMessage?: string;
}

/**
 * Version-level schema used to drive code generation.
 * `segments` is the full set of segment wrappers to generate for this version.
 * `messages` are the message schemas whose parsers and builders should be generated.
 * `baseVersion` is omitted for base versions (e.g. v2.3) that have hand-written segments.
 */
export interface VersionSchema {
  version: string;
  baseVersion?: string;
  segments: string[];
  messages: MessageSchema[];
}

/** Is Segment Group. */
export function isSegmentGroup(item: SegmentDefinition | SegmentGroup): item is SegmentGroup {
  return 'segments' in item;
}
