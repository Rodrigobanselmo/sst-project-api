"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secondRiskInventoryHeader = exports.SecondRiskInventoryColumnEnum = void 0;
const body_1 = require("../../elements/body");
const header_1 = require("../../elements/header");
var SecondRiskInventoryColumnEnum;
(function (SecondRiskInventoryColumnEnum) {
    SecondRiskInventoryColumnEnum[SecondRiskInventoryColumnEnum["OFFICIAL"] = 0] = "OFFICIAL";
    SecondRiskInventoryColumnEnum[SecondRiskInventoryColumnEnum["REAL"] = 1] = "REAL";
})(SecondRiskInventoryColumnEnum = exports.SecondRiskInventoryColumnEnum || (exports.SecondRiskInventoryColumnEnum = {}));
const secondRiskInventoryHeader = (isByGroup) => {
    const header = [];
    if (isByGroup)
        header[SecondRiskInventoryColumnEnum.OFFICIAL] = { text: 'DESCRIÇÃO DO GSE:', bold: true, borders: body_1.borderNoneStyle };
    else {
        header[SecondRiskInventoryColumnEnum.OFFICIAL] = { text: 'DESCRIÇÃO DE CARGO OFICIAL (RH):', bold: true, borders: header_1.borderRightStyle };
        header[SecondRiskInventoryColumnEnum.REAL] = { text: 'DESCRIÇÃO DA FUNÇÃO E ATIVIDADES DE RISCO (Entrevista com o Trabalhador):', bold: true, borders: body_1.borderNoneStyle };
    }
    return header;
};
exports.secondRiskInventoryHeader = secondRiskInventoryHeader;
//# sourceMappingURL=second.constant.js.map