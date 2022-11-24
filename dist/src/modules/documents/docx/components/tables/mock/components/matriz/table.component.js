"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matrizTable = void 0;
const docx_1 = require("docx");
const body_1 = require("../../elements/body");
const table_converter_1 = require("./table.converter");
const matrizTable = () => {
    const tableBodyElements = new body_1.TableBodyElements();
    const dataTable = (0, table_converter_1.NewTableData)();
    const table = new docx_1.Table({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        rows: [
            ...dataTable.map((data, index) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell), {
                height: {
                    value: index >= dataTable.length - 2 ? 300 : 600,
                    rule: docx_1.HeightRule.EXACT,
                },
            })),
        ],
    });
    return table;
};
exports.matrizTable = matrizTable;
//# sourceMappingURL=table.component.js.map