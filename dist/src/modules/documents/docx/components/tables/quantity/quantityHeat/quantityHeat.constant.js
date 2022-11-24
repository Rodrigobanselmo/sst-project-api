"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewQuantityHeatHeader = exports.QuantityHeatColumnEnum = void 0;
const styles_1 = require("../../../../base/config/styles");
const palette_1 = require("../../../../../../../shared/constants/palette");
var QuantityHeatColumnEnum;
(function (QuantityHeatColumnEnum) {
    QuantityHeatColumnEnum[QuantityHeatColumnEnum["ORIGIN"] = 0] = "ORIGIN";
    QuantityHeatColumnEnum[QuantityHeatColumnEnum["IBTUG"] = 1] = "IBTUG";
    QuantityHeatColumnEnum[QuantityHeatColumnEnum["LT"] = 2] = "LT";
    QuantityHeatColumnEnum[QuantityHeatColumnEnum["RO"] = 3] = "RO";
})(QuantityHeatColumnEnum = exports.QuantityHeatColumnEnum || (exports.QuantityHeatColumnEnum = {}));
const NewQuantityHeatHeader = () => {
    const header = [];
    header[QuantityHeatColumnEnum.ORIGIN] = {
        text: 'Origem',
        size: 50,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            right: { size: 15 },
            bottom: { size: 15 },
        }),
    };
    header[QuantityHeatColumnEnum.IBTUG] = {
        text: `IBUTG ºC`,
        size: 10,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
        }),
    };
    header[QuantityHeatColumnEnum.LT] = {
        text: `LT ºC`,
        size: 10,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
        }),
    };
    header[QuantityHeatColumnEnum.RO] = {
        text: 'RO',
        size: 30,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            left: { size: 15 },
            bottom: { size: 15 },
        }),
    };
    return header;
};
exports.NewQuantityHeatHeader = NewQuantityHeatHeader;
//# sourceMappingURL=quantityHeat.constant.js.map