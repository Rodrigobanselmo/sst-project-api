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
exports.TableBodyElements = exports.borderNoneStyle = void 0;
const docx_1 = require("docx");
const palette_1 = require("../../../../../../../shared/constants/palette");
exports.borderNoneStyle = {
    top: { style: docx_1.BorderStyle.NIL, size: 0 },
    bottom: { style: docx_1.BorderStyle.NIL, size: 0 },
    left: { style: docx_1.BorderStyle.NIL, size: 0 },
    right: { style: docx_1.BorderStyle.NIL, size: 0 },
};
class TableBodyElements {
    tableRow(tableCell) {
        return new docx_1.TableRow({
            children: [...tableCell],
        });
    }
    tableCell(_a) {
        var { text = '', title, size = 10, bold, spacing = { line: 200 }, alignment = docx_1.AlignmentType.LEFT, color } = _a, rest = __rest(_a, ["text", "title", "size", "bold", "spacing", "alignment", "color"]);
        const tex = text || '';
        return new docx_1.TableCell(Object.assign({ children: [
                ...tex.split('\n').map((value) => {
                    const children = [
                        new docx_1.TextRun({
                            text: value,
                            size: 12,
                            color: color || palette_1.palette.text.main.string,
                            bold: !!bold,
                        }),
                    ];
                    if (title)
                        children.push(new docx_1.TextRun({
                            text: title + ' ',
                            size: 12,
                            color: color || palette_1.palette.text.main.string,
                            bold: true,
                        }));
                    return new docx_1.Paragraph({
                        children: children.reverse(),
                        alignment,
                        spacing: Object.assign({ before: 0, after: 0 }, spacing),
                    });
                }),
            ], margins: { top: 0, bottom: 0 }, shading: { fill: palette_1.palette.table.row.string }, verticalAlign: docx_1.VerticalAlign.CENTER, width: { size, type: docx_1.WidthType.PERCENTAGE } }, rest));
    }
}
exports.TableBodyElements = TableBodyElements;
//# sourceMappingURL=body.js.map