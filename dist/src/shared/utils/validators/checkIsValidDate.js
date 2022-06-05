"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsValidDate = void 0;
const checkIsValidDate = (value) => {
    const transformToString = String(value);
    if (!transformToString) {
        return false;
    }
    const slice = transformToString.replace(/'/, '').split('/');
    if (slice.length == 3) {
        const date = slice[0] + '/' + slice[1] + '/' + slice[2];
        return new Date(date);
    }
    return false;
};
exports.checkIsValidDate = checkIsValidDate;
//# sourceMappingURL=checkIsValidDate.js.map