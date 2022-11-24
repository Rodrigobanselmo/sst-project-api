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
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionPlanConverter = void 0;
const string_sort_1 = require("./../../../../../../shared/utils/sorts/string.sort");
const number_sort_1 = require("./../../../../../../shared/utils/sorts/number.sort");
const client_1 = require("@prisma/client");
const palette_1 = require("../../../../../../shared/constants/palette");
const DayJSProvider_1 = require("../../../../../../shared/providers/DateProvider/implementations/DayJSProvider");
const matriz_1 = require("../../../../../../shared/utils/matriz");
const styles_1 = require("../../../base/config/styles");
const origin_risk_1 = require("./../../../../../../shared/constants/maps/origin-risk");
const actionPlan_constant_1 = require("./actionPlan.constant");
const actionPlanConverter = (riskGroup, hierarchyTree) => {
    const homogeneousGroupsMap = new Map();
    const actionPlanData = [];
    riskGroup.data
        .sort((a, b) => (0, string_sort_1.sortString)(a.riskFactor.name, b.riskFactor.name))
        .sort((a, b) => (0, number_sort_1.sortNumber)(b.level, a.level))
        .map((riskData) => {
        let origin;
        if (riskData.homogeneousGroup.environment)
            origin = `${riskData.homogeneousGroup.environment.name}\n(${origin_risk_1.originRiskMap[riskData.homogeneousGroup.environment.type].name})`;
        if (riskData.homogeneousGroup.characterization)
            origin = `${riskData.homogeneousGroup.characterization.name}\n(${origin_risk_1.originRiskMap[riskData.homogeneousGroup.characterization.type].name})`;
        if (!riskData.homogeneousGroup.type)
            origin = `${riskData.homogeneousGroup.name}\n(GSE)`;
        if (riskData.homogeneousGroup.type == client_1.HomoTypeEnum.HIERARCHY) {
            const hierarchy = hierarchyTree[riskData.homogeneousGroup.id];
            if (hierarchy)
                origin = `${hierarchy.name}\n(${origin_risk_1.originRiskMap[hierarchy.type].name})`;
        }
        return Object.assign(Object.assign({}, riskData), { origin });
    })
        .sort((a, b) => (0, string_sort_1.sortString)(a.origin, b.origin))
        .forEach((_a) => {
        var { origin } = _a, riskData = __rest(_a, ["origin"]);
        const dataRecs = riskData.dataRecs;
        riskData.recs.forEach((rec) => {
            const cells = [];
            const dataRecFound = dataRecs === null || dataRecs === void 0 ? void 0 : dataRecs.find((dataRec) => dataRec.recMedId == rec.id);
            const responsibleName = (dataRecFound === null || dataRecFound === void 0 ? void 0 : dataRecFound.responsibleName) || '';
            const level = riskData.level || 0;
            const getDue = () => {
                const months = riskGroup[`months_period_level_${level}`];
                if (dataRecFound && dataRecFound.endDate) {
                    return (0, DayJSProvider_1.dayjs)(dataRecFound.endDate);
                }
                if (months)
                    return (0, DayJSProvider_1.dayjs)(riskGroup === null || riskGroup === void 0 ? void 0 : riskGroup.validityStart).add(months + 1, 'months');
                return false;
            };
            const due = getDue();
            const dueText = due ? due.format('D [de] MMMM YYYY') : level === 6 ? 'ação imediata' : 'sem prazo';
            cells[actionPlan_constant_1.ActionPlanColumnEnum.ITEM] = {
                text: '',
                size: 2,
                borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
            };
            cells[actionPlan_constant_1.ActionPlanColumnEnum.ORIGIN] = {
                text: origin || '',
                size: 5,
                borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
            };
            cells[actionPlan_constant_1.ActionPlanColumnEnum.RISK] = {
                text: riskData.riskFactor.name,
                size: 10,
                borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
            };
            cells[actionPlan_constant_1.ActionPlanColumnEnum.SOURCE] = {
                text: riskData.generateSources.map((gs) => gs.name).join('\n'),
                size: 10,
                borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
            };
            cells[actionPlan_constant_1.ActionPlanColumnEnum.SEVERITY] = {
                text: String(riskData.riskFactor.severity),
                size: 1,
                borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
            };
            cells[actionPlan_constant_1.ActionPlanColumnEnum.PROBABILITY] = {
                text: String(riskData.probability || '-'),
                size: 1,
                borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
            };
            cells[actionPlan_constant_1.ActionPlanColumnEnum.RO] = {
                text: (0, matriz_1.getMatrizRisk)(riskData.riskFactor.severity, riskData.probability).label,
                size: 5,
                borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
            };
            cells[actionPlan_constant_1.ActionPlanColumnEnum.INTERVENTION] = {
                text: (0, matriz_1.getMatrizRisk)(riskData.riskFactor.severity, riskData.probability).intervention,
                size: 5,
                borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
            };
            cells[actionPlan_constant_1.ActionPlanColumnEnum.RECOMMENDATION] = {
                text: rec.recName,
                size: 10,
                borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
            };
            cells[actionPlan_constant_1.ActionPlanColumnEnum.RESPONSIBLE] = {
                text: responsibleName,
                size: 5,
                borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
            };
            cells[actionPlan_constant_1.ActionPlanColumnEnum.DUE] = {
                text: dueText,
                size: 5,
                borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
            };
            const rows = homogeneousGroupsMap.get(riskData.homogeneousGroupId) || [];
            homogeneousGroupsMap.set(riskData.homogeneousGroupId, [...rows, cells]);
        });
    });
    let i = 1;
    homogeneousGroupsMap.forEach((rows) => {
        actionPlanData.push(...rows.map((cells) => {
            const clone = [...cells];
            clone[0] = Object.assign(Object.assign({}, clone[0]), { text: String(i) });
            i++;
            return clone;
        }, []));
    });
    return actionPlanData;
};
exports.actionPlanConverter = actionPlanConverter;
//# sourceMappingURL=actionPlan.converter.js.map