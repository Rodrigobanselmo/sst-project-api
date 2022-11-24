"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityNoiseTable = void 0;
const docx_1 = require("docx");
const body_1 = require("./elements/body");
const header_1 = require("./elements/header");
const quantityNoise_constant_1 = require("./quantityNoise.constant");
const quantityNoise_converter_1 = require("./quantityNoise.converter");
const quantityNoiseTable = (riskGroupData, hierarchyTree) => {
    const quantityNoiseData = (0, quantityNoise_converter_1.quantityNoiseConverter)(riskGroupData, hierarchyTree);
    const tableHeaderElements = new header_1.TableHeaderElements();
    const tableBodyElements = new body_1.TableBodyElements();
    const quantityNoiseHeader = (0, quantityNoise_constant_1.NewQuantityNoiseHeader)(riskGroupData.isQ5 ? '5' : '3');
    const table = new docx_1.Table({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        rows: [
            tableHeaderElements.headerRow(quantityNoiseHeader.map(tableHeaderElements.headerCell)),
            ...quantityNoiseData.map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
        ],
    });
    return table;
};
exports.quantityNoiseTable = quantityNoiseTable;
//# sourceMappingURL=quantityNoise.table.js.map