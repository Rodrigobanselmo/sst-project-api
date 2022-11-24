"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dayjs = exports.DayJSProvider = void 0;
require("dayjs/locale/pt-br");
const dayjs_1 = __importDefault(require("dayjs"));
exports.dayjs = dayjs_1.default;
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
const customParseFormat_1 = __importDefault(require("dayjs/plugin/customParseFormat"));
dayjs_1.default.locale('pt-br');
dayjs_1.default.extend(customParseFormat_1.default);
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
class DayJSProvider {
    constructor() {
        this.dayjs = dayjs_1.default;
    }
    addSeconds(date, seconds) {
        return (0, dayjs_1.default)(date).add(seconds, 'seconds').toDate();
    }
    addHours(date, hours) {
        return (0, dayjs_1.default)(date).add(hours, 'hours').toDate();
    }
    addDay(date, days) {
        return (0, dayjs_1.default)(date).add(days, 'days').toDate();
    }
    addTime(date, value, type) {
        return (0, dayjs_1.default)(date)
            .add(value, type)
            .toDate();
    }
    onlyDate(date) {
        return (0, dayjs_1.default)(date).set('h', 0).set('m', 0).set('s', 0).set('ms', 0).toDate();
    }
    compareIfBefore(start_date, end_date) {
        return (0, dayjs_1.default)(start_date).isBefore(end_date);
    }
    compareTime(start_date, end_date, compareIn) {
        const endDateFormat = this.convertToUTC(end_date);
        const startDateFormat = this.convertToUTC(start_date);
        return (0, dayjs_1.default)(endDateFormat).diff(startDateFormat, compareIn);
    }
    convertToUTC(date) {
        return (0, dayjs_1.default)(date).utc().local().format();
    }
    dateNow() {
        return (0, dayjs_1.default)().toDate();
    }
    format(date, format) {
        return (0, dayjs_1.default)(date).format(format || 'DD/MM/YYYY');
    }
}
exports.DayJSProvider = DayJSProvider;
//# sourceMappingURL=DayJSProvider.js.map