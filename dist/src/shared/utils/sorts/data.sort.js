"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortData = void 0;
const sortData = function (a, b, field) {
    const arrayA = field ? a[field] : a;
    const arrayB = field ? b[field] : b;
    if (arrayA instanceof Date && arrayB instanceof Date) {
        if (new Date(arrayA) > new Date(arrayB)) {
            return 1;
        }
        if (new Date(arrayB) > new Date(arrayA)) {
            return -1;
        }
    }
    return 0;
};
exports.sortData = sortData;
//# sourceMappingURL=data.sort.js.map