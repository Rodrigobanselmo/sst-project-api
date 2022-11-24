"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paragraphFigure = exports.paragraphTableLegend = exports.paragraphTable = exports.textLink = exports.pageBreak = exports.paragraphNormal = void 0;
const docx_1 = require("docx");
const isOdd_1 = require("../../../../../shared/utils/isOdd");
const paragraphNormal = (text, _a = {}) => {
    var { children, color } = _a, options = __rest(_a, ["children", "color"]);
    return new docx_1.Paragraph(Object.assign({ children: [
            ...(children || []),
            ...text
                .split('**')
                .map((text, index) => {
                const isBold = (0, isOdd_1.isOdd)(index);
                return text
                    .split('\n')
                    .map((text, index) => {
                    const isBreak = index != 0;
                    return text.split('<link>').map((text, index) => {
                        const isLink = (0, isOdd_1.isOdd)(index);
                        if (!isLink)
                            return new docx_1.TextRun(Object.assign({ text: text, bold: isBold, break: isBreak ? 1 : 0, size: (options === null || options === void 0 ? void 0 : options.size) ? (options === null || options === void 0 ? void 0 : options.size) * 2 : undefined }, (color ? { color: color } : {})));
                        if (isLink)
                            return (0, exports.textLink)(text, {
                                isBold,
                                isBreak,
                                size: options === null || options === void 0 ? void 0 : options.size,
                            });
                    });
                })
                    .reduce((acc, curr) => [...acc, ...curr], []);
            })
                .reduce((acc, curr) => [...acc, ...curr], []),
        ], spacing: { line: 350 }, alignment: (options === null || options === void 0 ? void 0 : options.align) || docx_1.AlignmentType.JUSTIFIED }, options));
};
exports.paragraphNormal = paragraphNormal;
const pageBreak = () => new docx_1.Paragraph({
    children: [new docx_1.PageBreak()],
});
exports.pageBreak = pageBreak;
const textLink = (text, options = {}) => {
    const link = text.split('|');
    return new docx_1.ExternalHyperlink({
        children: [
            new docx_1.TextRun({
                text: link[1],
                bold: (options === null || options === void 0 ? void 0 : options.isBold) ? options === null || options === void 0 ? void 0 : options.isBold : undefined,
                break: (options === null || options === void 0 ? void 0 : options.isBreak) ? 1 : undefined,
                size: (options === null || options === void 0 ? void 0 : options.size) ? (options === null || options === void 0 ? void 0 : options.size) * 2 : undefined,
                style: 'Hyperlink',
            }),
        ],
        link: link[0],
    });
};
exports.textLink = textLink;
const paragraphTable = (text, options = {}) => (0, exports.paragraphNormal)(text, Object.assign(Object.assign({}, options), { children: [
        new docx_1.TextRun({
            text: 'Tabela ',
            size: 16,
        }),
        new docx_1.TextRun({
            size: 16,
            children: [new docx_1.SequentialIdentifier('Table')],
        }),
        new docx_1.TextRun({
            text: ': ',
            size: 16,
        }),
    ], size: 8, spacing: { after: 70 } }));
exports.paragraphTable = paragraphTable;
const paragraphTableLegend = (text, options = {}) => (0, exports.paragraphNormal)(text, Object.assign({ spacing: { after: 300 }, size: 8, align: docx_1.AlignmentType.START }, options));
exports.paragraphTableLegend = paragraphTableLegend;
const paragraphFigure = (text, options = {}) => {
    var _a;
    return text
        ? (0, exports.paragraphNormal)(text, Object.assign(Object.assign({}, options), { children: [
                new docx_1.TextRun({
                    text: 'Figura ',
                    size: 16,
                }),
                new docx_1.TextRun({
                    size: 16,
                    children: [new docx_1.SequentialIdentifier('Figure')],
                }),
                new docx_1.TextRun({
                    text: ': ',
                    size: 16,
                }),
            ], size: 8, spacing: { after: (_a = options === null || options === void 0 ? void 0 : options.spacingAfter) !== null && _a !== void 0 ? _a : 70 } }))
        : undefined;
};
exports.paragraphFigure = paragraphFigure;
//# sourceMappingURL=paragraphs.js.map