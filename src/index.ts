// Core types — version-agnostic
export { type EncodingCharacters, DEFAULT_ENCODING } from "./types/encoding.ts";
export { type Segment, type Field, type Component, BaseSegment } from "./types/segment.ts";
export { type Message, HL7Message } from "./types/message.ts";
export { type MessageSchema, type SegmentDefinition, type SegmentGroup } from "./types/schema.ts";
export { ParserUtils, type SegmentParser } from "./types/parser.ts";

export * from "./utils/ValueExtractor.ts";
export { dateUtils, type LayoutName, type FormatOptions, Layout, ANSIC, UnixDate, RubyDate, RFC822, RFC822Z, RFC850, RFC1123, RFC1123Z, RFC3339, RFC3339Nano, Kitchen, Stamp, StampMilli, StampMicro, StampNano, DateTime, DateOnly, TimeOnly } from "./utils/dateUtils.ts";
export { CustomSegment } from "./utils/CustomSegment.ts";
export { MessageEditor, InsertionBuilder, PositionedInsertionBuilder } from "./utils/MessageEditor.ts";

// Versioned segments, schemas, parsers, and builders must be imported directly:
//   import { OBX } from "@nems.org/hl7/segments/v2.5.1"
//   import { parseORU_R01 } from "@nems.org/hl7/parsers/v2.5.1"
//   import { parseMFN_M02 } from "@nems.org/hl7/parsers/v2.3"
