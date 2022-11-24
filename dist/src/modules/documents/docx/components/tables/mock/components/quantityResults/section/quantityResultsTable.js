"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quantityResultsTable = void 0;
const elements_types_1 = require("../../../../../../builders/pgr/types/elements.types");
const table_component_1 = require("../../annualDose/table.component");
const quantityResultsFBVTable_1 = require("../tables/quantityResultsFBVTable");
const quantityResultsHTable_1 = require("../tables/quantityResultsHTable");
const quantityResultsLV_1 = require("../tables/quantityResultsLV");
const quantityResultsQTable_1 = require("../tables/quantityResultsQTable");
const quantityResultsR2Table_1 = require("../tables/quantityResultsR2Table");
const quantityResultsRTable_1 = require("../tables/quantityResultsRTable");
const quantityResultsTable = (convertToDocx) => {
    const table1 = convertToDocx([
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
            text: 'Critério de Interpretação de Resultados Quantitativos (Químicos) (NR-01 item 1.5.7.3.2 alínea f)',
        },
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.LEGEND,
            text: '**Legenda:**\n**MVUE** = Estimativa da Média Verdadeira obtida por tratamento estatístico das avaliações;\n**LEO** = Limite de Exposição Ocupacional;\n**IJ** = Critério estatístico que representa a razão entre o MVUE e o LEO do agente de risco, fornece a porcentagem do MVUE em relação ao LEO.\n**Obs.:** Substâncias carcinogênicas (LINACH/ACGIH) e Fatores de Riscos Químicos cujo Limite de Exposição é valor Teto (NR15/ACGIH) serão monitorados pelo menos 1 vez por ano independente do Risco Ocupacional.',
        },
    ]);
    const table2 = convertToDocx([
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
            text: 'Critério de Interpretação de Resultados Quantitativos (Ruído – Critérios NHO-01) (NR-01 item 1.5.7.3.2 alínea f)',
        },
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.LEGEND,
            text: '**Legenda:**\n**MVUE** = Estimativa da Média Verdadeira obtida por tratamento estatístico das avaliações;\n**LEO** = Limite de Exposição Ocupacional;\n**IJ** = Critério estatístico que representa a razão entre o MVUE e o LEO do agente de risco, fornece a porcentagem do MVUE em relação ao LEO.',
        },
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.BREAK,
        },
    ]);
    const table3 = convertToDocx([
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
            text: 'Critério de Interpretação de Resultados Quantitativos (Ruído – Critérios NR-15) (NR-01 item 1.5.7.3.2 alínea f)',
        },
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.LEGEND,
            text: '**Legenda:**\n**MVUE** = Estimativa da Média Verdadeira obtida por tratamento estatístico das avaliações;\n**LEO** = Limite de Exposição Ocupacional;\n**IJ** = Critério estatístico que representa a razão entre o MVUE e o LEO do agente de risco, fornece a porcentagem do MVUE em relação ao LEO.',
        },
    ]);
    const table4 = convertToDocx([
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
            text: 'Critério de Interpretação de Resultados Quantitativos para trabalhadores aclimatizados (CALOR) (NR-01 item 1.5.7.3.2 alínea f)',
        },
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.LEGEND,
            text: '**Legenda:**\n**LEO** = Limite de Exposição Ocupacional;\n**NA** = Nível de Ação;\n**LII:** Limite Inferior de Incerteza;\n**LSI:** Limite Superior de Incerteza;\n**IBUTG** = Índice de Bulbo Úmido Termômetros de Globo – Unidade em ºC que representa a sobrecarga térmica do trabalhador.',
        },
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.BREAK,
        },
    ]);
    const table5 = convertToDocx([
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
            text: 'Critério de Interpretação de Resultados Quantitativos (Vibração de Corpo Inteiro) (NR-01 item 1.5.7.3.2 alínea f)',
        },
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.LEGEND,
            text: '**Legenda:**\n**aren** = Aceleração resultante de exposição normalizada – corresponde à aceleração resultante de exposição (are) convertida para uma jornada diária padrão de 8 horas;\n**VDVR** = Valor da dose de vibração resultante: corresponde ao valor da dose de vibração representativo da exposição ocupacional diária, considerando a resultante dos três eixos de medição.',
        },
    ]);
    const table6 = convertToDocx([
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
            text: 'Critério de Interpretação de Resultados Quantitativos (Vibração Localizada – Mãos e Braços) (NR-01 item 1.5.7.3.2 alínea f)',
        },
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.LEGEND,
            text: '**Legenda:**\n**aren** = Aceleração resultante de exposição normalizada – corresponde à aceleração resultante de exposição (are) convertida para uma jornada diária padrão de 8 horas.',
        },
    ]);
    const table7 = convertToDocx([
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH_TABLE,
            text: 'Norma CNEN-NE 3.01 (NR-01 item 1.5.7.3.2 alínea f)',
        },
        {
            type: elements_types_1.PGRSectionChildrenTypeEnum.LEGEND,
            text: '**Observação:** Para as atividades que envolvem exposição a Radiações Ionizantes (Raio-X, Alfa, Beta, Gama ou Nêutrons), conforme Anexo 5 da NR 15, consideramos os Limites de Tolerância determinados pela Norma CNEN NE 3.01, conforme tabela acima.',
        },
    ]);
    table1.splice(1, 0, (0, quantityResultsQTable_1.quantityResultsQTable)());
    table2.splice(1, 0, (0, quantityResultsRTable_1.quantityResultsRTable)());
    table3.splice(1, 0, (0, quantityResultsR2Table_1.quantityResultsR2Table)());
    table4.splice(1, 0, (0, quantityResultsHTable_1.quantityResultsHTable)());
    table5.splice(1, 0, (0, quantityResultsFBVTable_1.quantityResultsFBVTable)());
    table6.splice(1, 0, (0, quantityResultsLV_1.quantityResultsLVTable)());
    table7.splice(1, 0, (0, table_component_1.annualDoseTable)());
    return [...table1, ...table2, ...table3, ...table4, ...table5, ...table6];
};
exports.quantityResultsTable = quantityResultsTable;
//# sourceMappingURL=quantityResultsTable.js.map