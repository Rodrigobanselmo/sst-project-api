"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.available = void 0;
const variables_enum_1 = require("../enums/variables.enum");
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.available = {
    footer: true,
    header: true,
    data: [
        {
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_1}??`,
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H1,
                    text: 'PERIODICIDADE E FORMA DE AVALIAÇÃO',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                    text: 'Avaliação Obrigatória',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'O acompanhamento do programa deverá ser feito pelo Coordenador Geral que promoverá pelo menos uma reunião a cada 2 meses com todos aqueles a quem delegou competência para o desempenho de atividades específicas do programa visando fazer os ajustes necessários no Plano de Ação.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H2,
                    text: 'A avaliação de riscos deve constituir um processo contínuo e ser revista a cada dois anos ou quando da ocorrência das seguintes situações (NR-01 item 1.5.4.4.6):',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET_SPACE,
                    text: 'a) Após implementação das medidas de prevenção, para avaliação de riscos residuais;',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET_SPACE,
                    text: 'b) Após inovações e modificações nas tecnologias, ambientes, processos, condições, procedimentos e organização do trabalho que impliquem em novos riscos ou modifiquem os riscos existentes;',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET_SPACE,
                    text: 'c) Quando identificadas inadequações, insuficiências ou ineficácias das medidas de prevenção;',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET_SPACE,
                    text: 'd) Na ocorrência de acidentes ou doenças relacionadas ao trabalho;',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET_SPACE,
                    text: 'e) Quando houver mudança nos requisitos legais aplicáveis.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'No caso de organizações que possuírem certificações em sistema de gestão de SST, o prazo poderá ser de até 3 (três) anos **(NR-01 item 1.5.4.4.6.1)**.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: 'O levantamento preliminar de perigos deve ser realizado **(NR-01 item 1.5.4.2)**:',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET_SPACE,
                    text: 'a) Antes do início do funcionamento do estabelecimento ou novas instalações;',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET_SPACE,
                    text: 'b) Para as atividades existentes; e',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET_SPACE,
                    text: 'c) Nas mudanças e introdução de novos processos ou atividades de trabalho.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H3,
                    text: 'Validade máxima deste PGR',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: `Como a empresa ??${variables_enum_1.VariablesPGREnum.COMPANY_SHORT_NAME}?? não possui sistemas de Gestão em SST esse PGR terá validade de dois anos.`,
                    removeWithAllValidVars: [variables_enum_1.VariablesPGREnum.COMPANY_HAS_SST_CERTIFICATION],
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: `Como a empresa ??${variables_enum_1.VariablesPGREnum.COMPANY_SHORT_NAME}?? possui sistemas de Gestão em SST esse PGR terá validade de três anos.`,
                    removeWithSomeEmptyVars: [variables_enum_1.VariablesPGREnum.COMPANY_HAS_SST_CERTIFICATION],
                },
            ],
        },
    ],
};
//# sourceMappingURL=1.9.3-avaliation.js.map