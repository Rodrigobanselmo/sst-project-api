"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pageBreak = exports.paragraphNormal = void 0;
const docx_1 = require("docx");
function isOdd(num) {
    return num % 2 === 0 ? false : true;
}
const paragraphNormal = (text, options) => new docx_1.Paragraph(Object.assign({ children: [
        ...text
            .split('**')
            .map((text, index) => {
            const isBold = isOdd(index);
            return text.split('\n').map((text, index) => {
                const isBreakOne = isOdd(index);
                return new docx_1.TextRun({
                    text: text,
                    bold: isBold,
                    break: isBreakOne ? 1 : 0,
                });
            });
        })
            .reduce((acc, curr) => [...acc, ...curr], []),
    ], spacing: { line: 350 }, alignment: docx_1.AlignmentType.JUSTIFIED }, options));
exports.paragraphNormal = paragraphNormal;
const pageBreak = () => new docx_1.Paragraph({
    children: [new docx_1.PageBreak()],
});
exports.pageBreak = pageBreak;
//# sourceMappingURL=paragraphs.js.map