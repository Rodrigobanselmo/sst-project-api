"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewQuantityQuiHeader = exports.QuantityQuiColumnEnum = void 0;
const styles_1 = require("../../../../base/config/styles");
const palette_1 = require("../../../../../../../shared/constants/palette");
var QuantityQuiColumnEnum;
(function (QuantityQuiColumnEnum) {
    QuantityQuiColumnEnum[QuantityQuiColumnEnum["ORIGIN"] = 0] = "ORIGIN";
    QuantityQuiColumnEnum[QuantityQuiColumnEnum["CHEMICAL"] = 1] = "CHEMICAL";
    QuantityQuiColumnEnum[QuantityQuiColumnEnum["TYPE"] = 2] = "TYPE";
    QuantityQuiColumnEnum[QuantityQuiColumnEnum["UNIT"] = 3] = "UNIT";
    QuantityQuiColumnEnum[QuantityQuiColumnEnum["RESULT"] = 4] = "RESULT";
    QuantityQuiColumnEnum[QuantityQuiColumnEnum["LEO"] = 5] = "LEO";
    QuantityQuiColumnEnum[QuantityQuiColumnEnum["IJ"] = 6] = "IJ";
    QuantityQuiColumnEnum[QuantityQuiColumnEnum["RO"] = 7] = "RO";
})(QuantityQuiColumnEnum = exports.QuantityQuiColumnEnum || (exports.QuantityQuiColumnEnum = {}));
const NewQuantityQuiHeader = () => {
    const header = [];
    header[QuantityQuiColumnEnum.ORIGIN] = {
        text: 'Origem',
        size: 17,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
        }),
    };
    header[QuantityQuiColumnEnum.CHEMICAL] = {
        text: `Agente Químico`,
        size: 18,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
            right: { size: 15 },
        }),
    };
    header[QuantityQuiColumnEnum.TYPE] = {
        text: `Tipo`,
        size: 10,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
        }),
    };
    header[QuantityQuiColumnEnum.UNIT] = {
        text: `unidade`,
        size: 10,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
        }),
    };
    header[QuantityQuiColumnEnum.RESULT] = {
        text: `Resultado da Amostra`,
        size: 10,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
        }),
    };
    header[QuantityQuiColumnEnum.LEO] = {
        text: `LEO`,
        size: 10,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
        }),
    };
    header[QuantityQuiColumnEnum.IJ] = {
        text: `Índice de Julgamento`,
        size: 10,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
            right: { size: 15 },
        }),
    };
    header[QuantityQuiColumnEnum.RO] = {
        text: 'RO',
        size: 15,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
            left: { size: 15 },
        }),
    };
    return header;
};
exports.NewQuantityQuiHeader = NewQuantityQuiHeader;
//# sourceMappingURL=quantityQui.constant.js.map