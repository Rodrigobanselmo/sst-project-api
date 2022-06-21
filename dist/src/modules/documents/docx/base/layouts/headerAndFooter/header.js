"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHeader = void 0;
const docx_1 = require("docx");
const fs_1 = __importDefault(require("fs"));
const borderStyle = {
    top: { style: docx_1.BorderStyle.NIL, size: 0 },
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
const firstCell = (path) => new docx_1.TableCell({
    verticalAlign: docx_1.VerticalAlign.CENTER,
    children: [
        new docx_1.Paragraph({
            children: [
                new docx_1.ImageRun({
                    data: fs_1.default.readFileSync(path),
                    transformation: {
                        width: 45,
                        height: 25,
                    },
                }),
            ],
        }),
    ],
});
const secondCell = () => new docx_1.TableCell({
    verticalAlign: docx_1.VerticalAlign.CENTER,
    children: [
        new docx_1.Paragraph({
            children: [
                new docx_1.TextRun({
                    children: [docx_1.PageNumber.CURRENT],
                    size: 16,
                }),
            ],
            alignment: docx_1.AlignmentType.END,
            spacing: { after: 0, before: 0 },
        }),
    ],
});
const row = (path) => new docx_1.TableRow({
    children: [firstCell(path), secondCell()],
});
const createHeader = ({ path }) => {
    const header = {
        default: new docx_1.Header({
            children: [table([row(path)])],
        }),
        first: new docx_1.Header({
            children: [],
        }),
    };
    return header;
};
exports.createHeader = createHeader;
//# sourceMappingURL=header.js.map