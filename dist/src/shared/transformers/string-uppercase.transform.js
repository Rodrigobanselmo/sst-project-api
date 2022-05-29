"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringUppercaseTransform = void 0;
const StringUppercaseTransform = (data) => {
    const str = data.obj[data.key];
    if (!str)
        return null;
    if (typeof str === 'string') {
        return str.toUpperCase();
    }
    return null;
};
exports.StringUppercaseTransform = StringUppercaseTransform;
//# sourceMappingURL=string-uppercase.transform.js.map