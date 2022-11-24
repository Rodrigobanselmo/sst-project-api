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
exports.TableBodyElements = exports.borderStyle = void 0;
const docx_1 = require("docx");
const palette_1 = require("../../../../../../../shared/constants/palette");
const styles_1 = require("./../../../../base/config/styles");
exports.borderStyle = Object.assign(Object.assign({}, styles_1.borderNoneStyle), { top: {
        style: docx_1.BorderStyle.SINGLE,
        size: 4,
        color: palette_1.palette.common.black.string,
    } });
class TableBodyElements {
    tableRow(tableCell) {
        return new docx_1.TableRow({
            children: [...tableCell],
            cantSplit: true,
            height: { rule: docx_1.HeightRule.ATLEAST, value: 1500 },
        });
    }
    tableCell(_a) {
        var { data, empty } = _a, rest = __rest(_a, ["data", "empty"]);
        return new docx_1.TableCell(Object.assign({ children: [...data], margins: { top: 60, bottom: 60 }, verticalAlign: docx_1.VerticalAlign.TOP, borders: !empty ? exports.borderStyle : styles_1.borderNoneStyle, width: { size: 20, type: docx_1.WidthType.PERCENTAGE } }, rest));
    }
}
exports.TableBodyElements = TableBodyElements;
//# sourceMappingURL=body.js.map