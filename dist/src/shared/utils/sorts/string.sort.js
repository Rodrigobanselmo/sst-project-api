"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortString = void 0;
const sortString = function (a, b, field, field2) {
    let arrayA = field ? a[field] : a;
    let arrayB = field ? b[field] : b;
    if (field2) {
        arrayA = arrayA[field2];
        arrayB = arrayB[field2];
    }
    if (arrayA
        .toLowerCase()
        .normalize('NFD')
        .replace(/[^a-zA-Z0-9s]/g, '') >
        arrayB
            .toLowerCase()
            .normalize('NFD')
            .replace(/[^a-zA-Z0-9s]/g, '')) {
        return 1;
    }
    if (arrayB
        .toLowerCase()
        .normalize('NFD')
        .replace(/[^a-zA-Z0-9s]/g, '') >
        arrayA
            .toLowerCase()
            .normalize('NFD')
            .replace(/[^a-zA-Z0-9s]/g, '')) {
        return -1;
    }
    return 0;
};
exports.sortString = sortString;
//# sourceMappingURL=string.sort.js.map