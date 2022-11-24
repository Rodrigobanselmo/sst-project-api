"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringNormalizeTransform = void 0;
const StringNormalizeTransform = (data) => {
    const str = data.obj[data.key];
    if (str != '' && !str)
        return null;
    if (typeof str === 'string') {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[^a-zA-Z0-9s]/g, '')
            .trim();
    }
    return null;
};
exports.StringNormalizeTransform = StringNormalizeTransform;
//# sourceMappingURL=string-normalize.transform.js.map