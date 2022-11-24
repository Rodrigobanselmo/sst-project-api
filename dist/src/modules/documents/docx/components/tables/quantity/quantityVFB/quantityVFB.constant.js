"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewQuantityVFBHeader = exports.QuantityVFBColumnEnum = void 0;
const styles_1 = require("../../../../base/config/styles");
const palette_1 = require("../../../../../../../shared/constants/palette");
var QuantityVFBColumnEnum;
(function (QuantityVFBColumnEnum) {
    QuantityVFBColumnEnum[QuantityVFBColumnEnum["ORIGIN"] = 0] = "ORIGIN";
    QuantityVFBColumnEnum[QuantityVFBColumnEnum["AREN"] = 1] = "AREN";
    QuantityVFBColumnEnum[QuantityVFBColumnEnum["RO_AREN"] = 2] = "RO_AREN";
    QuantityVFBColumnEnum[QuantityVFBColumnEnum["VDVR"] = 3] = "VDVR";
    QuantityVFBColumnEnum[QuantityVFBColumnEnum["RO_VDVR"] = 4] = "RO_VDVR";
})(QuantityVFBColumnEnum = exports.QuantityVFBColumnEnum || (exports.QuantityVFBColumnEnum = {}));
const NewQuantityVFBHeader = () => {
    const header = [];
    header[QuantityVFBColumnEnum.ORIGIN] = {
        text: 'Origem',
        size: 40,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            right: { size: 15 },
            bottom: { size: 15 },
        }),
    };
    header[QuantityVFBColumnEnum.AREN] = {
        text: `aren (m/s^2)`,
        size: 10,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
        }),
    };
    header[QuantityVFBColumnEnum.RO_AREN] = {
        text: 'RO do aren',
        size: 20,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
            right: { size: 15 },
        }),
    };
    header[QuantityVFBColumnEnum.VDVR] = {
        text: `VDVR (m/s^1.75)`,
        size: 10,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
        }),
    };
    header[QuantityVFBColumnEnum.RO_VDVR] = {
        text: 'RO do VDVR',
        size: 20,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
        }),
    };
    return header;
};
exports.NewQuantityVFBHeader = NewQuantityVFBHeader;
//# sourceMappingURL=quantityVFB.constant.js.map