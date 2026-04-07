import { EncodingCharacters } from "./encoding";
import { Segment, Field } from "./segment";
export type ParseResult<T> = {
    success: true;
    data: T;
    error?: never;
} | {
    success: false;
    data?: never;
    error: string;
};
export declare class ParserUtils {
    static parseField(fieldStr: string, encoding: EncodingCharacters): Field;
    static getFieldString(field: Field, encoding: EncodingCharacters): string;
    static getComponent(field: Field, index: number): string;
    static getSubComponent(field: Field, compIndex: number, subCompIndex: number): string;
    static extractEncodingCharacters(mshSegment: string): EncodingCharacters;
}
export interface SegmentParser<T extends Segment> {
    parse(segmentString: string, encoding?: EncodingCharacters): ParseResult<T>;
}
//# sourceMappingURL=parser.d.ts.map