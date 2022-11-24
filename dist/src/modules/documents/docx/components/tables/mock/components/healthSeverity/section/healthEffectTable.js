"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthEffectTable = void 0;
const elements_types_1 = require("../../../../../../builders/pgr/types/elements.types");
const healthSeverityATable_1 = require("../tables/healthSeverityATable");
const healthSeverityBTable_1 = require("../tables/healthSeverityBTable");
const healthSeverityETable_1 = require("../tables/healthSeverityETable");
const healthSeverityFQTable_1 = require("../tables/healthSeverityFQTable");
const healthEffectTable = (convertToDocx) => {
    const table1 = convertToDocx([
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
            text: 'Grau de Efeito à Saúde dos Fatores de Risco Químicos & Físicos – (Severidade)',
        },
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.LEGEND,
            text: '**Fonte:** [AIHA – A Strategy for Assessing and Managing Occupational Exposures, 2015]; [JMV GOBAL - Adaptado:  NR 03 - Embargo e Interdição; NRB 31000/2018; NBR 31010/2012; NBR 12100/2014; ISO 45001/2018; NBR 14153/2014; SCIS DNV; HRN;]',
        },
    ]);
    const table2 = convertToDocx([
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
            text: 'Grau de Efeito à Saúde dos Fatores de Risco Biológicos – (Severidade)',
        },
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.LEGEND,
            text: '**Fonte:** [AIHA – A Strategy for Assessing and Managing Occupational Exposures, 2015]; [JMVGLOBAL - Biológicos]',
        },
    ]);
    const table3 = convertToDocx([
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
            text: 'Grau de Efeito à Saúde dos Fatores de Risco Ergonômicos (Severidade)',
        },
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.LEGEND,
            text: '**Fonte:** [JMV GLOBAL Ergonômicos]',
        },
    ]);
    const table4 = convertToDocx([
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
            text: 'Grau de Efeito à Saúde dos Fatores de Risco Acidentes (Severidade)',
        },
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.LEGEND,
            text: '**Fonte:** [JMV Global – Acidentes]	',
        },
    ]);
    table1.splice(1, 0, (0, healthSeverityFQTable_1.healthSeverityFisQuiTable)());
    table2.splice(1, 0, (0, healthSeverityBTable_1.healthSeverityBioTable)());
    table3.splice(1, 0, (0, healthSeverityETable_1.healthSeverityErgTable)());
    table4.splice(1, 0, (0, healthSeverityATable_1.healthSeverityAciTable)());
    return [...table1, ...table2, ...table3, ...table4];
};
exports.healthEffectTable = healthEffectTable;
//# sourceMappingURL=healthEffectTable.js.map