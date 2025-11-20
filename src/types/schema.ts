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
}

export interface MessageSchema {
  messageType: string;
  triggerEvent: string;
  version: string;
  structure: (SegmentDefinition | SegmentGroup)[];
}

export function isSegmentGroup(item: SegmentDefinition | SegmentGroup): item is SegmentGroup {
  return 'segments' in item;
}
