"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewHeader = void 0;
const palette_1 = require("../../../../../../../../shared/constants/palette");
const styles_1 = require("../../../../../base/config/styles");
const NewHeader = (headerArray) => {
    const header = [];
    header[0] = {
        text: headerArray[0],
        size: 28,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            right: { size: 15 },
            bottom: { size: 15 },
        }),
    };
    header[1] = {
        text: headerArray[1],
        size: 15,
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
        size: 15,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            left: { size: 15 },
            bottom: { size: 15 },
        }),
    };
    return header;
};
exports.NewHeader = NewHeader;
//# sourceMappingURL=header.converter.js.map