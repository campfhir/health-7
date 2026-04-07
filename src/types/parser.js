"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserUtils = void 0;
class ParserUtils {
    static parseField(fieldStr, encoding) {
        if (!fieldStr) {
            return { components: [{ subComponents: [""] }] };
        }
        const componentStrings = fieldStr.split(encoding.componentSeparator);
        const components = componentStrings.map((compStr) => {
            const subComponents = compStr.split(encoding.subComponentSeparator);
            return { subComponents };
        });
        return { components };
    }
    static getFieldString(field, encoding) {
        return field.components
            .map((comp) => comp.subComponents.join(encoding.subComponentSeparator))
            .join(encoding.componentSeparator);
    }
    static getComponent(field, index) {
        if (!field.components[index])
            return "";
        return field.components[index].subComponents[0] || "";
    }
    static getSubComponent(field, compIndex, subCompIndex) {
        if (!field.components[compIndex])
            return "";
        return field.components[compIndex].subComponents[subCompIndex] || "";
    }
    static extractEncodingCharacters(mshSegment) {
        if (!mshSegment.startsWith("MSH")) {
            throw new Error("Invalid MSH segment");
        }
        const fieldSeparator = mshSegment[3];
        const encodingChars = mshSegment.substring(4, 8);
        return {
            fieldSeparator,
            componentSeparator: encodingChars[0],
            repetitionSeparator: encodingChars[1],
            escapeCharacter: encodingChars[2],
            subComponentSeparator: encodingChars[3],
        };
    }
}
exports.ParserUtils = ParserUtils;
//# sourceMappingURL=parser.js.map