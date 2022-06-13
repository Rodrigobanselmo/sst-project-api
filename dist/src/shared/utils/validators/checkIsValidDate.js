"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsValidDate = void 0;
const ExcelDate_1 = require("../ExcelDate");
const checkIsValidDate = (value) => {
    console.log(value);
    console.log((0, ExcelDate_1.ExcelDateToJSDate)(value));
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