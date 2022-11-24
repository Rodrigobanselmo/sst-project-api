"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortNumber = void 0;
const sortNumber = function (a, b, field) {
    if (a == undefined || b == undefined)
        return 0;
    const arrayA = field ? a[field] : a;
    const arrayB = field ? b[field] : b;
    if (arrayA > arrayB) {
        return 1;
    }
    if (arrayB > arrayA) {
        return -1;
    }
    return 0;
};
exports.sortNumber = sortNumber;
//# sourceMappingURL=number.sort.js.map