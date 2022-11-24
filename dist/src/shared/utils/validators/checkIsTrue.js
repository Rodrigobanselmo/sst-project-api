"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsTrue = void 0;
const checkIsTrue = (value) => {
    const transformToString = String(value);
    if (!transformToString && transformToString !== '') {
        return false;
    }
    if (typeof transformToString === 'string') {
        if (transformToString != 'VERDADEIRO' && transformToString != 'FALSO')
            return false;
        return transformToString == 'VERDADEIRO' ? 'true' : 'false';
    }
    return false;
};
exports.checkIsTrue = checkIsTrue;
//# sourceMappingURL=checkIsTrue.js.map