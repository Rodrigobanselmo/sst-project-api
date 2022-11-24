"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateFormat = void 0;
const DayJSProvider_1 = require("../providers/DateProvider/implementations/DayJSProvider");
const DateFormat = (data, options = { onlyDate: true }) => {
    const str = data.obj[data.key];
    if (!str)
        return;
    if (typeof str === 'string') {
        if (str === '')
            return;
        const splitStr = str.split('/');
        if (splitStr.length === 3) {
            const day = splitStr[0];
            const month = splitStr[1];
            const year = splitStr[2];
            if (day && month && year) {
                const date = new Date(Number(year), Number(month) - 1, Number(day));
                return date;
            }
        }
        if (options.onlyDate) {
            return (0, DayJSProvider_1.dayjs)(str).hour(0).minute(0).second(0).millisecond(0).toDate();
        }
        return (0, DayJSProvider_1.dayjs)(str).toDate();
    }
    return str;
};
exports.DateFormat = DateFormat;
//# sourceMappingURL=date-format.js.map