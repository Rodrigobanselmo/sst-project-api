"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DayJSProvider = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
dayjs_1.default.extend(utc_1.default);
class DayJSProvider {
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
}
exports.DayJSProvider = DayJSProvider;
//# sourceMappingURL=DayJSProvider.js.map