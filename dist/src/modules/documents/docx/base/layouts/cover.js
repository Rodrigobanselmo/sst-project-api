"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coverSections = exports.createCover = void 0;
const docx_1 = require("docx");
const fs_1 = __importDefault(require("fs"));
const styles_1 = require("../config/styles");
const title = () => new docx_1.Paragraph({
    children: [
        new docx_1.TextRun({
            text: 'PROGRAMA DE GERENCIAMENTO DE RISCOS – PGR',
            size: 96,
        }),
    ],
    spacing: { after: 400, before: 0 },
});
const versionDate = (version) => new docx_1.Paragraph({
    children: [
        new docx_1.TextRun({
            text: version,
            size: 40,
        }),
    ],
    spacing: { after: 100, before: 0 },
});
const imageCover = (imgPath) => new docx_1.Paragraph({
    children: [
        new docx_1.ImageRun({
            data: fs_1.default.readFileSync(imgPath),
            transformation: {
                width: 600,
                height: 337,
            },
        }),
    ],
});
const createCover = ({ version, imgPath, }) => {
    return [title(), versionDate(version), imageCover(imgPath)];
};
exports.createCover = createCover;
const coverSections = ({ version, imgPath, }) => {
    return {
        children: [...(0, exports.createCover)({ version, imgPath })],
        properties: styles_1.sectionCoverProperties,
    };
};
exports.coverSections = coverSections;
//# sourceMappingURL=cover.js.map