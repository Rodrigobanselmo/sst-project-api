"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsNational = void 0;
const checkIsNational = (value) => {
    const transformToString = String(value);
    if (transformToString.toLocaleLowerCase() === 'importado') {
        return 'false';
    }
    return true;
};
exports.checkIsNational = checkIsNational;
//# sourceMappingURL=checkIsNational.js.map