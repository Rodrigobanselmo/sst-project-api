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
exports.TableHeaderElements = exports.borderRightStyle = exports.borderBottomStyle = exports.whiteColumnBorder = exports.whiteBorder = void 0;
const docx_1 = require("docx");
const palette_1 = require("../../../../../../../shared/constants/palette");
exports.whiteBorder = {
    style: docx_1.BorderStyle.SINGLE,
    color: 'ffffff',
    size: 20,
};
exports.whiteColumnBorder = {
    style: docx_1.BorderStyle.SINGLE,
    color: 'ffffff',
    size: 5,
};
exports.borderBottomStyle = {
    top: { style: docx_1.BorderStyle.NIL },
    bottom: exports.whiteBorder,
    left: { style: docx_1.BorderStyle.NIL },
    right: { style: docx_1.BorderStyle.NIL },
};
exports.borderRightStyle = {
    top: { style: docx_1.BorderStyle.NIL },
    bottom: { style: docx_1.BorderStyle.NIL },
    left: { style: docx_1.BorderStyle.NIL },
    right: exports.whiteBorder,
};
class TableHeaderElements {
    headerTitle(_a) {
        var { text, columnSpan } = _a, props = __rest(_a, ["text", "columnSpan"]);
        return new docx_1.TableRow({
            tableHeader: true,
            children: [
                new docx_1.TableCell(Object.assign({ children: [
                        new docx_1.Paragraph({
                            children: [
                                new docx_1.TextRun({
                                    text: text,
                                    size: 14,
                                    bold: true,
                                    color: '000000',
                                }),
                            ],
                            spacing: {
                                before: 0,
                                after: 0,
                            },
                            alignment: docx_1.AlignmentType.CENTER,
                        }),
                    ], shading: { fill: palette_1.palette.table.header.string }, verticalAlign: docx_1.VerticalAlign.CENTER, columnSpan: columnSpan, margins: { top: 60, bottom: 60 } }, props)),
            ],
        });
    }
    headerRow(tableCell) {
        return new docx_1.TableRow({
            tableHeader: true,
            children: [...tableCell],
        });
    }
    spacing() {
        return new docx_1.Paragraph({
            children: [],
            spacing: { line: 20 },
        });
    }
    headerCell(_a) {
        var { text = '', size = 10 } = _a, rest = __rest(_a, ["text", "size"]);
        return new docx_1.TableCell(Object.assign({ children: [
                ...text.split('\n').map((value) => new docx_1.Paragraph({
                    children: [
                        new docx_1.TextRun({
                            text: value,
                            size: 12,
                            bold: true,
                            color: palette_1.palette.text.main.string,
                        }),
                    ],
                    spacing: {
                        before: 0,
                        after: 0,
                    },
                    alignment: docx_1.AlignmentType.CENTER,
                })),
            ], shading: { fill: palette_1.palette.table.header.string }, verticalAlign: docx_1.VerticalAlign.CENTER, width: { size, type: docx_1.WidthType.PERCENTAGE }, margins: { top: 60, bottom: 60 } }, rest));
    }
}
exports.TableHeaderElements = TableHeaderElements;
//# sourceMappingURL=header.js.map