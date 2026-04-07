"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSegment = void 0;
const encoding_1 = require("./encoding");
class BaseSegment {
    constructor() {
        this.fields = [];
    }
    encode(_encoding) {
        const encoding = _encoding ?? encoding_1.DEFAULT_ENCODING;
        const encodedFields = this.fields.map((field) => this.encodeField(field, encoding));
        return `${this.name}${encoding.fieldSeparator}${encodedFields.join(encoding.fieldSeparator)}`;
    }
    encodeField(field, encoding) {
        return field.components
            .map((comp) => this.encodeComponent(comp, encoding))
            .join(encoding.componentSeparator);
    }
    encodeComponent(component, encoding) {
        return component.subComponents.join(encoding.subComponentSeparator);
    }
    createField(value) {
        if (typeof value === "string") {
            return {
                components: [{ subComponents: [value] }],
            };
        }
        if (Array.isArray(value) &&
            value.length > 0 &&
            typeof value[0] === "string") {
            return {
                components: value.map((v) => ({ subComponents: [v] })),
            };
        }
        return {
            components: value.map((subComps) => ({
                subComponents: subComps,
            })),
        };
    }
    createEmptyField() {
        return {
            components: [{ subComponents: [""] }],
        };
    }
}
exports.BaseSegment = BaseSegment;
//# sourceMappingURL=segment.js.map