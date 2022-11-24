"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkExamFields = exports.compareFieldValues = void 0;
const compareFieldValues = (object1, object2, options) => {
    const fieldCheck = Object.keys(Object.assign(Object.assign({}, object1), object2))
        .map((fieldName) => {
        if (options === null || options === void 0 ? void 0 : options.fields) {
            const include = options === null || options === void 0 ? void 0 : options.fields.includes(fieldName);
            if (!include)
                return null;
        }
        if (options === null || options === void 0 ? void 0 : options.ignoreFields) {
            const include = options === null || options === void 0 ? void 0 : options.ignoreFields.includes(fieldName);
            if (include)
                return null;
        }
        const obj1 = object1[fieldName];
        const obj2 = object2[fieldName];
        if (options === null || options === void 0 ? void 0 : options.skipUndefined) {
            const skip = obj1 === undefined || obj2 === undefined;
            if (skip)
                return null;
        }
        const equal = obj1 == obj2;
        return equal;
    })
        .filter((i) => i !== null);
    const isEqual = fieldCheck.every((field) => field);
    return isEqual;
};
exports.compareFieldValues = compareFieldValues;
exports.checkExamFields = ['doctorId', 'doneDate', 'evaluationType', 'examId', 'examType', 'status'];
//# sourceMappingURL=compareFieldValues.js.map