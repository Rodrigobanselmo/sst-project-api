"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coverSections = exports.createCover = void 0;
const setNiceProportion_1 = require("./../../../../../../shared/utils/setNiceProportion");
const image_size_1 = __importDefault(require("image-size"));
const docx_1 = require("docx");
const fs_1 = __importDefault(require("fs"));
const styles_1 = require("../../config/styles");
const title = () => new docx_1.Paragraph({
    children: [
        new docx_1.TextRun({
            text: 'PROGRAMA DE GERENCIAMENTO DE RISCOS – PGR',
            size: 96,
            bold: true,
        }),
    ],
    spacing: { after: 400, before: 0 },
});
const textShow = (version) => new docx_1.Paragraph({
    children: [
        new docx_1.TextRun({
            text: version,
            size: 40,
        }),
    ],
    spacing: { after: 100, before: 0 },
});
const imageCover = (imgPath) => {
    const { height: imgHeight, width: imgWidth } = (0, image_size_1.default)(fs_1.default.readFileSync(imgPath));
    const maxWidth = 630;
    const maxHeight = 354;
    const { height, width } = (0, setNiceProportion_1.setNiceProportion)(maxWidth, maxHeight, imgWidth, imgHeight);
    return new docx_1.Paragraph({
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
    });
};
const createCover = ({ version, imgPath, companyName }) => {
    if (!imgPath)
        return [title()];
    return [title(), textShow(version), textShow(''), imageCover(imgPath), textShow(''), textShow(''), textShow(companyName)];
};
exports.createCover = createCover;
const coverSections = ({ version, imgPath, companyName }) => {
    return {
        children: [...(0, exports.createCover)({ version, imgPath, companyName })],
        properties: styles_1.sectionCoverProperties,
    };
};
exports.coverSections = coverSections;
//# sourceMappingURL=connapa.js.map