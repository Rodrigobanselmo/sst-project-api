"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityResultsLVTable = void 0;
const docx_1 = require("docx");
const body_1 = require("../../../elements/body");
const header_1 = require("../../../elements/header");
const bodyC5_converter_1 = require("../bodyC5.converter");
const bodyLV_1 = require("../data/bodyLV");
const headerLV_1 = require("../data/headerLV");
const headerC4S_converter_1 = require("../headerC4S.converter");
const quantityResultsLVTable = () => {
    const tableHeaderElements = new header_1.TableHeaderElements();
    const tableBodyElements = new body_1.TableBodyElements();
    const table = new docx_1.Table({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        rows: [
            tableHeaderElements.headerRow((0, headerC4S_converter_1.NewHeaderC4S)(headerLV_1.headerLV).map(tableHeaderElements.headerCell), {
                height: { value: 550, rule: docx_1.HeightRule.EXACT },
            }),
            ...(0, bodyC5_converter_1.NewBodyC5)(bodyLV_1.rowBodyLocalizationVibration).map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell), {
                height: { value: 550, rule: docx_1.HeightRule.ATLEAST },
            })),
        ],
    });
    return table;
};
exports.quantityResultsLVTable = quantityResultsLVTable;
//# sourceMappingURL=quantityResultsLV.js.map