"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.secondRiskInventoryHeader = exports.SecondRiskInventoryColumnEnum = void 0;
const body_1 = require("../../elements/body");
var SecondRiskInventoryColumnEnum;
(function (SecondRiskInventoryColumnEnum) {
    SecondRiskInventoryColumnEnum[SecondRiskInventoryColumnEnum["OFFICIAL"] = 0] = "OFFICIAL";
    SecondRiskInventoryColumnEnum[SecondRiskInventoryColumnEnum["REAL"] = 1] = "REAL";
})(SecondRiskInventoryColumnEnum = exports.SecondRiskInventoryColumnEnum || (exports.SecondRiskInventoryColumnEnum = {}));
const SecondRiskInventoryHeader = () => {
    const header = [];
    header[SecondRiskInventoryColumnEnum.OFFICIAL] = { text: 'DESCRIÇÃO DO GSE:', bold: true, borders: body_1.borderNoneStyle };
    return header;
};
exports.secondRiskInventoryHeader = SecondRiskInventoryHeader();
//# sourceMappingURL=second.constant.js.map