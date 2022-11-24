"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringRemoveSpacesTransform = void 0;
const StringRemoveSpacesTransform = (data) => {
    const str = data.obj[data.key];
    if (str != '' && !str)
        return null;
    if (typeof str === 'string') {
        return str.replace(/\s+/g, ' ').trim();
    }
    return null;
};
exports.StringRemoveSpacesTransform = StringRemoveSpacesTransform;
//# sourceMappingURL=string-remove-spaces.transform.js.map