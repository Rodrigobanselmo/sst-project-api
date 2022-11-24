"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hierarchyPrioritizationPage = void 0;
const client_1 = require("@prisma/client");
const docx_1 = require("docx");
const palette_1 = require("../../../../../../shared/constants/palette");
const styles_1 = require("../../../base/config/styles");
const elements_types_1 = require("../../../builders/pgr/types/elements.types");
const body_1 = require("./elements/body");
const hierarchyPrioritization_tables_1 = require("./hierarchyPrioritization.tables");
const hierarchyPrioritizationPage = (riskFactorGroupData, hierarchiesEntity, hierarchyTree, options = {
    hierarchyType: client_1.HierarchyEnum.OFFICE,
    isByGroup: false,
}, convertToDocx) => {
    const tables = (0, hierarchyPrioritization_tables_1.hierarchyPrioritizationTables)(riskFactorGroupData, hierarchiesEntity, hierarchyTree, options);
    const tableBodyElements = new body_1.TableBodyElements();
    const iterableSections = tables
        .map((table) => {
        return [
            table,
            ...convertToDocx([
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.LEGEND,
                    text: '**Lengenda**',
                    spacing: { after: 0 },
                },
            ]),
            new docx_1.Table({
                width: { size: 40, type: docx_1.WidthType.PERCENTAGE },
                rows: [
                    tableBodyElements.tableRow([
                        {
                            text: 'Avaliação Qualitativa',
                            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
                        },
                        {
                            text: 'Avaliação Quantitativa',
                            borders: (0, styles_1.borderStyleGlobal)(palette_1.palette.common.white.string),
                            shaded: true,
                        },
                    ].map(tableBodyElements.tableCell)),
                ],
            }),
            ...convertToDocx([
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.LEGEND,
                    text: '**MB =** Muito Baixo / **B =** Baixo / **M =** Moderado / **A =** Alto / **MA=** Muito Alto',
                    spacing: { after: 0 },
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.LEGEND,
                    text: 'Vermelho Indica Risco Priorizado Independente do critério ser Qualitativo ou Quantitativo, ou seja, Alto (A) e Muito Alto (A)',
                    color: 'FF0000',
                },
            ]),
        ];
    })
        .reduce((acc, curr) => {
        return [...acc, ...curr];
    }, []);
    return iterableSections;
};
exports.hierarchyPrioritizationPage = hierarchyPrioritizationPage;
//# sourceMappingURL=hierarchyPrioritization.page.js.map