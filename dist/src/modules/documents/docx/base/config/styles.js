"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.borderStyleGlobal = exports.borderNoneStyle = exports.sectionCoverProperties = exports.sectionLandscapeProperties = exports.sectionProperties = exports.convertToParagraphBox = exports.convertToParagraph = exports.convertToEmu = exports.pageWidthParagraphBox = exports.pageWidthParagraph = exports.pageHeightEmu = exports.pageWidthEmu = exports.pageHeight = exports.pageWidth = void 0;
const docx_1 = require("docx");
const EMU = 1014400;
exports.pageWidth = 790;
exports.pageHeight = 1125;
exports.pageWidthEmu = EMU * 7.42;
exports.pageHeightEmu = EMU * 10.5;
exports.pageWidthParagraph = 11000;
exports.pageWidthParagraphBox = 12000;
const convertToEmu = (value, type) => {
    if (type === 'h')
        return Math.floor(value * (exports.pageHeightEmu / exports.pageHeight));
    if (type === 'w')
        return Math.floor(value * (exports.pageWidthEmu / exports.pageWidth));
};
exports.convertToEmu = convertToEmu;
const convertToParagraph = (value) => {
    return Math.floor(value * (exports.pageWidthParagraph / exports.pageWidth));
};
exports.convertToParagraph = convertToParagraph;
const convertToParagraphBox = (value) => {
    return Math.floor(value * (exports.pageWidthParagraphBox / exports.pageWidth));
};
exports.convertToParagraphBox = convertToParagraphBox;
exports.sectionProperties = {
    page: {
        margin: {
            bottom: 900,
            left: 567,
            right: 567,
            top: 567,
            footer: 300,
            header: 300,
        },
    },
};
exports.sectionLandscapeProperties = {
    page: {
        margin: {
            left: 500,
            right: 500,
            top: 500,
            bottom: 500,
            footer: 300,
            header: 300,
        },
        size: { orientation: docx_1.PageOrientation.LANDSCAPE },
    },
};
exports.sectionCoverProperties = {
    page: {
        margin: {
            bottom: 1133,
            left: 1133,
            right: 1133,
            top: 1133,
            footer: 100,
            header: 100,
        },
    },
};
exports.borderNoneStyle = {
    top: { style: docx_1.BorderStyle.NIL, size: 0 },
    bottom: { style: docx_1.BorderStyle.NIL, size: 0 },
    left: { style: docx_1.BorderStyle.NIL, size: 0 },
    insideVertical: { style: docx_1.BorderStyle.NIL, size: 0 },
    insideHorizontal: { style: docx_1.BorderStyle.NIL, size: 0 },
    right: { style: docx_1.BorderStyle.NIL, size: 0 },
};
const borderStyleGlobal = (color, options = {
    bottom: {},
    left: {},
    right: {},
    top: {},
    insideHorizontal: {},
    insideVertical: {},
    size: 1,
}) => ({
    top: Object.assign({ style: docx_1.BorderStyle.SINGLE, size: options.size, color: color }, options.top),
    bottom: Object.assign({ style: docx_1.BorderStyle.SINGLE, size: options.size, color: color }, options.bottom),
    left: Object.assign({ style: docx_1.BorderStyle.SINGLE, size: options.size, color: color }, options.left),
    insideVertical: Object.assign({ style: docx_1.BorderStyle.SINGLE, size: options.size, color: color }, options.insideVertical),
    insideHorizontal: Object.assign({ style: docx_1.BorderStyle.SINGLE, size: options.size, color: color }, options.insideHorizontal),
    right: Object.assign({ style: docx_1.BorderStyle.SINGLE, size: options.size, color: color }, options.right),
});
exports.borderStyleGlobal = borderStyleGlobal;
//# sourceMappingURL=styles.js.map