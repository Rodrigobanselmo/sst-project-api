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
exports.TableBodyElements = void 0;
const paragraphs_1 = require("../../../../base/elements/paragraphs");
const docx_1 = require("docx");
const isOdd_1 = require("../../../../../../../shared/utils/isOdd");
const styles_1 = require("../../../../base/config/styles");
const palette_1 = require("../../../../../../../shared/constants/palette");
class TableBodyElements {
    tableRow(tableCell, rowOptions) {
        return new docx_1.TableRow(Object.assign({ children: [...tableCell], cantSplit: true }, rowOptions));
    }
    tableCell(_a) {
        var { text, size = 10, alignment } = _a, rest = __rest(_a, ["text", "size", "alignment"]);
        return new docx_1.TableCell(Object.assign({ children: [
                ...text.split('\n').map((text) => new docx_1.Paragraph({
                    children: [
                        ...text
                            .split('**')
                            .map((text, index) => {
                            const isBold = (0, isOdd_1.isOdd)(index);
                            return text
                                .split('\n')
                                .map((text, index) => {
                                const isBreak = index != 0;
                                return text.split('<link>').map((text) => {
                                    const isLink = (0, isOdd_1.isOdd)(index);
                                    if (!isLink)
                                        return new docx_1.TextRun({
                                            text: text,
                                            bold: isBold,
                                            break: isBreak ? 1 : 0,
                                            size: (rest === null || rest === void 0 ? void 0 : rest.textSize) ? (rest === null || rest === void 0 ? void 0 : rest.textSize) * 2 : 12,
                                            color: (rest === null || rest === void 0 ? void 0 : rest.color) ? rest === null || rest === void 0 ? void 0 : rest.color : undefined,
                                        });
                                    if (isLink)
                                        return (0, paragraphs_1.textLink)(text, {
                                            isBold,
                                            isBreak,
                                            size: (rest === null || rest === void 0 ? void 0 : rest.textSize) ? (rest === null || rest === void 0 ? void 0 : rest.textSize) * 2 : 12,
                                        });
                                });
                            })
                                .reduce((acc, curr) => [...acc, ...curr], []);
                        })
                            .reduce((acc, curr) => [...acc, ...curr], []),
                    ],
                    spacing: {
                        before: 0,
                        after: 0,
                    },
                    alignment,
                })),
            ], margins: { top: 60, bottom: 60 }, verticalAlign: docx_1.VerticalAlign.CENTER, width: { size, type: docx_1.WidthType.PERCENTAGE }, borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.table.rowDark.string) }, rest));
    }
}
exports.TableBodyElements = TableBodyElements;
//# sourceMappingURL=body.js.map