"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VFullWidthImage = void 0;
const docx_1 = require("docx");
const fs_1 = __importDefault(require("fs"));
const paragraphs_1 = require("../paragraphs");
const fullWidth = 718 * 0.8;
const VFullWidthImage = (image, text, options) => {
    return [
        new docx_1.Paragraph(Object.assign({ children: [
                new docx_1.ImageRun({
                    data: fs_1.default.readFileSync(image),
                    transformation: {
                        width: fullWidth * (9 / 16),
                        height: fullWidth,
                    },
                }),
            ] }, options)),
        (0, paragraphs_1.paragraphFigure)(text, { spacingAfter: 200 }),
    ].filter((i) => i);
};
exports.VFullWidthImage = VFullWidthImage;
//# sourceMappingURL=vFullWidthImage.js.map