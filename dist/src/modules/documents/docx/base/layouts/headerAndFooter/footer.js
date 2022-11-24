"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFooter = void 0;
const setNiceProportion_1 = require("./../../../../../../shared/utils/setNiceProportion");
const docx_1 = require("docx");
const palette_1 = require("../../../../../../shared/constants/palette");
const image_size_1 = __importDefault(require("image-size"));
const fs_1 = __importDefault(require("fs"));
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
const firstCell = (footerText, version) => new docx_1.TableCell({
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
                    text: footerText,
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
const secondCell = (consultantLogoPath) => {
    if (!consultantLogoPath)
        new docx_1.TableCell({
            children: [
                new docx_1.Paragraph({
                    children: [
                        new docx_1.TextRun({
                            text: 'SIMPLE',
                            size: 42,
                            color: palette_1.palette.text.main.string,
                            bold: true,
                        }),
                        new docx_1.TextRun({
                            text: 'SST',
                            size: 42,
                            color: palette_1.palette.text.simple.string,
                            bold: true,
                        }),
                    ],
                    alignment: docx_1.AlignmentType.END,
                    spacing: { after: 0, before: 0 },
                }),
            ],
        });
    const getProportion = () => {
        const { height: imgHeight, width: imgWidth } = (0, image_size_1.default)(fs_1.default.readFileSync(consultantLogoPath));
        const maxWidth = 250;
        const maxHeight = 30;
        const { height, width } = (0, setNiceProportion_1.setNiceProportion)(maxWidth, maxHeight, imgWidth, imgHeight);
        return { height, width };
    };
    const image = consultantLogoPath
        ? new docx_1.ImageRun({
            data: fs_1.default.readFileSync(consultantLogoPath),
            transformation: getProportion(),
        })
        : undefined;
    return new docx_1.TableCell({
        verticalAlign: docx_1.VerticalAlign.CENTER,
        children: [
            new docx_1.Paragraph({
                children: [image],
                alignment: docx_1.AlignmentType.END,
                spacing: { after: 0, before: 100 },
            }),
        ],
        margins: { top: 0 },
    });
};
const row = (footerText, version, consultantLogoPath) => new docx_1.TableRow({
    children: [firstCell(footerText, version), secondCell(consultantLogoPath)],
});
const createFooter = ({ footerText, version, consultantLogoPath }) => {
    const footer = {
        default: new docx_1.Footer({
            children: [table([row(footerText, version, consultantLogoPath)])],
        }),
        first: new docx_1.Footer({
            children: [],
        }),
    };
    return footer;
};
exports.createFooter = createFooter;
//# sourceMappingURL=footer.js.map