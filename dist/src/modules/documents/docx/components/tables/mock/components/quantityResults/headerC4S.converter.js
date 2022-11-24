"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewHeaderC4S = void 0;
const palette_1 = require("../../../../../../../../shared/constants/palette");
const styles_1 = require("../../../../../base/config/styles");
const NewHeaderC4S = (headerArray) => {
    const header = [];
    header[0] = {
        text: headerArray[0],
        size: 10,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            right: { size: 15 },
            bottom: { size: 15 },
        }),
    };
    header[1] = {
        text: headerArray[1],
        size: 25,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
        }),
    };
    header[2] = {
        text: headerArray[2],
        size: 40,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            bottom: { size: 15 },
        }),
    };
    header[3] = {
        text: headerArray[3],
        size: 25,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            left: { size: 15 },
            bottom: { size: 15 },
        }),
        columnSpan: 2,
    };
    return header;
};
exports.NewHeaderC4S = NewHeaderC4S;
//# sourceMappingURL=headerC4S.converter.js.map