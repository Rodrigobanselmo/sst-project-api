"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.riskCharacterizationTableSection = void 0;
const docx_1 = require("docx");
const riskCharacterization_constant_1 = require("../riskCharacterization/riskCharacterization.constant");
const body_1 = require("./elements/body");
const header_1 = require("./elements/header");
const riskCharacterization_converter_1 = require("./riskCharacterization.converter");
const riskCharacterizationTableSection = (riskFactorGroupData) => {
    const riskCharacterizationData = (0, riskCharacterization_converter_1.riskCharacterizationConverter)(riskFactorGroupData);
    const tableHeaderElements = new header_1.TableHeaderElements();
    const tableBodyElements = new body_1.TableBodyElements();
    const table = new docx_1.Table({
        width: { size: 100, type: docx_1.WidthType.PERCENTAGE },
        rows: [
            tableHeaderElements.headerRow(riskCharacterization_constant_1.riskCharacterizationHeader.map(tableHeaderElements.headerCell)),
            ...riskCharacterizationData.map((data) => tableBodyElements.tableRow(data.map(tableBodyElements.tableCell))),
        ],
    });
    const section = {
        children: [table],
        properties: {
            page: {
                margin: { left: 500, right: 500, top: 500, bottom: 500 },
                size: { orientation: docx_1.PageOrientation.LANDSCAPE },
            },
        },
    };
    return section;
};
exports.riskCharacterizationTableSection = riskCharacterizationTableSection;
//# sourceMappingURL=riskCharacterization.section.js.map