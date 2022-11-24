"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewQuantityNoiseHeader = exports.QuantityNoiseColumnEnum = void 0;
const styles_1 = require("./../../../../base/config/styles");
const palette_1 = require("../../../../../../../shared/constants/palette");
var QuantityNoiseColumnEnum;
(function (QuantityNoiseColumnEnum) {
    QuantityNoiseColumnEnum[QuantityNoiseColumnEnum["ORIGIN"] = 0] = "ORIGIN";
    QuantityNoiseColumnEnum[QuantityNoiseColumnEnum["DB"] = 1] = "DB";
    QuantityNoiseColumnEnum[QuantityNoiseColumnEnum["RO"] = 2] = "RO";
})(QuantityNoiseColumnEnum = exports.QuantityNoiseColumnEnum || (exports.QuantityNoiseColumnEnum = {}));
const NewQuantityNoiseHeader = (q = '3') => {
    const header = [];
    header[QuantityNoiseColumnEnum.ORIGIN] = {
        text: 'Origem',
        size: 60,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            right: { size: 15 },
            bottom: { size: 15 },
        }),
    };
    header[QuantityNoiseColumnEnum.DB] = {
        text: `MVUE q${q} (dB A)`,
        size: 20,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
        }),
    };
    header[QuantityNoiseColumnEnum.RO] = {
        text: 'RO',
        size: 20,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            left: { size: 15 },
            bottom: { size: 15 },
        }),
    };
    return header;
};
exports.NewQuantityNoiseHeader = NewQuantityNoiseHeader;
//# sourceMappingURL=quantityNoise.constant.js.map