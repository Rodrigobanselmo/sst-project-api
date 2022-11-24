"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewBodyC6 = void 0;
const docx_1 = require("docx");
const palette_1 = require("../../../../../../../../shared/constants/palette");
const styles_1 = require("../../../../../base/config/styles");
const NewBodyC6 = (body) => {
    const rows = [];
    body.map((row) => {
        const cells1 = [];
        cells1[0] = {
            text: row[0],
            alignment: docx_1.AlignmentType.CENTER,
            shading: { fill: palette_1.palette.table.header.string },
            margins: { top: 60, bottom: 60, left: 50 },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {}),
        };
        cells1[1] = {
            text: row[1],
            shading: { fill: palette_1.palette.table.header.string },
            margins: { top: 60, bottom: 60, left: 50 },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
                right: { size: 15 },
            }),
            alignment: docx_1.AlignmentType.CENTER,
        };
        cells1[2] = {
            text: row[2],
            shading: { fill: palette_1.palette.table.rowDark.string },
            margins: { top: 60, bottom: 60, left: 50 },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
            alignment: docx_1.AlignmentType.CENTER,
        };
        cells1[3] = {
            text: row[3],
            shading: { fill: palette_1.palette.table.rowDark.string },
            margins: { top: 60, bottom: 60, left: 50 },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
            alignment: docx_1.AlignmentType.CENTER,
        };
        cells1[4] = {
            text: row[4],
            shading: { fill: palette_1.palette.table.header.string },
            margins: { top: 60, bottom: 60, left: 50 },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
                left: { size: 15 },
            }),
            alignment: docx_1.AlignmentType.CENTER,
        };
        cells1[5] = {
            text: row[5],
            shading: { fill: palette_1.palette.table.header.string },
            margins: { top: 60, bottom: 60, left: 50 },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
            alignment: docx_1.AlignmentType.CENTER,
        };
        rows.push(cells1);
    });
    return rows;
};
exports.NewBodyC6 = NewBodyC6;
//# sourceMappingURL=bodyC6.converter.js.map