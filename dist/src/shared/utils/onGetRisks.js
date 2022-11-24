"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onGetRisks = void 0;
const sort_array_1 = __importDefault(require("sort-array"));
function onGetRisks(riskData) {
    const risks = {};
    riskData.forEach((_a) => {
        var { riskFactor } = _a, _rd = __rest(_a, ["riskFactor"]);
        if (riskFactor === null || riskFactor === void 0 ? void 0 : riskFactor.representAll)
            return;
        if (!risks[_rd.riskId])
            risks[_rd.riskId] = {
                riskData: [],
                riskFactor: riskFactor,
            };
        risks[_rd.riskId].riskData.push(_rd);
    });
    return Object.values(risks).map((data) => {
        data.riskData =
            (0, sort_array_1.default)(data.riskData, {
                by: ['prioritization', 'level', 'isQuantity'],
                order: ['prioritization', 'level', 'isQuantity'],
            }) || [];
        return {
            riskFactor: data.riskFactor,
            riskData: data.riskData,
        };
    });
}
exports.onGetRisks = onGetRisks;
//# sourceMappingURL=onGetRisks.js.map