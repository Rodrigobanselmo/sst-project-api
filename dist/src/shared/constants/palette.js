"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.palette = exports.hexToColors = void 0;
const hexToColors = (hex) => {
    return { hex: hex, string: hex.substring(1, hex.length) };
};
exports.hexToColors = hexToColors;
exports.palette = {
    table: {
        header: (0, exports.hexToColors)('#82b2e8'),
        row: (0, exports.hexToColors)('#d2e0f0'),
        attention: (0, exports.hexToColors)('#3cbe7d'),
        rowDark: (0, exports.hexToColors)('#acccf0'),
    },
    common: {
        white: (0, exports.hexToColors)('#ffffff'),
        black: (0, exports.hexToColors)('#000000'),
    },
    text: {
        simple: (0, exports.hexToColors)('#014DA2'),
        main: (0, exports.hexToColors)('#000000'),
        attention: (0, exports.hexToColors)('#ff0000'),
    },
    matrix: {
        0: (0, exports.hexToColors)('#ffffff'),
        1: (0, exports.hexToColors)('#3cbe7d'),
        2: (0, exports.hexToColors)('#8fa728'),
        3: (0, exports.hexToColors)('#d9d10b'),
        4: (0, exports.hexToColors)('#d96c2f'),
        5: (0, exports.hexToColors)('#F44336'),
        6: (0, exports.hexToColors)('#000000'),
    },
};
//# sourceMappingURL=palette.js.map