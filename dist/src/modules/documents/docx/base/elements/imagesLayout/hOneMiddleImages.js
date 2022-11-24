"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOneMiddleImages = void 0;
const docx_1 = require("docx");
const fs_1 = __importDefault(require("fs"));
const styles_1 = require("../../config/styles");
const paragraphs_1 = require("../paragraphs");
const fullWidth = 718;
const HOneMiddleImages = (image, text) => {
    return [
        new docx_1.Table({
            width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
            rows: [
                new docx_1.TableRow({
                    children: [
                        new docx_1.TableCell({
                            children: [
                                new docx_1.Paragraph({
                                    children: [],
                                }),
                            ],
                            width: { size: 27, type: docx_1.WidthType.PERCENTAGE },
                            margins: { bottom: 0 },
                        }),
                        new docx_1.TableCell({
                            children: [
                                new docx_1.Paragraph({
                                    children: [
                                        new docx_1.ImageRun({
                                            data: fs_1.default.readFileSync(image),
                                            transformation: {
                                                width: fullWidth / 2 - 5,
                                                height: 404 / 2,
                                            },
                                        }),
                                    ],
                                    spacing: { after: 32 },
                                }),
                            ],
                            width: { size: 46, type: docx_1.WidthType.PERCENTAGE },
                            margins: { bottom: 0 },
                        }),
                        new docx_1.TableCell({
                            children: [
                                new docx_1.Paragraph({
                                    children: [],
                                }),
                            ],
                            width: { size: 27, type: docx_1.WidthType.PERCENTAGE },
                            margins: { bottom: 0 },
                        }),
                    ],
                }),
                new docx_1.TableRow({
                    children: [
                        new docx_1.TableCell({
                            children: [
                                new docx_1.Paragraph({
                                    children: [],
                                }),
                            ],
                            width: { size: 5, type: docx_1.WidthType.PERCENTAGE },
                        }),
                        new docx_1.TableCell({
                            children: [(0, paragraphs_1.paragraphFigure)(text)].filter((i) => i),
                            width: { size: 90, type: docx_1.WidthType.PERCENTAGE },
                        }),
                        new docx_1.TableCell({
                            children: [
                                new docx_1.Paragraph({
                                    children: [],
                                }),
                            ],
                            width: { size: 5, type: docx_1.WidthType.PERCENTAGE },
                        }),
                    ],
                }),
            ],
            borders: styles_1.borderNoneStyle,
        }),
    ];
};
exports.HOneMiddleImages = HOneMiddleImages;
//# sourceMappingURL=hOneMiddleImages.js.map