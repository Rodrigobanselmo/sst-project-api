"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.headerConverter = void 0;
const palette_1 = require("../../../../../../../../shared/constants/palette");
const styles_1 = require("../../../../../base/config/styles");
const NewHeader = () => {
    const header = [];
    header[0] = {
        text: 'GRAU',
        size: 12,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            right: { size: 15 },
            bottom: { size: 15 },
        }),
    };
    header[1] = {
        text: 'CARACTERÍSTICAS DA EXPOSIÇÃO (Probabilidade)',
        size: 66,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
            right: { size: 15 },
        }),
    };
    header[2] = {
        text: 'Critérios de Controle',
        size: 22,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
        }),
    };
    return header;
};
exports.headerConverter = NewHeader();
//# sourceMappingURL=header.converter.js.map