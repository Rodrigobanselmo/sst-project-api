"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chapterSection = exports.createChapterPage = void 0;
const docx_1 = require("docx");
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
const createChapterPage = ({ version, chapter }) => {
    return table([
        new docx_1.TableRow({
            children: [
                text('PROGRAMA DE GERENCIAMENTO DE RISCOS – PGR', docx_1.VerticalAlign.TOP),
            ],
            height: { value: 4500, rule: docx_1.HeightRule.EXACT },
        }),
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
const chapterSection = ({ version, chapter, }) => {
    return {
        children: [(0, exports.createChapterPage)({ version, chapter })],
        properties: styles_1.sectionCoverProperties,
    };
};
exports.chapterSection = chapterSection;
//# sourceMappingURL=chapter.js.map