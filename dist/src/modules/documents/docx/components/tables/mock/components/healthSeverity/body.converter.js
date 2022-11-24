"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewBody = void 0;
const docx_1 = require("docx");
const palette_1 = require("../../../../../../../../shared/constants/palette");
const styles_1 = require("../../../../../base/config/styles");
const NewBody = (body) => {
    const rows = [];
    body.map((row) => {
        const cells = [];
        cells[0] = {
            text: row[0],
            alignment: docx_1.AlignmentType.CENTER,
            shading: { fill: palette_1.palette.table.header.string },
            margins: { top: 60, bottom: 60, left: 50 },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
                right: { size: 15 },
            }),
        };
        cells[1] = {
            text: row[1].join('\n'),
            shading: { fill: palette_1.palette.table.rowDark.string },
            margins: { top: 60, bottom: 60, left: 50 },
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
        };
        rows.push(cells);
    });
    return rows;
};
exports.NewBody = NewBody;
//# sourceMappingURL=body.converter.js.map