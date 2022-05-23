"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsEnum = void 0;
const checkIsEnum = (value, enums) => {
    const transformToNumber = String(value);
    if (!transformToNumber) {
        return false;
    }
    if (typeof value === 'string') {
        if (Object.values(enums).includes(value)) {
            return value;
        }
    }
    return false;
};
exports.checkIsEnum = checkIsEnum;
//# sourceMappingURL=checkIsEnum.js.map