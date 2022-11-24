"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCnae = exports.formatPhoneNumber = void 0;
function formatPhoneNumber(v) {
    if (!v)
        return v;
    v = v.replace(/\D/g, '');
    v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
    v = v.replace(/(\d)(\d{4})$/, '$1-$2');
    return v;
}
exports.formatPhoneNumber = formatPhoneNumber;
function formatCnae(cnaeStr) {
    if (!cnaeStr)
        return cnaeStr;
    const cleaned = ('' + cnaeStr).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{4})(\d{1})(\d{2})$/);
    if (match) {
        return match[1] + '-' + match[2] + '/' + match[3];
    }
    return cnaeStr;
}
exports.formatCnae = formatCnae;
//# sourceMappingURL=formats.js.map