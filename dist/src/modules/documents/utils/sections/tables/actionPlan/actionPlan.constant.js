"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionPlanTitle = exports.actionPlanHeader = exports.ActionPlanColumnEnum = void 0;
var ActionPlanColumnEnum;
(function (ActionPlanColumnEnum) {
    ActionPlanColumnEnum[ActionPlanColumnEnum["ITEM"] = 0] = "ITEM";
    ActionPlanColumnEnum[ActionPlanColumnEnum["GSE"] = 1] = "GSE";
    ActionPlanColumnEnum[ActionPlanColumnEnum["RISK"] = 2] = "RISK";
    ActionPlanColumnEnum[ActionPlanColumnEnum["SOURCE"] = 3] = "SOURCE";
    ActionPlanColumnEnum[ActionPlanColumnEnum["SEVERITY"] = 4] = "SEVERITY";
    ActionPlanColumnEnum[ActionPlanColumnEnum["PROBABILITY"] = 5] = "PROBABILITY";
    ActionPlanColumnEnum[ActionPlanColumnEnum["OR"] = 6] = "OR";
    ActionPlanColumnEnum[ActionPlanColumnEnum["INTERVENTION"] = 7] = "INTERVENTION";
    ActionPlanColumnEnum[ActionPlanColumnEnum["RECOMMENDATION"] = 8] = "RECOMMENDATION";
    ActionPlanColumnEnum[ActionPlanColumnEnum["RESPONSIBLE"] = 9] = "RESPONSIBLE";
    ActionPlanColumnEnum[ActionPlanColumnEnum["DUE"] = 10] = "DUE";
})(ActionPlanColumnEnum = exports.ActionPlanColumnEnum || (exports.ActionPlanColumnEnum = {}));
const NewActionPlanHeader = () => {
    const header = [];
    header[ActionPlanColumnEnum.ITEM] = { text: 'ITEM', size: 2 };
    header[ActionPlanColumnEnum.GSE] = { text: 'GSE', size: 5 };
    header[ActionPlanColumnEnum.RISK] = { text: 'PERIGOS\nFATORES DE RISCO', size: 10 };
    header[ActionPlanColumnEnum.SOURCE] = { text: 'FONTE GERADORA OU\nATIVIDADE DE RISCO', size: 10 };
    header[ActionPlanColumnEnum.SEVERITY] = { text: 'SEVERIDADE', size: 1 };
    header[ActionPlanColumnEnum.PROBABILITY] = { text: 'PROBABILIDADE', size: 1 };
    header[ActionPlanColumnEnum.OR] = { text: 'RISCO OCUPACIONAL', size: 5 };
    header[ActionPlanColumnEnum.INTERVENTION] = { text: 'INTERVENÇÃO', size: 5 };
    header[ActionPlanColumnEnum.RECOMMENDATION] = { text: 'RECOMENDAÇÕES', size: 10 };
    header[ActionPlanColumnEnum.RESPONSIBLE] = { text: 'RESPONSÁVEL', size: 5 };
    header[ActionPlanColumnEnum.DUE] = { text: 'PRAZO', size: 5 };
    return header;
};
exports.actionPlanHeader = NewActionPlanHeader();
exports.actionPlanTitle = [
    'PLANO DE AÇÃO',
    'PGR - PROGRAMA DE GERENCIAMENTO DE RISCOS',
];
//# sourceMappingURL=actionPlan.constant.js.map