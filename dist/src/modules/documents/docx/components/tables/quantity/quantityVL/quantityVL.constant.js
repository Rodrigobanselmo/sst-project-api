"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewQuantityVLHeader = exports.QuantityVLColumnEnum = void 0;
const styles_1 = require("../../../../base/config/styles");
const palette_1 = require("../../../../../../../shared/constants/palette");
var QuantityVLColumnEnum;
(function (QuantityVLColumnEnum) {
    QuantityVLColumnEnum[QuantityVLColumnEnum["ORIGIN"] = 0] = "ORIGIN";
    QuantityVLColumnEnum[QuantityVLColumnEnum["AREN"] = 1] = "AREN";
    QuantityVLColumnEnum[QuantityVLColumnEnum["RO_AREN"] = 2] = "RO_AREN";
    QuantityVLColumnEnum[QuantityVLColumnEnum["VDVR"] = 3] = "VDVR";
    QuantityVLColumnEnum[QuantityVLColumnEnum["RO_VDVR"] = 4] = "RO_VDVR";
})(QuantityVLColumnEnum = exports.QuantityVLColumnEnum || (exports.QuantityVLColumnEnum = {}));
const NewQuantityVLHeader = () => {
    const header = [];
    header[QuantityVLColumnEnum.ORIGIN] = {
        text: 'Origem',
        size: 50,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            right: { size: 15 },
            bottom: { size: 15 },
        }),
    };
    header[QuantityVLColumnEnum.AREN] = {
        text: `aren (m/s^2)`,
        size: 20,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
        }),
    };
    header[QuantityVLColumnEnum.RO_AREN] = {
        text: 'RO',
        size: 30,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
            left: { size: 15 },
        }),
    };
    return header;
};
exports.NewQuantityVLHeader = NewQuantityVLHeader;
//# sourceMappingURL=quantityVL.constant.js.map