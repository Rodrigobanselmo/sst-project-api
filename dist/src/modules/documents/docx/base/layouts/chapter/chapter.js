"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chapterSection = exports.createChapterPage = void 0;
const setNiceProportion_1 = require("./../../../../../../shared/utils/setNiceProportion");
const docx_1 = require("docx");
const fs_1 = __importDefault(require("fs"));
const image_size_1 = __importDefault(require("image-size"));
const styles_1 = require("../../config/styles");
const text = (text, verticalAlign) => new docx_1.TableCell({
    width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
    children: [
        new docx_1.Paragraph({
            children: [
                new docx_1.TextRun({
                    text: text,
                    size: 36,
                    bold: true,
                }),
            ],
            alignment: docx_1.AlignmentType.CENTER,
        }),
    ],
    verticalAlign,
});
const table = (rows) => new docx_1.Table({
    width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
    rows,
    borders: styles_1.borderNoneStyle,
});
const imageCover = (imgPath, verticalAlign) => {
    const { height: imgHeight, width: imgWidth } = (0, image_size_1.default)(fs_1.default.readFileSync(imgPath));
    const maxWidth = 630;
    const maxHeight = 200;
    const { height, width } = (0, setNiceProportion_1.setNiceProportion)(maxWidth, maxHeight, imgWidth, imgHeight);
    return new docx_1.TableCell({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        children: [
            new docx_1.Paragraph({
                children: [
                    new docx_1.ImageRun({
                        data: fs_1.default.readFileSync(imgPath),
                        transformation: {
                            width,
                            height,
                        },
                    }),
                ],
                alignment: docx_1.AlignmentType.CENTER,
            }),
        ],
        verticalAlign,
    });
};
const createChapterPage = ({ version, chapter, imagePath }) => {
    return table([
        new docx_1.TableRow({
            children: [text('PROGRAMA DE GERENCIAMENTO DE RISCOS – PGR', docx_1.VerticalAlign.TOP)],
            height: { value: 1500, rule: docx_1.HeightRule.EXACT },
        }),
        ...(imagePath
            ? [
                new docx_1.TableRow({
                    children: [imageCover(imagePath, docx_1.VerticalAlign.CENTER)],
                    height: { value: 3000, rule: docx_1.HeightRule.EXACT },
                }),
            ]
            : []),
        new docx_1.TableRow({
            children: [text(chapter, docx_1.VerticalAlign.CENTER)],
            height: { value: 4500, rule: docx_1.HeightRule.EXACT },
        }),
        new docx_1.TableRow({
            children: [text(version, docx_1.VerticalAlign.BOTTOM)],
            height: { value: 4500, rule: docx_1.HeightRule.EXACT },
        }),
    ]);
};
exports.createChapterPage = createChapterPage;
const chapterSection = ({ version, chapter, imagePath }) => {
    return {
        children: [(0, exports.createChapterPage)({ version, chapter, imagePath })],
        properties: styles_1.sectionCoverProperties,
        footers: {
            default: new docx_1.Footer({
                children: [],
            }),
        },
        headers: {
            default: new docx_1.Header({
                children: [],
            }),
        },
    };
};
exports.chapterSection = chapterSection;
//# sourceMappingURL=chapter.js.map