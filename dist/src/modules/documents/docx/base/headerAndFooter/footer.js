"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFooter = void 0;
const docx_1 = require("docx");
const palette_1 = require("../../../../../shared/constants/palette");
const borderStyle = {
    top: {
        style: docx_1.BorderStyle.SINGLE,
        size: 1,
        color: palette_1.palette.text.simple.string,
    },
    bottom: { style: docx_1.BorderStyle.NIL, size: 0 },
    left: { style: docx_1.BorderStyle.NIL, size: 0 },
    insideVertical: { style: docx_1.BorderStyle.NIL, size: 0 },
    insideHorizontal: { style: docx_1.BorderStyle.NIL, size: 0 },
    right: { style: docx_1.BorderStyle.NIL, size: 0 },
};
const table = (rows) => new docx_1.Table({
    width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
    rows,
    borders: borderStyle,
});
const firstCell = (chapter, version) => new docx_1.TableCell({
    children: [
        new docx_1.Paragraph({
            children: [
                new docx_1.TextRun({
                    text: 'PROGRAMA DE GERENCIAMENTO DE RISCOS – PGR',
                    size: 12,
                    color: palette_1.palette.text.main.string,
                }),
            ],
            alignment: docx_1.AlignmentType.START,
            spacing: { after: 0, before: 100 },
        }),
        new docx_1.Paragraph({
            children: [
                new docx_1.TextRun({
                    text: chapter,
                    size: 12,
                    color: palette_1.palette.text.main.string,
                }),
            ],
            alignment: docx_1.AlignmentType.START,
            spacing: { after: 0, before: 0 },
        }),
        new docx_1.Paragraph({
            children: [
                new docx_1.TextRun({
                    text: version,
                    size: 12,
                    color: palette_1.palette.text.main.string,
                }),
            ],
            alignment: docx_1.AlignmentType.START,
            spacing: { after: 0, before: 0 },
        }),
    ],
});
const secondCell = () => new docx_1.TableCell({
    children: [
        new docx_1.Paragraph({
            children: [
                new docx_1.TextRun({
                    text: 'SIMPLE',
                    size: 42,
                    color: palette_1.palette.text.main.string,
                }),
                new docx_1.TextRun({
                    text: 'SST',
                    size: 42,
                    color: palette_1.palette.text.simple.string,
                }),
            ],
            alignment: docx_1.AlignmentType.END,
            spacing: { after: 0, before: 0 },
        }),
    ],
});
const row = (chapter, version) => new docx_1.TableRow({
    children: [firstCell(chapter, version), secondCell()],
});
const createFooter = ({ chapter, version }) => {
    const footer = {
        default: new docx_1.Footer({
            children: [table([row(chapter, version)])],
        }),
        first: new docx_1.Footer({
            children: [],
        }),
    };
    return footer;
};
exports.createFooter = createFooter;
//# sourceMappingURL=footer.js.map