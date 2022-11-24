"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expositionDegreeTable = void 0;
const elements_types_1 = require("../../../../../../builders/pgr/types/elements.types");
const expositionDegreeATable_1 = require("../tables/expositionDegreeATable");
const expositionDegreeBTable_1 = require("../tables/expositionDegreeBTable");
const expositionDegreeETable_1 = require("../tables/expositionDegreeETable");
const expositionDegreeFQTable_1 = require("../tables/expositionDegreeFQTable");
const expositionDegreeTable = (convertToDocx) => {
    const table1 = convertToDocx([
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
            text: 'Grau de Exposição dos Trabalhadores dos Fatores de Riscos Químicos & Físicos (Probabilidade)',
        },
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.LEGEND,
            text: '**Fonte:** [AIHA - A Strategy for Assessing and Managing Occupational Exposures, 2015]; NHO-01; NHO-06; NHO-09; NHO-10; [JMV GOBAL - Adaptado: NR 03 - Embargo e Interdição; NRB 31000/2018; NBR 31010/2012; NBR 12100/2014; ISO 45001/2018; NBR 14153/2014; SCIS DNV; HRN;]',
        },
    ]);
    const table2 = convertToDocx([
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
            text: 'Grau de Exposição dos Trabalhadores dos Fatores de Riscos Biológicos (Probabilidade)',
        },
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.LEGEND,
            text: '**Fonte:** [JMV Global – Biológicos]',
        },
    ]);
    const table3 = convertToDocx([
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
            text: 'Grau de Exposição dos Trabalhadores aos Fatores de Riscos Ergonômicos (Probabilidade)',
        },
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.LEGEND,
            text: '**Fonte:** [JMV GLOBAL Ergonômicos]',
        },
    ]);
    const table4 = convertToDocx([
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
            text: 'Grau de Exposição dos Trabalhadores Perigos ou Fatores de Riscos de Acidentes (Probabilidade)',
        },
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.LEGEND,
            text: '**Fonte:** [JMV Global – Acidentes]	',
        },
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.LEGEND,
            text: '**Obs.:** Para análise de acidentes pode ser necessário se adotar critérios e metodologias específicas para melhor adequar ao cenário de risco **(NR-01 item 1.5.3.4.4.2.1)**.',
        },
    ]);
    table1.splice(1, 0, (0, expositionDegreeFQTable_1.expositionDegreeFQTable)());
    table2.splice(1, 0, (0, expositionDegreeBTable_1.expositionDegreeBTable)());
    table3.splice(1, 0, (0, expositionDegreeETable_1.expositionDegreeETable)());
    table4.splice(1, 0, (0, expositionDegreeATable_1.expositionDegreeATable)());
    return [...table1, ...table2, ...table3, ...table4];
};
exports.expositionDegreeTable = expositionDegreeTable;
//# sourceMappingURL=expositionDegreeTable.js.map