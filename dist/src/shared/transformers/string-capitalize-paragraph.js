"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringCapitalizeParagraphTransform = void 0;
const StringCapitalizeParagraphTransform = (data) => {
    const str = data.obj[data.key];
    if (str != '' && !str)
        return null;
    if (typeof str === 'string') {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return null;
};
exports.StringCapitalizeParagraphTransform = StringCapitalizeParagraphTransform;
//# sourceMappingURL=string-capitalize-paragraph.js.map