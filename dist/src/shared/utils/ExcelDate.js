"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelDateToJSDate = void 0;
function ExcelDateToJSDate(serialDate) {
    const hours = Math.floor((serialDate % 1) * 24);
    const minutes = Math.floor(((serialDate % 1) * 24 - hours) * 60);
    return new Date(Date.UTC(0, 0, serialDate, hours - 21, minutes));
}
exports.ExcelDateToJSDate = ExcelDateToJSDate;
//# sourceMappingURL=ExcelDate.js.map