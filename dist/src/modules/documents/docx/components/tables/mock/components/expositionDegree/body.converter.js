"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewBody = void 0;
const docx_1 = require("docx");
const palette_1 = require("../../../../../../../../shared/constants/palette");
const styles_1 = require("../../../../../base/config/styles");
const NewBody = (body) => {
    const rows = [];
    body.map((row) => {
        const cells1 = [];
        const cells2 = [];
        cells1[0] = {
            text: row[0],
            alignment: docx_1.AlignmentType.CENTER,
            shading: { fill: palette_1.palette.table.header.string },
            margins: { top: 60, bottom: 60, left: 50 },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
                right: { size: 15 },
            }),
            rowSpan: 2,
        };
        cells1[1] = {
            text: row[1][0].join('\n'),
            shading: { fill: palette_1.palette.table.rowDark.string },
            margins: { top: 60, bottom: 60, left: 50 },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
        };
        cells1[3] = {
            text: row[2],
            shading: { fill: palette_1.palette.table.header.string },
            margins: { top: 60, bottom: 60, left: 50 },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
                left: { size: 15 },
            }),
            rowSpan: 2,
            alignment: docx_1.AlignmentType.CENTER,
        };
        rows.push(cells1);
        cells2[0] = {
            text: row[1][1].join('\n'),
            shading: { fill: palette_1.palette.table.rowDark.string },
            margins: { top: 60, bottom: 60, left: 50 },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
        };
        rows.push(cells2);
    });
    return rows;
};
exports.NewBody = NewBody;
//# sourceMappingURL=body.converter.js.map