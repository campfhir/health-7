// Core types — version-agnostic
export { EncodingCharacters, DEFAULT_ENCODING } from "./types/encoding";
export { Segment, Field, Component, BaseSegment } from "./types/segment";
export { Message, HL7Message } from "./types/message";
export { MessageSchema, SegmentDefinition, SegmentGroup } from "./types/schema";
export { ParserUtils, SegmentParser } from "./types/parser";

export * from "./utils/ValueExtractor";
export { dateUtils, type LayoutName, type FormatOptions, Layout, ANSIC, UnixDate, RubyDate, RFC822, RFC822Z, RFC850, RFC1123, RFC1123Z, RFC3339, RFC3339Nano, Kitchen, Stamp, StampMilli, StampMicro, StampNano, DateTime, DateOnly, TimeOnly } from "./utils/dateUtils";
export { CustomSegment } from "./utils/CustomSegment";
export { MessageEditor, InsertionBuilder, PositionedInsertionBuilder } from "./utils/MessageEditor";

// Versioned segments, schemas, parsers, and builders must be imported directly:
//   import { OBX } from "@nems.org/hl7/segments/v2.5.1"
//   import { parseORU_R01 } from "@nems.org/hl7/parsers/v2.5.1"
//   import { parseMFN_M02 } from "@nems.org/hl7/parsers/v2.3"
