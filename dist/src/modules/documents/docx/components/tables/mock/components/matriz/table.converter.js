"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewTableData = void 0;
const docx_1 = require("docx");
const palette_1 = require("../../../../../../../../shared/constants/palette");
const styles_1 = require("../../../../../base/config/styles");
const matrizRisk_constant_1 = require("../../../../../../constants/matrizRisk.constant");
const NewTableData = () => {
    const legend = {
        text: `**GRAU DE EXPOSIÇÃO**\n**PROBABILIDADE**`,
        size: 5,
        borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
            size: 2,
        }),
        shading: { fill: palette_1.palette.common.white.string },
        alignment: docx_1.AlignmentType.CENTER,
        verticalAlign: docx_1.VerticalAlign.CENTER,
        textDirection: docx_1.TextDirection.BOTTOM_TO_TOP_LEFT_TO_RIGHT,
        rowSpan: matrizRisk_constant_1.matrixRisk[0].length + 1,
        textSize: 7,
        color: palette_1.palette.common.black.string,
    };
    const tableRows = matrizRisk_constant_1.matrixRisk.map((row, probability) => {
        const rowCell = [
            {
                text: `**${String(5 - probability)}**`,
                size: 5,
                borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
                    size: 2,
                }),
                shading: { fill: palette_1.palette.common.black.string },
                alignment: docx_1.AlignmentType.CENTER,
                textSize: 7,
                color: palette_1.palette.common.white.string,
            },
            ...row.map((cell) => {
                const matrix = matrizRisk_constant_1.matrixRiskMap[cell];
                return {
                    text: matrix.table
                        .split('\n')
                        .map((text) => `**${text}**`)
                        .join('\n'),
                    size: 18,
                    borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
                        size: 10,
                    }),
                    shading: { fill: matrix.color },
                    alignment: docx_1.AlignmentType.CENTER,
                    textSize: 7,
                    color: palette_1.palette.common.black.string,
                };
            }),
        ];
        if (probability === 0)
            rowCell.unshift(legend);
        return rowCell;
    });
    const severityRow = Array.from({
        length: matrizRisk_constant_1.matrixRisk.length + 1,
    }).map((_, severity) => {
        return {
            text: `**${severity ? String(severity) : ''}**`,
            size: severity ? 18 : 5,
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
                size: 10,
            }),
            shading: { fill: palette_1.palette.common.black.string },
            alignment: docx_1.AlignmentType.CENTER,
            textSize: 7,
            color: palette_1.palette.common.white.string,
        };
    });
    const lastRow = [
        {
            text: ``,
            size: 5,
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
                size: 2,
            }),
            shading: { fill: palette_1.palette.common.white.string },
            columnSpan: 2,
            textSize: 7,
        },
        {
            text: `GRAU DE EFEITO À SAÚDE (SEVERIDADE)`,
            size: 5,
            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string, {
                size: 2,
            }),
            shading: { fill: palette_1.palette.common.white.string },
            alignment: docx_1.AlignmentType.CENTER,
            columnSpan: matrizRisk_constant_1.matrixRisk.length,
            textSize: 7,
            color: palette_1.palette.common.black.string,
        },
    ];
    tableRows.push(severityRow, lastRow);
    return tableRows;
};
exports.NewTableData = NewTableData;
//# sourceMappingURL=table.converter.js.map