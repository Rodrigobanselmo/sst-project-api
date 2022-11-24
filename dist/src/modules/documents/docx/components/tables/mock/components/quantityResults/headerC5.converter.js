"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewHeaderC5 = void 0;
const palette_1 = require("../../../../../../../../shared/constants/palette");
const styles_1 = require("../../../../../base/config/styles");
const NewHeaderC5 = (headerArray) => {
    const header = [];
    header[0] = {
        text: headerArray[0],
        size: 10,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
        }),
    };
    header[1] = {
        text: headerArray[1],
        size: 10,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
            right: { size: 15 },
        }),
    };
    header[2] = {
        text: headerArray[2],
        size: 15,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
        }),
    };
    header[3] = {
        text: headerArray[3],
        size: 40,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
        }),
    };
    header[4] = {
        text: headerArray[4],
        size: 25,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            left: { size: 15 },
            bottom: { size: 15 },
        }),
        columnSpan: 2,
    };
    return header;
};
exports.NewHeaderC5 = NewHeaderC5;
//# sourceMappingURL=headerC5.converter.js.map