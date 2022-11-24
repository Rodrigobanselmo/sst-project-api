"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VHImages = void 0;
const docx_1 = require("docx");
const fs_1 = __importDefault(require("fs"));
const styles_1 = require("../../config/styles");
const paragraphs_1 = require("../paragraphs");
const fullWidth = 718;
const VHImages = (images, texts, removeLegend) => {
    if (texts[0] == texts[1]) {
        texts[1] = '';
    }
    if (removeLegend) {
        texts[0] = '';
    }
    return [
        new docx_1.Table({
            width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
            rows: [
                new docx_1.TableRow({
                    children: [
                        new docx_1.TableCell({
                            children: [
                                new docx_1.Paragraph({
                                    children: [
                                        new docx_1.ImageRun({
                                            data: fs_1.default.readFileSync(images[0]),
                                            transformation: {
                                                width: fullWidth / 3 - 5,
                                                height: (fullWidth / 3 - 5) * (16 / 9),
                                            },
                                        }),
                                    ],
                                    spacing: { after: 32 },
                                }),
                            ],
                            width: {
                                size: (fullWidth / 3 - 5 / fullWidth) * 100,
                                type: docx_1.WidthType.PERCENTAGE,
                            },
                            margins: { bottom: 0 },
                        }),
                        new docx_1.TableCell({
                            children: [],
                            width: { size: 10, type: docx_1.WidthType.PERCENTAGE },
                            margins: { bottom: 0 },
                        }),
                        new docx_1.TableCell({
                            children: [
                                new docx_1.Paragraph({
                                    children: [
                                        new docx_1.ImageRun({
                                            data: fs_1.default.readFileSync(images[1]),
                                            transformation: {
                                                width: (fullWidth / 3) * 2 - 5,
                                                height: ((fullWidth / 3) * 2 - 5) * (9 / 16),
                                            },
                                        }),
                                    ],
                                    spacing: { after: 32 },
                                }),
                            ],
                            width: {
                                size: 100 - ((fullWidth / 3 - 5) / fullWidth) * 100,
                                type: docx_1.WidthType.PERCENTAGE,
                            },
                            margins: { bottom: 0 },
                            verticalAlign: docx_1.VerticalAlign.BOTTOM,
                        }),
                    ],
                }),
                new docx_1.TableRow({
                    children: [
                        new docx_1.TableCell({
                            children: [(0, paragraphs_1.paragraphFigure)(texts[0])].filter((i) => i),
                            width: { size: 45, type: docx_1.WidthType.PERCENTAGE },
                        }),
                        new docx_1.TableCell({
                            children: [],
                            width: { size: 10, type: docx_1.WidthType.PERCENTAGE },
                        }),
                        new docx_1.TableCell({
                            children: [(0, paragraphs_1.paragraphFigure)(texts[1])].filter((i) => i),
                            width: { size: 45, type: docx_1.WidthType.PERCENTAGE },
                        }),
                    ],
                }),
            ],
            borders: styles_1.borderNoneStyle,
        }),
    ];
};
exports.VHImages = VHImages;
//# sourceMappingURL=vHImages.js.map