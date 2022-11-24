"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewHeader = exports.NewTopHeader = void 0;
const palette_1 = require("../../../../../../../../shared/constants/palette");
const styles_1 = require("../../../../../base/config/styles");
const NewTopHeader = () => {
    const header = [];
    header[0] = {
        text: 'LIMITES DE DOSES ANUAIS',
        size: 10,
        columnSpan: 4,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {}),
    };
    return header;
};
exports.NewTopHeader = NewTopHeader;
const NewHeader = () => {
    const header = [];
    header[0] = {
        text: 'Grandeza',
        size: 25,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            right: { size: 15 },
            bottom: { size: 15 },
        }),
    };
    header[1] = {
        text: 'Órgão',
        size: 15,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
        }),
    };
    header[2] = {
        text: 'Indivíduo Ocupacionalmente Exposto',
        size: 40,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
        }),
    };
    header[3] = {
        text: 'Indivíduo do Público',
        size: 25,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
        }),
    };
    return header;
};
exports.NewHeader = NewHeader;
//# sourceMappingURL=header.converter.js.map