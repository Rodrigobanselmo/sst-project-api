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
const SecondRiskInventoryHeader = () => {
    const header = [];
    header[SecondRiskInventoryColumnEnum.OFFICIAL] = { text: 'DESCRIÇÃO DE CARGO OFIIAL (RH):', bold: true, borders: header_1.borderRightStyle };
    header[SecondRiskInventoryColumnEnum.REAL] = { text: 'DESCRIÇÃO DA FUNÇÃO E ATIVIDADES DE RISCO (Entrevista com o Trabalhador):', bold: true, borders: body_1.borderNoneStyle };
    return header;
};
exports.secondRiskInventoryHeader = SecondRiskInventoryHeader();
//# sourceMappingURL=second.constant.js.map