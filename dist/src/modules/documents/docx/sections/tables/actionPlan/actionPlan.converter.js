"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionPlanConverter = void 0;
const actionPlan_constant_1 = require("./actionPlan.constant");
const matriz_1 = require("../../../../../../shared/utils/matriz");
const actionPlanConverter = (riskGroup) => {
    const homogeneousGroupsMap = new Map();
    const actionPlanData = [];
    riskGroup.data.forEach((riskData) => {
        const cells = [];
        cells[actionPlan_constant_1.ActionPlanColumnEnum.ITEM] = { text: '', size: 2 };
        cells[actionPlan_constant_1.ActionPlanColumnEnum.GSE] = { text: riskData.homogeneousGroup.name, size: 5 };
        cells[actionPlan_constant_1.ActionPlanColumnEnum.RISK] = { text: riskData.riskFactor.name, size: 10 };
        cells[actionPlan_constant_1.ActionPlanColumnEnum.SOURCE] = { text: riskData.generateSources.map((gs) => gs.name).join('\n'), size: 10 };
        cells[actionPlan_constant_1.ActionPlanColumnEnum.SEVERITY] = { text: String(riskData.riskFactor.severity), size: 1 };
        cells[actionPlan_constant_1.ActionPlanColumnEnum.PROBABILITY] = { text: String(riskData.probability), size: 1 };
        cells[actionPlan_constant_1.ActionPlanColumnEnum.OR] = { text: (0, matriz_1.getMatrizRisk)(riskData.riskFactor.severity, riskData.probability).label, size: 5 };
        cells[actionPlan_constant_1.ActionPlanColumnEnum.INTERVENTION] = { text: (0, matriz_1.getMatrizRisk)(riskData.riskFactor.severity, riskData.probability).intervention, size: 5 };
        cells[actionPlan_constant_1.ActionPlanColumnEnum.RECOMMENDATION] = { text: riskData.recs.map((rec) => rec.recName).join('\n'), size: 10 };
        cells[actionPlan_constant_1.ActionPlanColumnEnum.RESPONSIBLE] = { text: '', size: 5 };
        cells[actionPlan_constant_1.ActionPlanColumnEnum.DUE] = { text: '', size: 5 };
        const rows = homogeneousGroupsMap.get(riskData.homogeneousGroupId) || [];
        homogeneousGroupsMap.set(riskData.homogeneousGroupId, [...rows, cells]);
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