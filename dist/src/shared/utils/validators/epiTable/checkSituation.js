"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSituation = void 0;
const checkSituation = (value) => {
    const transformToString = String(value);
    if (transformToString.toLocaleLowerCase() === 'vencido') {
        return 'false';
    }
    return true;
};
exports.checkSituation = checkSituation;
//# sourceMappingURL=checkSituation.js.map