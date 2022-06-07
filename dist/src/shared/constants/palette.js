"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.palette = exports.hexToColors = void 0;
const hexToColors = (hex) => {
    return { hex: hex, string: hex.substring(1, hex.length) };
};
exports.hexToColors = hexToColors;
exports.palette = {
    table: { header: (0, exports.hexToColors)('#fca557'), row: (0, exports.hexToColors)('#fcf2e8') },
    text: { main: (0, exports.hexToColors)('#000000'), attention: (0, exports.hexToColors)('#ff0000') },
};
//# sourceMappingURL=palette.js.map