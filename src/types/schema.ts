export interface SegmentDefinition {
  name: string;
  required: boolean;
  repeating: boolean;
  maxOccurrences?: number;
}

export interface SegmentGroup {
  name: string;
  required: boolean;
  repeating: boolean;
  segments: (SegmentDefinition | SegmentGroup)[];
  /** Override the generated Parsed* type name (defaults to Parsed + PascalCase of name) */
  exportTypeName?: string;
}

export interface MessageSchema {
  messageType: string;
  triggerEvent: string;
  version: string;
  structure: (SegmentDefinition | SegmentGroup)[];
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

export function isSegmentGroup(item: SegmentDefinition | SegmentGroup): item is SegmentGroup {
  return 'segments' in item;
}
