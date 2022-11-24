"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewQuantityRadHeader = exports.QuantityRadColumnEnum = void 0;
const styles_1 = require("../../../../base/config/styles");
const palette_1 = require("../../../../../../../shared/constants/palette");
var QuantityRadColumnEnum;
(function (QuantityRadColumnEnum) {
    QuantityRadColumnEnum[QuantityRadColumnEnum["ORIGIN"] = 0] = "ORIGIN";
    QuantityRadColumnEnum[QuantityRadColumnEnum["BODY_PART"] = 1] = "BODY_PART";
    QuantityRadColumnEnum[QuantityRadColumnEnum["EMPLOYEE"] = 2] = "EMPLOYEE";
    QuantityRadColumnEnum[QuantityRadColumnEnum["RO_EMPLOYEE"] = 3] = "RO_EMPLOYEE";
    QuantityRadColumnEnum[QuantityRadColumnEnum["CUSTOMER"] = 4] = "CUSTOMER";
    QuantityRadColumnEnum[QuantityRadColumnEnum["RO_CUSTOMER"] = 5] = "RO_CUSTOMER";
})(QuantityRadColumnEnum = exports.QuantityRadColumnEnum || (exports.QuantityRadColumnEnum = {}));
const NewQuantityRadHeader = () => {
    const header = [];
    header[QuantityRadColumnEnum.ORIGIN] = {
        text: 'Origem',
        size: 25,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            right: { size: 15 },
            bottom: { size: 15 },
        }),
    };
    header[QuantityRadColumnEnum.BODY_PART] = {
        text: 'Órgão',
        size: 15,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
        }),
    };
    header[QuantityRadColumnEnum.EMPLOYEE] = {
        text: `Indivíduo\nOcupacionalmente\nExposto`,
        size: 15,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
        }),
    };
    header[QuantityRadColumnEnum.RO_EMPLOYEE] = {
        text: 'RO do indivíduo',
        size: 15,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
            right: { size: 15 },
        }),
    };
    header[QuantityRadColumnEnum.CUSTOMER] = {
        text: `Indivíduo do Público`,
        size: 15,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
        }),
    };
    header[QuantityRadColumnEnum.RO_CUSTOMER] = {
        text: 'RO do público',
        size: 15,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
        }),
    };
    return header;
};
exports.NewQuantityRadHeader = NewQuantityRadHeader;
//# sourceMappingURL=quantityRad.constant.js.map