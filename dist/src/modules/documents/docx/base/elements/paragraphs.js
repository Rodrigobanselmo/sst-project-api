"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paragraphNormal = void 0;
const docx_1 = require("docx");
function isOdd(num) {
    return num % 2 === 0 ? false : true;
}
const paragraphNormal = (text, options) => new docx_1.Paragraph(Object.assign({ children: [
        ...text.split('**').map((text, index) => new docx_1.TextRun({
            text: text,
            bold: isOdd(index),
        })),
    ], spacing: { line: 350 }, alignment: docx_1.AlignmentType.JUSTIFIED }, options));
exports.paragraphNormal = paragraphNormal;
//# sourceMappingURL=paragraphs.js.map