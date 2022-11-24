"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.thirdRiskInventoryColumnsHeader = exports.thirdRiskInventoryHeader = exports.ThirdRiskInventoryColumnEnum = exports.ThirdRiskInventoryHeaderEnum = void 0;
const body_1 = require("../../elements/body");
const header_1 = require("../../elements/header");
var ThirdRiskInventoryHeaderEnum;
(function (ThirdRiskInventoryHeaderEnum) {
    ThirdRiskInventoryHeaderEnum[ThirdRiskInventoryHeaderEnum["FIRST"] = 0] = "FIRST";
    ThirdRiskInventoryHeaderEnum[ThirdRiskInventoryHeaderEnum["SECOND"] = 1] = "SECOND";
    ThirdRiskInventoryHeaderEnum[ThirdRiskInventoryHeaderEnum["THIRD"] = 2] = "THIRD";
})(ThirdRiskInventoryHeaderEnum = exports.ThirdRiskInventoryHeaderEnum || (exports.ThirdRiskInventoryHeaderEnum = {}));
var ThirdRiskInventoryColumnEnum;
(function (ThirdRiskInventoryColumnEnum) {
    ThirdRiskInventoryColumnEnum[ThirdRiskInventoryColumnEnum["TYPE"] = 0] = "TYPE";
    ThirdRiskInventoryColumnEnum[ThirdRiskInventoryColumnEnum["ORIGIN"] = 1] = "ORIGIN";
    ThirdRiskInventoryColumnEnum[ThirdRiskInventoryColumnEnum["RISK_FACTOR"] = 2] = "RISK_FACTOR";
    ThirdRiskInventoryColumnEnum[ThirdRiskInventoryColumnEnum["RISK"] = 3] = "RISK";
    ThirdRiskInventoryColumnEnum[ThirdRiskInventoryColumnEnum["SOURCE"] = 4] = "SOURCE";
    ThirdRiskInventoryColumnEnum[ThirdRiskInventoryColumnEnum["EPI"] = 5] = "EPI";
    ThirdRiskInventoryColumnEnum[ThirdRiskInventoryColumnEnum["ENG"] = 6] = "ENG";
    ThirdRiskInventoryColumnEnum[ThirdRiskInventoryColumnEnum["ADM"] = 7] = "ADM";
    ThirdRiskInventoryColumnEnum[ThirdRiskInventoryColumnEnum["SEVERITY"] = 8] = "SEVERITY";
    ThirdRiskInventoryColumnEnum[ThirdRiskInventoryColumnEnum["PROBABILITY"] = 9] = "PROBABILITY";
    ThirdRiskInventoryColumnEnum[ThirdRiskInventoryColumnEnum["RISK_OCCUPATIONAL"] = 10] = "RISK_OCCUPATIONAL";
    ThirdRiskInventoryColumnEnum[ThirdRiskInventoryColumnEnum["RECOMMENDATIONS"] = 11] = "RECOMMENDATIONS";
    ThirdRiskInventoryColumnEnum[ThirdRiskInventoryColumnEnum["SEVERITY_AFTER"] = 12] = "SEVERITY_AFTER";
    ThirdRiskInventoryColumnEnum[ThirdRiskInventoryColumnEnum["PROBABILITY_AFTER"] = 13] = "PROBABILITY_AFTER";
    ThirdRiskInventoryColumnEnum[ThirdRiskInventoryColumnEnum["RISK_OCCUPATIONAL_AFTER"] = 14] = "RISK_OCCUPATIONAL_AFTER";
})(ThirdRiskInventoryColumnEnum = exports.ThirdRiskInventoryColumnEnum || (exports.ThirdRiskInventoryColumnEnum = {}));
const ThirdRiskInventoryHeader = () => {
    const header = [];
    header[ThirdRiskInventoryHeaderEnum.FIRST] = {
        text: 'Severidade (S) x Probabilidade (P) = RISCO OCUPACIONAL (RO):',
        bold: true,
        borders: body_1.borderNoneStyle,
        columnSpan: 5,
    };
    header[ThirdRiskInventoryHeaderEnum.SECOND] = {
        text: 'RISCO PURO (REAL) Incluindo as Medidas de Controles Existentes',
        bold: true,
        borders: header_1.borderRightStyle,
        columnSpan: 6,
    };
    header[ThirdRiskInventoryHeaderEnum.THIRD] = {
        text: 'RISCO RESIDUAL',
        bold: true,
        borders: body_1.borderNoneStyle,
        columnSpan: 4,
    };
    return header;
};
exports.thirdRiskInventoryHeader = ThirdRiskInventoryHeader();
const ThirdRiskInventoryColumnsHeader = () => {
    const header = [];
    header[ThirdRiskInventoryColumnEnum.TYPE] = {
        text: 'Tipo',
        bold: true,
        borders: Object.assign(Object.assign({}, body_1.borderNoneStyle), { right: header_1.whiteColumnBorder }),
        size: 4,
        margins: { top: 100, bottom: 100 },
    };
    header[ThirdRiskInventoryColumnEnum.ORIGIN] = {
        text: 'Origem',
        bold: true,
        borders: Object.assign(Object.assign({}, body_1.borderNoneStyle), { right: header_1.whiteColumnBorder }),
        size: 6,
        margins: { top: 100, bottom: 100 },
    };
    header[ThirdRiskInventoryColumnEnum.RISK_FACTOR] = {
        text: 'PERIGOS | FATORES DE RISCO',
        borders: Object.assign(Object.assign({}, body_1.borderNoneStyle), { right: header_1.whiteColumnBorder }),
        size: 10,
        margins: { top: 100, bottom: 100 },
    };
    header[ThirdRiskInventoryColumnEnum.RISK] = {
        text: 'Risco',
        borders: Object.assign(Object.assign({}, body_1.borderNoneStyle), { right: header_1.whiteColumnBorder }),
        size: 7,
        margins: { top: 100, bottom: 100 },
    };
    header[ThirdRiskInventoryColumnEnum.SOURCE] = {
        text: 'Fonte Geradora ou Condição de Risco',
        borders: Object.assign(Object.assign({}, body_1.borderNoneStyle), { right: header_1.whiteColumnBorder }),
        size: 10,
        margins: { top: 100, bottom: 100 },
    };
    header[ThirdRiskInventoryColumnEnum.EPI] = {
        text: 'EPI Específico',
        borders: Object.assign(Object.assign({}, body_1.borderNoneStyle), { right: header_1.whiteColumnBorder }),
        size: 7,
        margins: { top: 100, bottom: 100 },
    };
    header[ThirdRiskInventoryColumnEnum.ENG] = {
        text: 'EPC/ENG.',
        borders: Object.assign(Object.assign({}, body_1.borderNoneStyle), { right: header_1.whiteColumnBorder }),
        size: 7,
        margins: { top: 100, bottom: 100 },
    };
    header[ThirdRiskInventoryColumnEnum.ADM] = {
        text: 'ADM',
        borders: Object.assign(Object.assign({}, body_1.borderNoneStyle), { right: header_1.whiteColumnBorder }),
        size: 7,
        margins: { top: 100, bottom: 100 },
    };
    header[ThirdRiskInventoryColumnEnum.SEVERITY] = {
        text: 'S',
        borders: Object.assign(Object.assign({}, body_1.borderNoneStyle), { right: header_1.whiteColumnBorder }),
        size: 1,
        margins: { top: 100, bottom: 100 },
    };
    header[ThirdRiskInventoryColumnEnum.PROBABILITY] = {
        text: 'P',
        borders: Object.assign(Object.assign({}, body_1.borderNoneStyle), { right: header_1.whiteColumnBorder }),
        size: 1,
        margins: { top: 100, bottom: 100 },
    };
    header[ThirdRiskInventoryColumnEnum.RISK_OCCUPATIONAL] = {
        text: 'RO',
        borders: header_1.borderRightStyle,
        size: 3,
        margins: { top: 100, bottom: 100 },
    };
    header[ThirdRiskInventoryColumnEnum.RECOMMENDATIONS] = {
        text: 'Recomendações',
        borders: Object.assign(Object.assign({}, body_1.borderNoneStyle), { right: header_1.whiteColumnBorder }),
        size: 5,
        margins: { top: 100, bottom: 100 },
    };
    header[ThirdRiskInventoryColumnEnum.SEVERITY_AFTER] = {
        text: 'S',
        borders: Object.assign(Object.assign({}, body_1.borderNoneStyle), { right: header_1.whiteColumnBorder }),
        size: 1,
        margins: { top: 100, bottom: 100 },
    };
    header[ThirdRiskInventoryColumnEnum.PROBABILITY_AFTER] = {
        text: 'P',
        borders: Object.assign(Object.assign({}, body_1.borderNoneStyle), { right: header_1.whiteColumnBorder }),
        size: 1,
        margins: { top: 100, bottom: 100 },
    };
    header[ThirdRiskInventoryColumnEnum.RISK_OCCUPATIONAL_AFTER] = {
        text: 'RO',
        borders: Object.assign({}, body_1.borderNoneStyle),
        size: 3,
        margins: { top: 100, bottom: 100 },
    };
    return header;
};
exports.thirdRiskInventoryColumnsHeader = ThirdRiskInventoryColumnsHeader();
//# sourceMappingURL=third.constant.js.map