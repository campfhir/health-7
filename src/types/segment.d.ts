import { EncodingCharacters } from "./encoding";
export interface Field {
    components: Component[];
}
export interface Component {
    subComponents: string[];
}
export interface Segment {
    name: string;
    fields: Field[];
    encode(encoding?: EncodingCharacters): string;
}
export declare abstract class BaseSegment implements Segment {
    abstract name: string;
    fields: Field[];
    encode(_encoding?: EncodingCharacters): string;
    private encodeField;
    private encodeComponent;
    protected createField(value: string | string[] | string[][]): Field;
    protected createEmptyField(): Field;
}
//# sourceMappingURL=segment.d.ts.map