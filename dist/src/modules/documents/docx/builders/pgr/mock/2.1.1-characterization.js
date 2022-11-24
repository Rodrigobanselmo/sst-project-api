"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.characterizationSection = void 0;
const variables_enum_1 = require("../enums/variables.enum");
const elements_types_1 = require("../types/elements.types");
const section_types_1 = require("../types/section.types");
exports.characterizationSection = {
    footer: true,
    header: true,
    data: [
        {
            type: section_types_1.PGRSectionTypeEnum.SECTION,
            footerText: `??${variables_enum_1.VariablesPGREnum.CHAPTER_2}??`,
            children: [
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.H1,
                    text: 'CARACTERIZAÇÃO DAS ATIVIDADES / (NR-01 ‘item’ 1.5.7.3.2 alínea b)',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: `A caracterização da Mão de Obra é mais eficiente quando se analisa as diversas Atividades/Tarefas; Postos de Trabalho e Equipamentos sendo uma ferramenta importante na graduação do Risco Ocupacional dos empregados, pois fornece uma visão detalhada dos Procedimentos Operacionais (PO), permitindo identificar os riscos presentes e as fontes geradoras desses riscos. Através da análise de cada etapa dos PO's, sejam esses formalizados (escritos e oficiais), ou não, fornecendo uma visão do GRO da teoria à prática. A caracterização da Mão de Obra neste PGR foi categorizada de três formas:`,
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Posto de Trabalho:** Consiste na análise dos Fatores de Riscos e Perigos (FR/P) com base nas características dos locais onde as principais tarefas são executadas, é fundamental para entender como o local de trabalho afeta as atividades executadas e consequentemente impactam no FR/P.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Atividades:** Consiste na análise dos Fatores de Riscos e Perigos (FR/P) com base nas características das atividades executadas, é fundamental para entender como a forma de executar os procedimentos operacionais (tarefas rotineiras de cada trabalhador) impactam no FR/P.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.BULLET,
                    text: '**Equipamentos:** Consiste na análise dos Fatores de Riscos e Perigos (FR/P) com base nas características dos equipamentos e ferramentas com que as principais tarefas são executadas, é fundamental para entender como estes "intrumentos" afetam as atividades executadas e consequentemente impactam no FR/P.',
                },
                {
                    type: elements_types_1.PGRSectionChildrenTypeEnum.PARAGRAPH,
                    text: `A seguir é apresentada uma relação das diversas Categorias de Caracterização da Mão de Obra  da **??${variables_enum_1.VariablesPGREnum.COMPANY_SHORT_NAME}??** com suas descrições e respectivos Fatores de Riscos e Perigos identificados.`,
                },
            ],
        },
        {
            type: section_types_1.PGRSectionTypeEnum.ITERABLE_CHARACTERIZATION,
        },
    ],
};
//# sourceMappingURL=2.1.1-characterization.js.map