"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewBody = void 0;
const docx_1 = require("docx");
const palette_1 = require("../../../../../../../../shared/constants/palette");
const styles_1 = require("../../../../../base/config/styles");
const body_1 = require("./data/body");
const NewBody = () => {
    const rows = [];
    body_1.rowBody.map((row, index) => {
        const cells = [];
        if (row.length == 4)
            cells[0] = {
                text: row[0],
                alignment: docx_1.AlignmentType.CENTER,
                shading: { fill: palette_1.palette.table.header.string },
                margins: { top: 60, bottom: 60, left: 50 },
                rowSpan: index == 1 ? 3 : undefined,
                borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
                    right: { size: 15 },
                }),
            };
        cells[row.length - 3] = {
            text: row[row.length - 3],
            shading: { fill: palette_1.palette.table.rowDark.string },
            margins: { top: 60, bottom: 60, left: 50 },
            alignment: docx_1.AlignmentType.CENTER,
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
        };
        cells[row.length - 2] = {
            text: row[row.length - 2],
            shading: { fill: palette_1.palette.table.rowDark.string },
            margins: { top: 60, bottom: 60, left: 50 },
            alignment: docx_1.AlignmentType.CENTER,
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
        };
        cells[row.length - 1] = {
            text: row[row.length - 1],
            shading: { fill: palette_1.palette.table.rowDark.string },
            margins: { top: 60, bottom: 60, left: 50 },
            alignment: docx_1.AlignmentType.CENTER,
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
        };
        rows.push(cells);
    });
    return rows;
};
exports.NewBody = NewBody;
//# sourceMappingURL=body.converter.js.map