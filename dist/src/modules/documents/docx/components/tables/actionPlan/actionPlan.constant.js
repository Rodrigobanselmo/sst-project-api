"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionPlanTitle = exports.actionPlanHeader = exports.ActionPlanColumnEnum = void 0;
const palette_1 = require("../../../../../../shared/constants/palette");
const styles_1 = require("../../../base/config/styles");
var ActionPlanColumnEnum;
(function (ActionPlanColumnEnum) {
    ActionPlanColumnEnum[ActionPlanColumnEnum["ITEM"] = 0] = "ITEM";
    ActionPlanColumnEnum[ActionPlanColumnEnum["ORIGIN"] = 1] = "ORIGIN";
    ActionPlanColumnEnum[ActionPlanColumnEnum["RISK"] = 2] = "RISK";
    ActionPlanColumnEnum[ActionPlanColumnEnum["SOURCE"] = 3] = "SOURCE";
    ActionPlanColumnEnum[ActionPlanColumnEnum["SEVERITY"] = 4] = "SEVERITY";
    ActionPlanColumnEnum[ActionPlanColumnEnum["PROBABILITY"] = 5] = "PROBABILITY";
    ActionPlanColumnEnum[ActionPlanColumnEnum["RO"] = 6] = "RO";
    ActionPlanColumnEnum[ActionPlanColumnEnum["INTERVENTION"] = 7] = "INTERVENTION";
    ActionPlanColumnEnum[ActionPlanColumnEnum["RECOMMENDATION"] = 8] = "RECOMMENDATION";
    ActionPlanColumnEnum[ActionPlanColumnEnum["RESPONSIBLE"] = 9] = "RESPONSIBLE";
    ActionPlanColumnEnum[ActionPlanColumnEnum["DUE"] = 10] = "DUE";
})(ActionPlanColumnEnum = exports.ActionPlanColumnEnum || (exports.ActionPlanColumnEnum = {}));
const NewActionPlanHeader = () => {
    const header = [];
    header[ActionPlanColumnEnum.ITEM] = {
        text: 'ITEM',
        size: 2,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    header[ActionPlanColumnEnum.ORIGIN] = {
        text: 'ORIGEM',
        size: 5,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    header[ActionPlanColumnEnum.RISK] = {
        text: 'PERIGOS\nFATORES DE RISCO',
        size: 10,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    header[ActionPlanColumnEnum.SOURCE] = {
        text: 'FONTE GERADORA OU\nATIVIDADE DE RISCO',
        size: 10,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    header[ActionPlanColumnEnum.SEVERITY] = {
        text: 'SEVERIDADE',
        size: 1,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    header[ActionPlanColumnEnum.PROBABILITY] = {
        text: 'PROBABILIDADE',
        size: 1,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    header[ActionPlanColumnEnum.RO] = {
        text: 'RISCO OCUPACIONAL',
        size: 5,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    header[ActionPlanColumnEnum.INTERVENTION] = {
        text: 'INTERVENÇÃO',
        size: 5,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    header[ActionPlanColumnEnum.RECOMMENDATION] = {
        text: 'RECOMENDAÇÕES',
        size: 10,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    header[ActionPlanColumnEnum.RESPONSIBLE] = {
        text: 'RESPONSÁVEL',
        size: 5,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    header[ActionPlanColumnEnum.DUE] = {
        text: 'PRAZO',
        size: 5,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
    };
    return header;
};
exports.actionPlanHeader = NewActionPlanHeader();
exports.actionPlanTitle = ['PLANO DE AÇÃO', 'PGR - PROGRAMA DE GERENCIAMENTO DE RISCOS'];
//# sourceMappingURL=actionPlan.constant.js.map