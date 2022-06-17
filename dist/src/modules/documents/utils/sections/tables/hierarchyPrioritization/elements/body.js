"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableBodyElements = void 0;
const docx_1 = require("docx");
const palette_1 = require("../../../../../../../shared/constants/palette");
class TableBodyElements {
    tableRow(tableCell) {
        return new docx_1.TableRow({
            children: [...tableCell],
        });
    }
    tableCell(_a) {
        var { text, attention, size = 1 } = _a, rest = __rest(_a, ["text", "attention", "size"]);
        return new docx_1.TableCell(Object.assign({ children: [
                new docx_1.Paragraph({
                    children: [
                        new docx_1.TextRun({
                            text: text || '',
                            size: 12,
                            color: attention
                                ? palette_1.palette.text.attention.string
                                : palette_1.palette.text.main.string,
                            bold: !!attention,
                        }),
                    ],
                    alignment: docx_1.AlignmentType.CENTER,
                }),
            ], margins: { top: 20, bottom: 20 }, shading: { fill: palette_1.palette.table.row.string }, verticalAlign: docx_1.VerticalAlign.CENTER, width: { size, type: docx_1.WidthType.PERCENTAGE } }, rest));
    }
}
exports.TableBodyElements = TableBodyElements;
//# sourceMappingURL=body.js.map