"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapInverseTpEvent = exports.mapTpEvent = exports.EnumTpEventEnum = void 0;
const client_1 = require("@prisma/client");
var EnumTpEventEnum;
(function (EnumTpEventEnum) {
    EnumTpEventEnum["S2210"] = "S-2210";
    EnumTpEventEnum["S2220"] = "S-2220";
    EnumTpEventEnum["S2240"] = "S-2240";
})(EnumTpEventEnum = exports.EnumTpEventEnum || (exports.EnumTpEventEnum = {}));
exports.mapTpEvent = {
    [client_1.EmployeeESocialEventTypeEnum.CAT_2210]: EnumTpEventEnum.S2210,
    [client_1.EmployeeESocialEventTypeEnum.EXAM_2220]: EnumTpEventEnum.S2220,
    [client_1.EmployeeESocialEventTypeEnum.RISK_2240]: EnumTpEventEnum.S2240,
};
exports.mapInverseTpEvent = {
    [EnumTpEventEnum.S2210]: client_1.EmployeeESocialEventTypeEnum.CAT_2210,
    [EnumTpEventEnum.S2220]: client_1.EmployeeESocialEventTypeEnum.EXAM_2220,
    [EnumTpEventEnum.S2240]: client_1.EmployeeESocialEventTypeEnum.RISK_2240,
};
//# sourceMappingURL=event-3000.js.map