"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarySections = void 0;
const docx_1 = require("docx");
const styles_1 = require("../config/styles");
const summaryText = (text) => new docx_1.Paragraph({
    children: [
        new docx_1.TextRun({
            text: text,
            size: 24,
        }),
    ],
    alignment: docx_1.AlignmentType.CENTER,
    spacing: { after: 400, before: 0 },
});
const summarySections = () => [
    {
        children: [
            summaryText('Sumário'),
            new docx_1.TableOfContents('Summary', {
                hyperlink: true,
            }),
        ],
        properties: styles_1.sectionCoverProperties,
    },
    {
        children: [
            summaryText('Índice de tabelas'),
            new docx_1.TableOfContents('Tables', {
                hyperlink: true,
                captionLabelIncludingNumbers: 'Table',
            }),
        ],
        properties: styles_1.sectionCoverProperties,
    },
    {
        children: [
            summaryText('Índice de imagens'),
            new docx_1.TableOfContents('Tables', {
                hyperlink: true,
                captionLabelIncludingNumbers: 'Table',
            }),
        ],
        properties: styles_1.sectionCoverProperties,
    },
];
exports.summarySections = summarySections;
//# sourceMappingURL=summary.js.map